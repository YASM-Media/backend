import { RedisClient } from "@iuioiua/redis";
import fetchFile from "../utils/fetch_file.ts";

let valkeyClient: RedisClient;

// Generate a Singleton for the Valkey Client and return that
export const fetchCacheClient = async (): Promise<RedisClient> => {
  if (valkeyClient != null) return valkeyClient;

  // All communications with the Valkey Database will be through TLS
  const valkeyConnection = await Deno.connectTls({
    hostname: Deno.env.get("VALKEY_HOST")!,
    port: Number(Deno.env.get("VALKEY_PORT")!),
    key: await fetchFile(Deno.env.get("VALKEY_TLS_KEY")!),
    cert: await fetchFile(Deno.env.get("VALKEY_TLS_CERTIFICATE")!),
    caCerts: [await fetchFile(Deno.env.get("VALKEY_CA_CERTIFICATE")!)],
  });

  // Generate Valkey Client Singleton and authenticate with it
  valkeyClient = new RedisClient(valkeyConnection);
  valkeyClient.sendCommand(["AUTH", Deno.env.get("VALKEY_PASSWORD")!]);

  return valkeyClient;
};
