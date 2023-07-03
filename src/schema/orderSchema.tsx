import { z } from "zod";
import { addressSchema } from "./addressSchema";
import { clientSchema } from "./clientSchema";
import { designSchema } from "./designSchema";
import { fileSchema } from "./fileSchema";
import { spreadsheetSchema } from "./spreadsheetSchema";

export const orderSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable().optional(),
  status: z.string().max(255).nullable().optional(),
  notes: z.string().nullable().optional(),
  price: z.string().max(255).nullable().optional(),
  isPricePaid: z.boolean().default(false),
  dateOfCompletion: z.date().nullable().optional(),
  spreadsheets: z.array(spreadsheetSchema).nullable().optional(),
  designs: z.array(designSchema).nullable().optional(),
  files: z.array(fileSchema).nullable().optional(),
  workTime: z.number().nullable().optional(),
  client: clientSchema.nullable().optional(),
  address: addressSchema.nullable().optional(),
});

export type OrderType = z.infer<typeof orderSchema>;
