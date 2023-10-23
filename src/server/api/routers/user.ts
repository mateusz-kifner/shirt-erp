import { db } from "@/db";
import { users } from "@/db/schema/users";
import { updateUserZodSchema } from "@/schema/userZodSchema";
import { createTRPCRouter, managerProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createProcedureGetById, createProcedureSearch } from "../procedures";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getById: createProcedureGetById(users),
  // create: managerProcedure
  //   .input(insertUserZodSchema)
  //   .mutation(async ({ input: userData, ctx }) => {
  //     const currentUserId = ctx.session!.user!.id;
  //     const newUser = await db
  //       .insert(users)
  //       .values({
  //         ...userData,
  //         createdById: currentUserId,
  //         updatedById: currentUserId,
  //       })
  //       .returning();
  //     if (newUser[0] === undefined) throw new Error("Could not create User");
  //     return newUser[0];
  //   }),
  deleteById: managerProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      const deletedProduct = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      return deletedProduct[0];
    }),
  update: managerProcedure
    .input(updateUserZodSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const { id, ...dataToUpdate } = userData;
      const currentUser = ctx.session!.user;
      const currentUserId = currentUser.id;
      const user = await db.select().from(users).where(eq(users.id, id));
      if (user[0] === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User cannot be found",
        });
      if (
        currentUser.role === "manager" &&
        (dataToUpdate.role === "admin" || user[0].role === "admin")
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot set role higher than your own!!!",
        });
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
