import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { email_messages } from "./email_messages";
import { archive_orders, orders } from "./orders";

export const orders_to_email_messages = pgTable(
  "orders_to_email_messages",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    emailMessagesId: integer("email_messages_id")
      .notNull()
      .references(() => email_messages.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.emailMessagesId),
  }),
);

export const orders_to_email_messages_relations = relations(
  orders_to_email_messages,
  ({ one }) => ({
    orders: one(orders, {
      fields: [orders_to_email_messages.orderId],
      references: [orders.id],
    }),
    emailMessages: one(email_messages, {
      fields: [orders_to_email_messages.emailMessagesId],
      references: [email_messages.id],
    }),
  }),
);

export const archive_orders_to_email_messages = pgTable(
  "archive_orders_to_email_messages",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => archive_orders.id),
    emailMessagesId: integer("email_messages_id")
      .notNull()
      .references(() => email_messages.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.emailMessagesId),
  }),
);

export const archive_orders_to_email_messages_relations = relations(
  archive_orders_to_email_messages,
  ({ one }) => ({
    orders: one(archive_orders, {
      fields: [archive_orders_to_email_messages.orderId],
      references: [archive_orders.id],
    }),
    emailMessages: one(email_messages, {
      fields: [archive_orders_to_email_messages.emailMessagesId],
      references: [email_messages.id],
    }),
  }),
);
