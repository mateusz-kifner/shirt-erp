import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { addresses } from "./addresses";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).default(""),
  firstname: varchar("firstname", { length: 255 }).default(""),
  lastname: varchar("lastname", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).default(""),
  phoneNumber: varchar("phone_number", { length: 255 }).default(""),
  companyName: varchar("company_name", { length: 255 }).default(""),
  notes: text("notes").default(""),
  addressId: integer("address_id").references(() => addresses.id, {
    onDelete: "cascade",
  }),
  isTemplate: boolean("is_template").default(false),
  ...metadata,
});

export const clients_relations = relations(clients, ({ one }) => ({
  address: one(addresses, {
    fields: [clients.addressId],
    references: [addresses.id],
  }),
}));
