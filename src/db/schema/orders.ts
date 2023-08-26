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
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { addresses, insertAddressSchema } from "./addresses";
import { relations } from "drizzle-orm";
import { orders_to_files } from "./orders_to_files";
import { clients, insertClientSchema } from "./clients";
import { orders_to_products } from "./orders_to_products";
import { orders_to_users } from "./orders_to_users";
import { orders_to_email_messages } from "./orders_to_email_messages";
import { orders_to_spreadsheets } from "./orders_to_spreadsheets";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertFileSchema } from "./files";
import { insertProductSchema } from "./products";
import { insertUserSchema } from "./users";
import { insertEmailMessageSchema } from "./email_messages";
import { insertSpreadsheetSchema } from "./spreadsheets";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  status: varchar("status", { length: 255 }).default("planned"),
  notes: varchar("notes", { length: 255 }),
  price: varchar("price", { length: 255 }),
  isPricePaid: boolean("is_price_paid").default(false),
  dateOfCompletion: date("date_of_completion"),
  workTime: doublePrecision("work_time"),
  clientId: integer("client_id").references(() => clients.id),
  addressId: integer("address_id").references(() => addresses.id),
  ...metadata,
});

export const orders_relations = relations(orders, ({ one, many }) => ({
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  client: one(clients, {
    fields: [orders.clientId],
    references: [clients.id],
  }),
  files: many(orders_to_files),
  products: many(orders_to_products),
  employees: many(orders_to_users),
  emails: many(orders_to_email_messages),
  spreadsheets: many(orders_to_spreadsheets),
}));

export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderSchemaRelations = z.object({
  files: insertFileSchema.array().optional(),
  products: insertProductSchema.array().optional(),
  employees: insertUserSchema.array().optional(),
  emails: insertEmailMessageSchema.array().optional(),
  spreadsheets: insertSpreadsheetSchema.array().optional(),
  client: insertClientSchema.optional(),
  address: insertAddressSchema.optional(),
});
export const insertOrderSchemaWithRelations = insertOrderSchema.merge(
  insertOrderSchemaRelations,
);

export const selectOrderSchema = createSelectSchema(orders);

export type Order = typeof orders.$inferSelect;
export type OrderWithRelations = z.infer<typeof insertOrderSchemaWithRelations>;
export type OrderRelations = z.infer<typeof insertOrderSchemaRelations>;
export type NewOrder = typeof orders.$inferInsert;
