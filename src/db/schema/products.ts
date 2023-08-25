import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  doublePrecision,
  date,
  makePgArray,
  PgArray,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { relations } from "drizzle-orm";
import { orders_to_products } from "./orders_to_products";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique(),
  category: varchar("category", { length: 255 }),
  description: text("description"),
  colors: varchar("colors", { length: 64 }).array(),
  sizes: varchar("sizes", { length: 255 }).array(),
  ...metadata,
});

export const products_relations = relations(products, ({ one, many }) => ({
  orders: many(orders_to_products),
}));
