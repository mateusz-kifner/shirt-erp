import { users } from "./schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserZodSchema = createSelectSchema(users);
export const insertUserZodSchema = createInsertSchema(users).omit({
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
});

export const updateUserZodSchema = insertUserZodSchema.merge(
  z.object({ id: z.string(), email: z.string().email().optional() }),
);

export type User = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserZodSchema>;
export type UpdatedUser = z.infer<typeof updateUserZodSchema>;
