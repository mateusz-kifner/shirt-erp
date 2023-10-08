import { decimal, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { metadata } from "./_metadata";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  expenseData: json("expense_data")
    .$type<{ name?: string; cost?: number }[]>()
    .default([]),
  ...metadata,
});
