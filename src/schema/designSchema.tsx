import { z } from "zod";

export const designSchema = z.object({
  id: z.number(),
  name: z.string().max(1024).nullable().optional(),
  data: z.string(),
});

export type DesignType = z.infer<typeof designSchema>;
