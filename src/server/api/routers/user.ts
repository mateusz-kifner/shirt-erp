import { users } from "@/db/schema/users";
import { updateUserZodSchema } from "@/schema/userZodSchema";
import {
  createTRPCRouter,
  employeeProcedure,
  managerProcedure,
} from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createProcedureSearch } from "../procedures";
import { TRPCError } from "@trpc/server";
import userServices from "@/server/services/user";

export const userRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.string())
    .query(async ({ input: id }) => userServices.getById(id)),
  create: managerProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email() }))
    .mutation(async ({ input: userData }) => userServices.create(userData)),
  deleteById: managerProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      const user = await db.select().from(users).where(eq(users.id, id));
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
      return await userServices.deleteById(id);
    }),
  update: managerProcedure
    .input(updateUserZodSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const currentUser = ctx.session!.user;
      const currentUserId = currentUser.id;
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id));
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
      if (currentUser.role === "manager" && userData.role === "admin")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot set role higher than your own!!!",
        });

      return await userServices.update({
        ...userData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),
  search: createProcedureSearch(users),
});
