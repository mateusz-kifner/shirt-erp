import { z } from "zod";
import { addressSchema } from "./addressSchema";
import { clientSchema } from "./clientSchema";
import { designSchema } from "./designSchema";
import { fileSchema } from "./fileSchema";
import { productSchema } from "./productSchema";
import { spreadsheetSchema } from "./spreadsheetSchema";
import { userSchema } from "./userSchema";

export const orderSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable().optional(),
  status: z.string().max(255).nullable().optional(),
  notes: z.string().nullable().optional(),
  price: z.string().max(255).nullable().optional(),
  isPricePaid: z.boolean().default(false).nullable().optional(),
  dateOfCompletion: z.date().nullable().optional(),
  spreadsheets: z.array(spreadsheetSchema).optional(),
  designs: z.array(designSchema).optional(),
  files: z.array(fileSchema).optional(),
  products: z.array(productSchema).optional(),
  employees: z.array(userSchema.omit({ password: true })).optional(),
  workTime: z.number().nullable().optional(),
  client: clientSchema.nullable().optional(),
  address: addressSchema.nullable().optional(),
});

export type OrderType = z.infer<typeof orderSchema>;
