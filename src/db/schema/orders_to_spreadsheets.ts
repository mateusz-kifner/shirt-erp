import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { spreadsheets } from "./spreadsheets";
import { orders } from "./orders";

export const orders_to_spreadsheets = pgTable(
  "orders_to_spreadsheets",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    spreadsheetId: integer("spreadsheet_id")
      .notNull()
      .references(() => spreadsheets.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.spreadsheetId),
  }),
);

export const orders_to_spreadsheets_relations = relations(
  orders_to_spreadsheets,
  ({ one }) => ({
    orders: one(orders, {
      fields: [orders_to_spreadsheets.orderId],
      references: [orders.id],
    }),
    spreadsheets: one(spreadsheets, {
      fields: [orders_to_spreadsheets.spreadsheetId],
      references: [spreadsheets.id],
    }),
  }),
);
