import {
  insertAuthenticationInfo,
  selectOneAuthenticationInfo,
} from "./../../database/services/authentication_info.ts";
import { insertUserInfo } from "./../../database/services/user_info.ts";
import { fetchCacheClient } from "./../../cache/client.ts";
import { Hono } from "hono";
import type { Context } from "hono";

const auth = new Hono();

auth.post("/auth", async (context: Context) => {
  // Fetch Cache Client to store authentication info
  const cache = await fetchCacheClient();

  // Fetch user details from context
  const userInfo = JSON.parse(context.get("userinfo"));

  // Fetch authentication info for the current user if it exists
  let authenticationInfo = await selectOneAuthenticationInfo(userInfo["sub"]);

  if (authenticationInfo == null) {
    // Insert new authentication info details
    await insertAuthenticationInfo({
      keycloakId: userInfo["sub"],
    });

    // Insert new user info details
    await insertUserInfo({
      keycloakId: userInfo["sub"],
      firstName: userInfo["given_name"],
      lastName: userInfo["family_name"],
    });

    // Refetch authentication details after inserting the required data
    authenticationInfo = await selectOneAuthenticationInfo(userInfo["sub"]);
  }

  // Save user details in cache
  cache.sendCommand([
    "SETEX",
    `authenticationinfo-${userInfo["sub"]}`,
    60 * 5,
    JSON.stringify(authenticationInfo),
  ]);

  // Return user details
  return context.json(authenticationInfo);
});

export default auth;
