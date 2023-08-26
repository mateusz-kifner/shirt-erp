import { relations } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { metadata } from "./_metadata";
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

export const insertProductSchema = createInsertSchema(products, {
  colors: z.string().array(),
  sizes: z.string().array(),
});

export const selectProductSchema = createSelectSchema(products, {
  colors: z.string().array(),
  sizes: z.string().array(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
