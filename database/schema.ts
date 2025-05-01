import { pgTable, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  keycloakId: uuid().notNull().unique(),
});
