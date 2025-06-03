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

// Method to fetch cached data from the Valkey deployment
// else run the given function to fetch the data and cache it
export const runCachedQueries = async (
  key: string,
  elseCacheFunction: () => Promise<string>,
  ttl: number = 3600,
): Promise<string> => {
  // Fetch value for the given key
  const cacheClient = await fetchCacheClient();
  const cachedResult = await cacheClient.sendCommand(["GET", key]);

  // If the value for the key does not exist,
  // fetch actual data from the function
  // and cache it in Valkey
  if (cachedResult == null) {
    const actualResult = await elseCacheFunction();

    cacheClient.sendCommand(["SETEX", key, ttl, actualResult]);
    return actualResult;
  } // Else return cached data
  else {
    return cachedResult.toString();
  }
};
