import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable().optional(),
  category: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  iconId: z.number().nullable().optional(),
  colors: z.string().array().optional().default([]),
  sizes: z.string().array().optional().default([]),
});

export type ProductType = z.infer<typeof productSchema>;
