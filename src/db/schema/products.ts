import { relations, sql } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { orders_to_products } from "./orders_to_products";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique(),
  category: varchar("category", { length: 255 }),
  description: text("description"),
  colors: varchar("colors", { length: 64 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  sizes: varchar("sizes", { length: 255 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  ...metadata,
});

export const products_relations = relations(products, ({ one, many }) => ({
  orders: many(orders_to_products),
}));
