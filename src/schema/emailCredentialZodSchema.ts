import { email_credentials } from "@/db/schema/email_credentials";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectEmailCredentialZodSchema =
  createSelectSchema(email_credentials);
export const insertEmailCredentialZodSchema =
  createInsertSchema(email_credentials);

export const updateEmailCredentialZodSchema =
  insertEmailCredentialZodSchema.merge(idRequiredZodSchema);

export type EmailCredential = typeof email_credentials.$inferSelect;
export type NewEmailCredential = z.infer<typeof insertEmailCredentialZodSchema>;
