import { env } from "@/env";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

export type DBType = PostgresJsDatabase<typeof schema>;

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
export const db: DBType = drizzle(queryClient, {
  schema,
  // logger: env.NODE_ENV !== "production",
});

export type ExtractStringLiterals<T> = T extends `${string}` ? T : never;

export type schemaNames = ExtractStringLiterals<keyof typeof db.query>;
export type schemaType = (typeof schema)[schemaNames];

// export type InferSQLSelectModel<T extends PgTable> = {
//   [K in keyof T as T[K] extends PgColumn
//     ? T[K]["_"]["name"]
//     : never]: T[K] extends PgColumn
//     ? T[K]["_"]["data"] | (T[K]["_"]["notNull"] extends true ? never : null)
//     : never;
// };
