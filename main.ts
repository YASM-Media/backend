import { Context, Hono } from "hono";
import { jwk } from "hono/jwk";
import { fetchCacheClient } from "./cache/client.ts";

const app = new Hono();

app.use(
  "*",
  jwk({
    jwks_uri: Deno.env.get("AUTHENTICATION_JWKS")!,
  }),
);

app.get("/", async (c: Context) => {
  const cacheClient = await fetchCacheClient();
  console.log(await cacheClient.sendCommand(["PING"]));
  return c.text("Hello Hono!");
});

Deno.serve({ port: 9080 }, app.fetch);
