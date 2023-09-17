import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { archive_orders, orders } from "./orders";

export const orders_to_users = pgTable(
  "orders_to_users",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.userId),
  }),
);

export const orders_to_users_relations = relations(
  orders_to_users,
  ({ one }) => ({
    orders: one(orders, {
      fields: [orders_to_users.orderId],
      references: [orders.id],
    }),
    users: one(users, {
      fields: [orders_to_users.userId],
      references: [users.id],
    }),
  }),
);

export const archive_orders_to_users = pgTable(
  "archive_orders_to_users",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => archive_orders.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.userId),
  }),
);

export const archive_orders_to_users_relations = relations(
  archive_orders_to_users,
  ({ one }) => ({
    orders: one(archive_orders, {
      fields: [archive_orders_to_users.orderId],
      references: [archive_orders.id],
    }),
    users: one(users, {
      fields: [archive_orders_to_users.userId],
      references: [users.id],
    }),
  }),
);
