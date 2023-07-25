import { z } from "zod";

export const designSchema = z.object({
  id: z.number(),
  name: z.string().max(1024).nullable().optional(),
  data: z.record(z.string(), z.any()).array().array(),
});

export type DesignType = z.infer<typeof designSchema>;
