import { spreadsheets } from "@/db/schema/spreadsheets";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectSpreadsheetZodSchema = createSelectSchema(spreadsheets, {
  data: z.any().array().array(),
});

export const insertSpreadsheetZodSchema = createInsertSchema(spreadsheets, {
  data: z.any().array().array(),
}).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

export const updateSpreadsheetZodSchema =
  insertSpreadsheetZodSchema.merge(idRequiredZodSchema);

export type Spreadsheet = z.infer<typeof selectSpreadsheetZodSchema>;
export type NewSpreadsheet = z.infer<typeof insertSpreadsheetZodSchema>;
