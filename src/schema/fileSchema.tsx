import { z } from "zod";

export const fileSchema = z.object({
  id: z.number(),
  size: z.number(),
  originalFilename: z.string().max(1024).nullable().optional(),
  filename: z.string().max(1024).nullable().optional(),
  newFilename: z.string().max(1024).nullable().optional(),
  mimetype: z.string().max(255).nullable().optional(),
  hash: z.string().max(10).nullable().optional(),
  token: z.string().max(32).nullable().optional(),
  width: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  createdById: z.number().nullable().optional(),
  updatedById: z.number().nullable().optional(),
});

export type FileType = z.infer<typeof fileSchema> & { url: string };
