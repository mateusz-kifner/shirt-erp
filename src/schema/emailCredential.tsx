import { z } from "zod";

export const emailCredentialSchema = z.object({
  id: z.number(),
  host: z.string().max(255).nullable().optional(),
  port: z.number().nullable().optional(),
  user: z.string().max(255).nullable().optional(),
  password: z.string().max(255).nullable().optional(),
  secure: z.boolean().nullable().optional(),
});

export type EmailCredentialType = z.infer<typeof emailCredentialSchema>;
