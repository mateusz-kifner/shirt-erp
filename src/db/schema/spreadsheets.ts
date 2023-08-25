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
  json,
} from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";
import { relations } from "drizzle-orm";
import { orders_to_spreadsheets } from "./orders_to_spreadsheets";

export const spreadsheets = pgTable("spreadsheets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  data: json("data").default([]),
  ...metadata,
});

export const spreadsheets_relations = relations(
  spreadsheets,
  ({ one, many }) => ({
    orders: many(orders_to_spreadsheets),
  }),
);
