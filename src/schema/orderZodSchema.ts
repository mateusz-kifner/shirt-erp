import { insertClientSchema } from "@/db/schema/clients";
import { insertEmailMessageSchema } from "@/db/schema/email_messages";
import { insertFileSchema } from "@/db/schema/files";
import { orders } from "@/db/schema/orders";
import { insertProductSchema } from "@/db/schema/products";
import { insertSpreadsheetSchema } from "@/db/schema/spreadsheets";
import { insertUserSchema } from "@/db/schema/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertAddressZodSchema } from "./addressZodSchema";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectOrderZodSchemaWithoutRelations = createSelectSchema(orders);
export const insertOrderZodSchemaWithoutRelations = createInsertSchema(orders);
const insertOrderSchemaRelations = z.object({
  files: insertFileSchema.array().optional(),
  products: insertProductSchema.array().optional(),
  employees: insertUserSchema.array().optional(),
  emails: insertEmailMessageSchema.array().optional(),
  spreadsheets: insertSpreadsheetSchema.array().optional(),
  client: insertClientSchema.optional(),
  address: insertAddressZodSchema.optional(),
});




export const insertOrderZodSchema = insertOrderZodSchemaWithoutRelations.merge(
  insertOrderSchemaRelations,
);
export const updateOrderZodSchema = insertOrderZodSchemaWithoutRelations.merge(idRequiredZodSchema)



export type OrderWithoutRelations = typeof orders.$inferSelect;
export type NewOrder = z.infer<typeof insertOrderZodSchema>;
// type OrderRelations = z.infer<typeof insertOrderSchemaRelations>;
// export type NewOrder = typeof orders.$inferInsert;