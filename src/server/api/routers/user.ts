import { users } from "@/db/schema/users";
import { updateUserZodSchema } from "@/schema/userZodSchema";
import { createTRPCRouter, managerProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createProcedureGetById, createProcedureSearch } from "../procedures";
import { TRPCError } from "@trpc/server";
import { authDBAdapter } from "@/server/auth";

export const userRouter = createTRPCRouter({
  getById: createProcedureGetById(users),
  create: managerProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email() }))
    .mutation(async ({ input: userData, ctx }) => {
      const data = await authDBAdapter.createUser?.({
        ...userData,
        emailVerified: new Date(),
      });

      return data;
    }),
  deleteById: managerProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      const user = await ctx.db.select().from(users).where(eq(users.id, id));
      const currentUser = ctx.session!.user;
      if (user[0] === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User cannot be found",
        });
      if (currentUser.role === "manager" && user[0].role === "admin")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot delete user with higher role",
        });
      const data = await authDBAdapter.deleteUser?.(id);
      return data;
    }),
  update: managerProcedure
    .input(updateUserZodSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const { id, ...dataToUpdate } = userData;
      const currentUser = ctx.session!.user;
      const currentUserId = currentUser.id;
      const user = await ctx.db.select().from(users).where(eq(users.id, id));
      if (user[0] === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User cannot be found",
        });
      if (currentUser.role === "manager" && user[0].role === "admin")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot update data of user with higher role",
        });
      if (currentUser.role === "manager" && dataToUpdate.role === "admin")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot set role higher than your own!!!",
        });
      const updatedUser = await ctx.db
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
