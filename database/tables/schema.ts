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

// ------------ USER INFO TABLE ------------ //
export const userInfo = pgTable("user_info", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  keycloakId: uuid("keycloak_id").references(() =>
    authenticationInfo.keycloakId
  ),
  createdAt,
  updatedAt,
});

export type UserInfo = typeof userInfo.$inferSelect;

// ------------ RELATIONS ------------ //

// Authentication Info <----ONE----> User Info
export const authenticationInfoUserInfoRelation = relations(
  authenticationInfo,
  ({ one }) => ({
    userInfo: one(userInfo),
  }),
);

export const userInfoAuthenticationInfoRelation = relations(
  userInfo,
  ({ one }) => ({
    authenticationInfo: one(authenticationInfo, {
      fields: [userInfo.keycloakId],
      references: [authenticationInfo.keycloakId],
    }),
  }),
);
