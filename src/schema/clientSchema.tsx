import { z } from "zod";
import { addressSchema } from "./addressSchema";

export const clientSchema = z.object({
  id: z.number(),
  username: z.string().max(255).nullable().optional(),
  firstname: z.string().max(255).nullable().optional(),
  lastname: z.string().max(255).nullable().optional(),
  email: z.string().includes("@").max(255).nullable().optional(),
  phoneNumber: z.string().max(255).nullable().optional(),
  companyName: z.string().max(255).nullable().optional(),
  notes: z.string().max(16384).nullable().optional(),
  address: addressSchema,
});

export type ClientType = z.infer<typeof clientSchema>;
