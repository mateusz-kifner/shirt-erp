import { email_messages } from "@/db/schema/email_messages";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectEmailMessageZodSchema = createSelectSchema(email_messages, {
  headerLines: z.string().array(),
});
export const insertEmailMessageZodSchema = createInsertSchema(email_messages, {
  headerLines: z.string().array(),
}).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

export const updateEmailMessageZodSchema =
  insertEmailMessageZodSchema.merge(idRequiredZodSchema);

export type EmailMessage = typeof email_messages.$inferSelect;
export type NewEmailMessage = z.infer<typeof insertEmailMessageZodSchema>;
export type UpdatedEmailMessage = z.infer<typeof updateEmailMessageZodSchema>;
