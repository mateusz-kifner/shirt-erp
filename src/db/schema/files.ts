import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { email_messages } from "./email_messages";
import { email_messages_to_files } from "./email_messages_to_files";
import { orders_to_files } from "./orders_to_files";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  size: integer("size").notNull(),
  filepath: varchar("filepath", { length: 2048 }).notNull(),
  originalFilename: varchar("original_filename", { length: 1024 }),
  newFilename: varchar("new_filename", { length: 1024 }),
  filename: varchar("filename", { length: 1024 }),
  mimetype: varchar("mimetype", { length: 255 }),
  hash: varchar("hash", { length: 10 }),
  token: varchar("token", { length: 32 }),
  width: integer("width"),
  height: integer("height"),
  ...metadata,
});

export const files_relations = relations(files, ({ many }) => ({
  messages: many(email_messages),
  emailMessages: many(email_messages_to_files),
  orders: many(orders_to_files),
}));
