import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { files } from "./files";
import { email_messages } from "./email_messages";

export const email_messages_to_files = pgTable(
  "email_messages_to_files",
  {
    emailMessageId: integer("order_id")
      .notNull()
      .references(() => email_messages.id),
    fileId: integer("file_id")
      .notNull()
      .references(() => files.id),
  },
  (t) => ({
    pk: primaryKey(t.emailMessageId, t.fileId),
  }),
);

export const email_messages_to_files_relations = relations(
  email_messages_to_files,
  ({ one }) => ({
    emailMessages: one(email_messages, {
      fields: [email_messages_to_files.emailMessageId],
      references: [email_messages.id],
    }),
    files: one(files, {
      fields: [email_messages_to_files.fileId],
      references: [files.id],
    }),
  }),
);
