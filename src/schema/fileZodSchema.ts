import { files } from "@/db/schema/files";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectFileZodSchema = createSelectSchema(files);
export const insertFileZodSchema = createInsertSchema(files);

export const updateFileZodSchema =
  insertFileZodSchema.merge(idRequiredZodSchema);

export type File = typeof files.$inferSelect;
export type NewFile = z.infer<typeof insertFileZodSchema>;
