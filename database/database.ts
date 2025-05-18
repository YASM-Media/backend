import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./tables/schema.ts";

// Database info
export const database = drizzle(Deno.env.get("DATABASE_URL")!, { schema });
