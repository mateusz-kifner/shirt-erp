import { spreadsheets } from "@/db/schema/spreadsheets";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectSpreadsheetZodSchema = createSelectSchema(spreadsheets);

export const insertSpreadsheetZodSchema = createInsertSchema(spreadsheets);

export const updateSpreadsheetZodSchema =
  insertSpreadsheetZodSchema.merge(idRequiredZodSchema);

export type Spreadsheet = typeof spreadsheets.$inferSelect;
export type NewSpreadsheet = typeof spreadsheets.$inferInsert;
