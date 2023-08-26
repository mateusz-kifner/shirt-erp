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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

export const insertSpreadsheetSchema = createInsertSchema(spreadsheets);

export const selectSpreadsheetSchema = createSelectSchema(spreadsheets);

export type Spreadsheet = typeof spreadsheets.$inferSelect;
export type NewSpreadsheet = typeof spreadsheets.$inferInsert;
