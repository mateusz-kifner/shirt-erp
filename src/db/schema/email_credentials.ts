import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { email_credentials_to_users } from "./email_credentials_to_users";

export const email_credentials = pgTable("email_credentials", {
  id: serial("id").primaryKey(),
  host: varchar("host", { length: 255 }),
  port: integer("port").notNull(),
  user: varchar("user", { length: 255 }),
  protocol: varchar("protocol", { length: 255 }).default("imap"),
  password: varchar("password", { length: 255 }),
  secure: boolean("boolean").default(true),
  ...metadata,
});

export const email_credentials_relations = relations(
  email_credentials,
  ({ one, many }) => ({
    users: many(email_credentials_to_users),
  }),
);
