import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string().max(255).nullable().optional(),
  username: z.string().max(255),
  email: z.string().includes("@").max(255).nullable().optional(),
  emailVerified: z.date(),
  password: z.string().max(60),
  image: z.string().max(4096).nullable().optional(),
});

export type UserType = z.infer<typeof userSchema>;
