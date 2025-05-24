import { database } from "../database.ts";
import { eq } from "drizzle-orm";
import { authenticationInfo } from "../tables/schema.ts";
import type { InsertAuthenticationInfo } from "../tables/schema.ts";
import type { SQL } from "drizzle-orm";

// Select One Authentication Info with Keycloak ID
export const selectOneAuthenticationInfo = (keycloakId: string) =>
  database.query.authenticationInfo.findFirst({
    where: eq(authenticationInfo.keycloakId, keycloakId),
    with: {
      userInfo: true,
    },
  });

// Select Many Authentication Info based on a custom condition
export const selectManyAuthenticationInfo = (condition: SQL | void) =>
  condition != null
    ? database.query.authenticationInfo.findMany({
      where: condition,
      with: {
        userInfo: true,
      },
    })
    : database.query.authenticationInfo.findMany({
      with: {
        userInfo: true,
      },
    });

// Insert Authentication Info based on a custom data
export const insertAuthenticationInfo = (
  authenticationInfoData: InsertAuthenticationInfo,
) => database.insert(authenticationInfo).values(authenticationInfoData);
