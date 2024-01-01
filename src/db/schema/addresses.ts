import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { clients } from "./clients";
import { orders } from "./orders";

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  streetName: varchar("street_name", { length: 255 }).default(""),
  streetNumber: varchar("street_number", { length: 255 }).default(""),
  apartmentNumber: varchar("apartment_number", { length: 255 }).default(""),
  secondLine: varchar("second_line", { length: 255 }).default(""),
  postCode: varchar("post_code", { length: 255 }).default(""),
  city: varchar("city", { length: 255 }).default(""),
  province: varchar("province", { length: 255 }).default("pomorskie"),
});

export const addresses_relations = relations(addresses, ({ many }) => ({
  clients: many(clients),
  order: many(orders),
}));
