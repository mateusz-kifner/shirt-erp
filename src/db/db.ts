import { env } from "@/env.mjs";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as addresses from "./schema/addresses";
import * as clients from "./schema/clients";
import * as spreadsheets from "./schema/spreadsheets";
import * as files from "./schema/files";
import * as orders from "./schema/orders";
import * as products from "./schema/products";
import * as users from "./schema/users";
import * as email_messages from "./schema/email_messages";
import * as expenses from "./schema/expenses";
import * as email_credentials from "./schema/email_credentials";
import * as orders_to_files from "./schema/orders_to_files";
import * as email_credentials_to_users from "./schema/email_credentials_to_users";
import * as email_messages_to_files from "./schema/email_messages_to_files";
import * as orders_to_email_messages from "./schema/orders_to_email_messages";
import * as orders_to_products from "./schema/orders_to_products";
import * as orders_to_users from "./schema/orders_to_users";
// import Logger from "js-logger";

const schema = {
  ...addresses,
  ...clients,

  ...email_credentials_to_users,
  ...email_credentials,

  ...email_messages_to_files,
  ...email_messages,

  ...expenses,
  ...files,

  ...orders_to_email_messages,
  ...orders_to_files,
  ...orders_to_products,
  ...orders_to_users,
  ...orders,

  ...products,
  ...spreadsheets,
  ...users,
};

// for migrations
const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
export const migrationDb = drizzle(migrationClient);

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema,
  // logger: env.NODE_ENV !== "production",
});

type ExtractStringLiterals<T> = T extends `${string}` ? T : never;

export type inferSchemaKeys<T> = Exclude<
  ExtractStringLiterals<keyof T>,
  "_" | "getSQL" | "$inferSelect" | "$inferInsert"
>;

// ExtractStringLiterals<keyof typeof db.query>
export type schemaNames =
  | "addresses"
  | "clients"
  | "email_credentials_to_users"
  | "email_credentials"
  | "email_messages_to_files"
  | "email_messages"
  | "expenses"
  | "files"
  | "orders_to_email_messages"
  | "orders_to_files"
  | "orders_to_products"
  | "orders_to_users"
  | "orders"
  | "products"
  | "spreadsheets"
  | "users";
