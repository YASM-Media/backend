import { Context, Hono } from "hono";
import { jwk } from "hono/jwk";
import { cors } from "hono/cors";
import { fetchCacheClient } from "./cache/client.ts";
import * as authenticationInfoService from "./database/services/authentication_info.ts";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: Deno.env.get("CORS_ORIGIN_WHITELIST")!.split(","),
    allowHeaders: ["Authorization"],
    allowMethods: ["GET"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use(
  "*",
  jwk({
    jwks_uri: Deno.env.get("AUTHENTICATION_JWKS")!,
  }),
);

app.get("/", async (c: Context) => {
  const cacheClient = await fetchCacheClient();
  console.log(await cacheClient.sendCommand(["PING"]));

  console.log(
    await authenticationInfoService.selectManyAuthenticationInfo(),
  );

  return c.text("Hello Hono!");
});

Deno.serve({ port: 9080 }, app.fetch);
