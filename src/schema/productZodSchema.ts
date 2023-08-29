import { products } from "@/db/schema/products";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectProductZodSchema = createSelectSchema(products, {
  colors: z.string().array(),
  sizes: z.string().array(),
});

export const insertProductZodSchema = createInsertSchema(products, {
  colors: z.string().array(),
  sizes: z.string().array(),
});

export const updateProductZodSchema =
  insertProductZodSchema.merge(idRequiredZodSchema);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
