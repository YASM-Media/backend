import { defineConfig } from "drizzle-kit";

// Drizzle Configuration for Migrations
export default defineConfig({
  out: "./drizzle",
  schema: "./database/tables/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
