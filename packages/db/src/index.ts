import { drizzle } from "drizzle-orm/postgres-js";

import { connectionStr } from "./config";
import * as schemaInternal from "./schemas";
import postgres from "postgres";

export { pgTable as tableCreator } from "./pgTable";

export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";
const schema = { ...schemaInternal };
const pgClient = postgres(connectionStr);
export const db = drizzle(pgClient, { schema });

export type DBType = typeof db;
