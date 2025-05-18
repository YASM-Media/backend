import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Created and Updated Column Names
const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// ------------ AUTHENTICATION INFO TABLE ------------ //
export const authenticationInfo = pgTable("authentication_info", {
  keycloakId: uuid("keycloak_id").primaryKey().notNull().unique(),
  createdAt,
  updatedAt,
});

export type AuthenticationInfo = typeof authenticationInfo.$inferSelect;
