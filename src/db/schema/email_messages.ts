import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { email_messages_to_files } from "./email_messages_to_files";
import { files } from "./files";
import { orders_to_email_messages } from "./orders_to_email_messages";

export const email_messages = pgTable("email_messages", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 255 }),
  from: varchar("from", { length: 255 }),
  to: varchar("to", { length: 255 }),
  date: timestamp("date", { precision: 6 }),
  html: text("html"),
  text: text("text"),
  messageId: varchar("message_id", { length: 255 }),
  messageUid: integer("message_uid"),
  mailbox: varchar("mailbox"),
  clientUser: varchar("client_user"),
  headerLines: varchar("header_lines").array().default([]),
  textAsHtml: text("text_as_html"),
  messageFileId: integer("message_file_id").references(() => files.id),
  ...metadata,
});

export const email_messages_relations = relations(
  email_messages,
  ({ one, many }) => ({
    messageFile: one(files, {
      fields: [email_messages.messageFileId],
      references: [files.id],
    }),
    attachments: many(email_messages_to_files),
    orders: many(orders_to_email_messages),
  }),
);
