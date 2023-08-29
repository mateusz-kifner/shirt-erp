import { expenses } from "@/db/schema/expenses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectExpenseZodSchema = createSelectSchema(expenses);
export const insertExpenseZodSchema = createInsertSchema(expenses);

export const updateExpenseZodSchema =
  insertExpenseZodSchema.merge(idRequiredZodSchema);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = z.infer<typeof insertExpenseZodSchema>;
