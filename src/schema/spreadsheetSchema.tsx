import { z } from "zod";

export const spreadsheetSchema = z.object({
  id: z.number().optional(),
  name: z.string().max(255).optional().nullable(),
  data: z.record(z.string(), z.any()).optional().array().array(),
  // orders: z.array(z.any()).optional(),
});

export type SpreadsheetType = z.infer<typeof spreadsheetSchema>;
