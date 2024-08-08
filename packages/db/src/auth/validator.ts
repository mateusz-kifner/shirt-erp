import type { authTokens, users } from "./schema";

export type UserType = typeof users.$inferInsert;

export type NewAuthToken = typeof authTokens.$inferInsert;
export type AuthToken = typeof authTokens.$inferSelect;
