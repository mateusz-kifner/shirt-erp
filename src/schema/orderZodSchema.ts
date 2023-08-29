import { insertClientSchema } from "@/db/schema/clients";
import { insertEmailMessageSchema } from "@/db/schema/email_messages";
import { insertFileSchema } from "@/db/schema/files";
import { orders } from "@/db/schema/orders";
import { insertProductSchema } from "@/db/schema/products";
import { insertSpreadsheetSchema } from "@/db/schema/spreadsheets";
import { insertUserSchema } from "@/db/schema/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertAddressSchema } from "./addressZodSchema";


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