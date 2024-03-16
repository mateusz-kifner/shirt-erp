import { customers } from "@/server/db/schema/customers";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertAddressZodSchema } from "./addressZodSchema";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectCustomerZodSchema = createSelectSchema(customers);
export const insertCustomerZodSchema = createInsertSchema(customers).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

export const updateCustomerZodSchema =
  insertCustomerZodSchema.merge(idRequiredZodSchema);

const insertCustomerRelationsZodSchema = z.object({
  address: insertAddressZodSchema.optional(),
});

export const insertCustomerWithRelationZodSchema =
  insertCustomerZodSchema.merge(insertCustomerRelationsZodSchema);
export const updateCustomerWithRelationZodSchema =
  insertCustomerWithRelationZodSchema.merge(idRequiredZodSchema);

export type Customer = typeof customers.$inferSelect;
export type CustomerWithRelations = z.infer<
  typeof insertCustomerWithRelationZodSchema
>;
export type NewCustomer = z.infer<typeof insertCustomerZodSchema>;
export type UpdatedCustomer = z.infer<typeof updateCustomerZodSchema>;
