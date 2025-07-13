import { createMiddleware } from "hono/factory";
import { runCachedQueries } from "../cache/client.ts";
import { selectOneAuthenticationInfo } from "./../database/services/authentication_info.ts";

// Method to fetch user information from Keycloak
const fetchUserInfo = async (bearerToken: string) => {
  // Send a GET HTTP request to the Keycloak Userinfo endpoint
  const response = await fetch(Deno.env.get("USERINFO_ENDPOINT")!, {
    headers: {
      "Authorization": `Bearer ${bearerToken}`,
    },
  });

  // TODO: Handle errors more gracefully
  if (response.status >= 400) {
    return {
      "error": "an error occurred",
    };
  }

  // Return Response JSON
  return await response.json();
};

// Hono Middleware to fetch userinfo from Keycloak
export const userinfo = createMiddleware(async (c, next) => {
  // Fetch bearer token from the headers
  const bearerToken = c.req.header("Authorization")?.split("Bearer ")[1];

  // Either fetch cached user info from Valkey else
  // fetch user info from Keycloak
  const cachedKeycloakUserInfo = await runCachedQueries(
    `user_info_middleware_${bearerToken}`,
    async () => {
      const userInfo = await fetchUserInfo(bearerToken!);
      return JSON.stringify(userInfo);
    },
    60 * 5,
  );

  // Set userinfo data for the current request
  c.set("userinfo", cachedKeycloakUserInfo);

  if (c.req.path != "/auth") {
    // Either fetch cached authentication info from Valkey else
    // fetch authentication info from the database
    const cachedAuthenticationInfo = await runCachedQueries(
      `authentication_info_middleware_${bearerToken}`,
      async () => {
        const keycloakUserInfo = JSON.parse(c.get("userinfo"));

        const authenticationInfo = await selectOneAuthenticationInfo(
          keycloakUserInfo["sub"],
        );
        return authenticationInfo == null
          ? ""
          : JSON.stringify(authenticationInfo);
      },
      60 * 5,
    );

    // Set AuthenticationInfo data for the current request
    c.set("authenticationinfo", cachedAuthenticationInfo);
  }

  // Next
  await next();
});
