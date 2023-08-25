import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  notes: text("notes"),
  addressId: integer("addressId"),
  ...metadata,
});

export const clients_relations = relations(clients, ({ one }) => ({
  address: one(addresses, {
    fields: [clients.addressId],
    references: [addresses.id],
  }),
}));
