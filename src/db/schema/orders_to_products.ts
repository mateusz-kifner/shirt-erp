import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./products";
import { archive_orders, orders } from "./orders";

export const orders_to_products = pgTable(
  "orders_to_products",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.productId),
  }),
);

export const orders_to_products_relations = relations(
  orders_to_products,
  ({ one }) => ({
    orders: one(orders, {
      fields: [orders_to_products.orderId],
      references: [orders.id],
    }),
    products: one(products, {
      fields: [orders_to_products.productId],
      references: [products.id],
    }),
  }),
);

export const archive_orders_to_products = pgTable(
  "archive_orders_to_products",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => archive_orders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.productId),
  }),
);

export const archive_orders_to_products_relations = relations(
  archive_orders_to_products,
  ({ one }) => ({
    orders: one(archive_orders, {
      fields: [archive_orders_to_products.orderId],
      references: [archive_orders.id],
    }),
    products: one(products, {
      fields: [archive_orders_to_products.productId],
      references: [products.id],
    }),
  }),
);
