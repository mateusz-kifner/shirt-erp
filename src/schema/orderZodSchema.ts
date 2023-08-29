import { orders } from "@/db/schema/orders";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertAddressZodSchema } from "./addressZodSchema";
import { insertClientZodSchema } from "./clientZodSchema";
import { insertEmailMessageZodSchema } from "./emailMessageZodSchema";
import { insertFileZodSchema } from "./fileZodSchema";
import idRequiredZodSchema from "./idRequiredZodSchema";
import { insertProductZodSchema } from "./productZodSchema";
import { insertSpreadsheetZodSchema } from "./spreadsheetZodSchema";
import { insertUserZodSchema } from "./userZodSchema";

export const selectOrderWithoutRelationsZodSchema = createSelectSchema(orders);
export const insertOrderWithoutRelationsZodSchema = createInsertSchema(
  orders,
).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

const insertOrderRelationsZodSchema = z.object({
  files: insertFileZodSchema.array().optional(),
  products: insertProductZodSchema.array().optional(),
  employees: insertUserZodSchema.array().optional(),
  emails: insertEmailMessageZodSchema.array().optional(),
  spreadsheets: insertSpreadsheetZodSchema.array().optional(),
  client: insertClientZodSchema.optional(),
  address: insertAddressZodSchema.optional(),
});

export const insertOrderZodSchema = insertOrderWithoutRelationsZodSchema.merge(
  insertOrderRelationsZodSchema,
);
export const updateOrderZodSchema =
  insertOrderZodSchema.merge(idRequiredZodSchema);

export type OrderWithoutRelations = typeof orders.$inferSelect;
export type NewOrder = z.infer<typeof insertOrderZodSchema>;
// type OrderRelations = z.infer<typeof insertOrderSchemaRelations>;
// export type NewOrder = typeof orders.$inferInsert;
