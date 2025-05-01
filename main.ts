import { Context, Hono } from "hono";
import { fetchCacheClient } from "./cache/client.ts";

const app = new Hono();

app.get("/", async (c: Context) => {
  const cacheClient = await fetchCacheClient();
  console.log(await cacheClient.sendCommand(["PING"]));
  return c.text("Hello Hono!");
});

Deno.serve({ port: 9080 }, app.fetch);
