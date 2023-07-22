import { z } from "zod";

export const spreadsheetSchema = z.object({
  id: z.number(),
  name: z.string().max(255),
  data: z.record(z.string(), z.any()).array().array(),
  // orders: z.array(z.any()).optional(),
});

export type SpreadsheetType = z.infer<typeof spreadsheetSchema>;
