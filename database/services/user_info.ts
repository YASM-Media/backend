import { database } from "../database.ts";
import { userInfo } from "../tables/schema.ts";
import type { InsertUserInfo } from "../tables/schema.ts";

// Insert User Info data based on custom data
export const insertUserInfo = (userInfoData: InsertUserInfo) =>
  database.insert(userInfo).values(userInfoData);
