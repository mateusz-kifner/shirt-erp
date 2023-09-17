import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { files } from "./files";
import { archive_orders, orders } from "./orders";

export const orders_to_files = pgTable(
  "orders_to_files",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    fileId: integer("file_id")
      .notNull()
      .references(() => files.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.fileId),
  }),
);

export const orders_to_files_relations = relations(
  orders_to_files,
  ({ one }) => ({
    orders: one(orders, {
      fields: [orders_to_files.orderId],
      references: [orders.id],
    }),
    files: one(files, {
      fields: [orders_to_files.fileId],
      references: [files.id],
    }),
  }),
);

export const archive_orders_to_files = pgTable(
  "archive_orders_to_files",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => archive_orders.id),
    fileId: integer("file_id")
      .notNull()
      .references(() => files.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.fileId),
  }),
);

export const archive_orders_to_files_relations = relations(
  archive_orders_to_files,
  ({ one }) => ({
    orders: one(archive_orders, {
      fields: [archive_orders_to_files.orderId],
      references: [archive_orders.id],
    }),
    files: one(files, {
      fields: [archive_orders_to_files.fileId],
      references: [files.id],
    }),
  }),
);
