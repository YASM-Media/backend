import { Context, Hono } from "hono";
import { jwk } from "hono/jwk";
import { cors } from "hono/cors";
import { userinfo } from "./middleware/userinfo.ts";

const app = new Hono();

app.use(
  cors({
    origin: Deno.env.get("CORS_ORIGIN_WHITELIST")!.split(","),
    allowHeaders: ["Authorization"],
    allowMethods: ["GET"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use(
  jwk({
    jwks_uri: Deno.env.get("AUTHENTICATION_JWKS")!,
  }),
);

app.use(userinfo);

app.get("/", (c: Context) => {
  return c.json(JSON.parse(c.get("userinfo")));
});

Deno.serve({ port: 9080 }, app.fetch);
