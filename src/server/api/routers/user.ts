import { db } from "@/db";
import { users } from "@/db/schema/users";
import {
  insertUserZodSchema,
  updateUserZodSchema,
} from "@/schema/userZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createProcedureGetById, createProcedureSearch } from "../procedures";

const privilegedProcedure = employeeProcedure;

export const userRouter = createTRPCRouter({
  getById: createProcedureGetById(users),
  create: privilegedProcedure
    .input(insertUserZodSchema)
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
      if (newUser[0] === undefined) throw new Error("Could not create User");
      return newUser[0];
    }),
  deleteById: privilegedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedProduct = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      return deletedProduct[0];
    }),
  update: privilegedProcedure
    .input(updateUserZodSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const { id, ...dataToUpdate } = userData;
      const currentUserId = ctx.session!.user!.id;
      const updatedUser = await db
        .update(users)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      return updatedUser[0];
    }),
  search: createProcedureSearch(users),
});
