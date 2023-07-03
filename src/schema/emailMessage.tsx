import { z } from "zod";

export const emailMessageSchema = z.object({
  id: z.number(),
  subject: z.string().max(255).nullable().optional(),
  from: z.string().max(255).nullable().optional(),
  to: z.string().max(255).nullable().optional(),
  date: z.date().nullable().optional(),
  html: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  messageId: z.string().max(255).nullable().optional(),
  headerLines: z.string().nullable().optional(),
  textAsHtml: z.string().nullable().optional(),
  nextMessageId: z.number().nullable().optional(),
});

export type EmailMessageType = z.infer<typeof emailMessageSchema>;
