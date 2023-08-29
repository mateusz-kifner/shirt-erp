import { relations } from "drizzle-orm";
import { integer, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { orders } from "./orders";

export const spreadsheets = pgTable("spreadsheets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  data: json("data").$type<any[][]>().default([]),
  orderId: integer("order_id").references(() => orders.id),
  ...metadata,
});

export const spreadsheets_relations = relations(spreadsheets, ({ one }) => ({
  order: one(orders, {
    fields: [spreadsheets.orderId],
    references: [orders.id],
  }),
}));
