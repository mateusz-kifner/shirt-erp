import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { addresses } from "./addresses";
import { clients } from "./clients";
import {
  archive_orders_to_email_messages,
  orders_to_email_messages,
} from "./orders_to_email_messages";
import { archive_orders_to_files, orders_to_files } from "./orders_to_files";
import {
  archive_orders_to_products,
  orders_to_products,
} from "./orders_to_products";
import { archive_orders_to_users, orders_to_users } from "./orders_to_users";
import { spreadsheets } from "./spreadsheets";

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
  addressId: integer("address_id").references(() => addresses.id, {
    onDelete: "cascade",
  }),
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
  spreadsheets: many(spreadsheets),
}));

export const archive_orders = pgTable("archive_orders", {
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

export const archive_orders_relations = relations(
  archive_orders,
  ({ one, many }) => ({
    address: one(addresses, {
      fields: [archive_orders.addressId],
      references: [addresses.id],
    }),
    client: one(clients, {
      fields: [archive_orders.clientId],
      references: [clients.id],
    }),
    files: many(archive_orders_to_files),
    products: many(archive_orders_to_products),
    employees: many(archive_orders_to_users),
    emails: many(archive_orders_to_email_messages),
    spreadsheets: many(spreadsheets),
  }),
);
