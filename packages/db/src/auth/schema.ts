import {
  timestamp,
  pgEnum,
  varchar,
  char,
  serial,
  integer,
  text,
} from "drizzle-orm/pg-core";

import { pgTable } from "../pgTable";
import { metadata } from "../_metadataSchema";
import crypto from "node:crypto";
import { relations, sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["normal", "student", "mod", "admin"]);

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  role: roleEnum("role").notNull().default("normal"),
  tokenId: text("tokenId").references(() => authTokens.id),
  wsTokenId: text("wsTokenId").references(() => authTokens.id),
  ...metadata,
});

export const userRelations = relations(users, ({ one }) => ({
  token: one(authTokens, {
    fields: [users.tokenId],
    references: [authTokens.id],
  }),
  wsToken: one(authTokens, {
    fields: [users.wsTokenId],
    references: [authTokens.id],
  }),
}));

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const authTokens = pgTable("access_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomBytes(20).toString("base64url")),
  userId: text("user_id").notNull(),
  token: varchar("token", { length: 30 })
    .notNull()
    .$defaultFn(() => crypto.randomBytes(20).toString("base64url")),
  expiration_date: timestamp("expiration_date", {
    withTimezone: true,
    mode: "date",
  }).default(sql<Date>`NOW() + INTERVAL '15 minutes'`),
});
