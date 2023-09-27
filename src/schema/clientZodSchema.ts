import { clients } from "@/db/schema/clients";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { insertAddressZodSchema } from "./addressZodSchema";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectClientZodSchema = createSelectSchema(clients);
export const insertClientZodSchema = createInsertSchema(clients).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});
export const updateClientZodSchema =
  insertClientZodSchema.merge(idRequiredZodSchema);

const insertClientRelationsZodSchema = z.object({
  address: insertAddressZodSchema.optional(),
});

export const insertClientWithRelationZodSchema = insertClientZodSchema.merge(
  insertClientRelationsZodSchema,
);
export const updateClientWithRelationZodSchema =
  insertClientWithRelationZodSchema.merge(idRequiredZodSchema);

export type Client = typeof clients.$inferSelect;
export type ClientWithRelations = z.infer<
  typeof insertClientWithRelationZodSchema
>;
export type NewClient = z.infer<typeof insertClientZodSchema>;
