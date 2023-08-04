import { z } from "zod";

export const emailCredentialSchema = z.object({
  id: z.number(),
  host: z.string().max(255),
  port: z.number(),
  protocol: z.string().max(10),
  user: z.string().max(255),
  secure: z.boolean().nullable().optional(),
});

export type EmailCredentialType = z.infer<typeof emailCredentialSchema>;
