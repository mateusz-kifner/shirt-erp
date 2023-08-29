import { files } from "@/db/schema/files";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectFileZodSchema = createSelectSchema(files).merge(
  z.object({ url: z.string() }),
);
export const insertFileZodSchema = createInsertSchema(files).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

export const updateFileZodSchema =
  insertFileZodSchema.merge(idRequiredZodSchema);

export type File = Merge<typeof files.$inferSelect, { url: string }>;
export type NewFile = Merge<
  z.infer<typeof insertFileZodSchema>,
  { url: string }
>;
