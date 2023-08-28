import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orders } from "../schema/orders";
import { insertFileSchema } from "../schema/files";
import { z } from "zod";
import { insertAddressSchema } from "./addresses";
import { insertClientSchema } from "../schema/clients";
import { insertSpreadsheetSchema } from "../schema/spreadsheets";
import { insertEmailMessageSchema } from "../schema/email_messages";
import { insertUserSchema } from "../schema/users";
import { insertProductSchema } from "../schema/products";


export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderSchemaRelations = z.object({
  files: insertFileSchema.array().optional(),
  products: insertProductSchema.array().optional(),
  employees: insertUserSchema.array().optional(),
  emails: insertEmailMessageSchema.array().optional(),
  spreadsheets: insertSpreadsheetSchema.array().optional(),
  client: insertClientSchema.optional(),
  address: insertAddressSchema.optional(),
});
export const insertOrderSchemaWithRelations = insertOrderSchema.merge(
  insertOrderSchemaRelations,
);

export const selectOrderSchema = createSelectSchema(orders);

export type Order = typeof orders.$inferSelect;
export type OrderWithRelations = z.infer<typeof insertOrderSchemaWithRelations>;
export type OrderRelations = z.infer<typeof insertOrderSchemaRelations>;
export type NewOrder = typeof orders.$inferInsert;