import { Context, Hono } from "hono";
import { jwk } from "hono/jwk";
import { cors } from "hono/cors";
import { userinfo } from "./middleware/userinfo.ts";
import auth from "./controllers/auth/auth.ts";

// Main Application Router
const app = new Hono();

// CORS Middleware
app.use(
  cors({
    origin: Deno.env.get("CORS_ORIGIN_WHITELIST")!.split(","),
    allowHeaders: ["Authorization"],
    allowMethods: ["GET"],
    maxAge: 600,
    credentials: true,
  }),
);

// JWKS Middleware for Authentication
app.use(
  jwk({
    jwks_uri: Deno.env.get("AUTHENTICATION_JWKS")!,
  }),
);

// Userinfo Middleware for fetching User Info from Keycloak
app.use(userinfo);

app.get("/", (c: Context) => {
  return c.json(JSON.parse(c.get("authenticationinfo")));
});

// ------------- Controllers for Different Modules ------------- #
app.route("/", auth);

Deno.serve({ port: 9080 }, app.fetch);
