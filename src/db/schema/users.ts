import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { email_credentials_to_users } from "./email_credentials_to_users";
import { orders_to_users } from "./orders_to_users";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  username: varchar("username", { length: 255 }),
  email: text("email"),
  emailVerified: timestamp("email_verified"),
  password: text("password"),
  image: text("image"),
  ...metadata,
});

export const users_relations = relations(users, ({ many }) => ({
  orders: many(orders_to_users),
  emailCredentials: many(email_credentials_to_users),
}));
