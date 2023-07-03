import { z } from "zod";

export const spreadsheetSchema = z.object({
  id: z.number(),
  name: z.string().max(255),
  data: z.record(z.string(), z.any()).array().array(),
});

export type SpreadsheetType = z.infer<typeof spreadsheetSchema>;
