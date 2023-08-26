import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  createProcedureGetById,
  createProcedureSearchWithPagination,
} from "../procedures";
import { db } from "@/db/db";
import { insertUserSchema, users } from "@/db/schema/users";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { insertProductSchema } from "@/db/schema/products";

const privilegedProcedure = authenticatedProcedure;

export const userRouter = createTRPCRouter({
  getById: createProcedureGetById("users"),
  create: privilegedProcedure
    .input(insertUserSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const newUser = await db
        .insert(users)
        .values({
          ...userData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      return newUser[0];
    }),
  deleteById: privilegedProcedure
    .input(z.number())
    .mutation(async ({ input: userId }) => {
      const deletedProduct = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();
      return deletedProduct[0];
    }),
  update: privilegedProcedure
    .input(insertProductSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: userData, ctx }) => {
      const { id: userId, ...dataToUpdate } = userData;
      const updatedUser = await db
        .update(users)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(users.id, userId))
        .returning();
      return updatedUser[0];
    }),
  search: createProcedureSearchWithPagination(users),
});
