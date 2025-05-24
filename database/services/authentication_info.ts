import { database } from "../database.ts";
import { eq } from "drizzle-orm";
import { authenticationInfo } from "../tables/schema.ts";
// Select One Authentication Info with Keycloak ID
export const selectOneAuthenticationInfo = (keycloakId: string) =>
  database.query.authenticationInfo.findFirst({
    where: eq(authenticationInfo.keycloakId, keycloakId),
    with: {
      userInfo: true,
    },
  });
