import { users } from "@/db/schema/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectUserZodSchema = createSelectSchema(users);
export const insertUserZodSchema = createInsertSchema(users);

export const updateUserZodSchema =
  insertUserZodSchema.merge(idRequiredZodSchema);

export type User = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserZodSchema>;
