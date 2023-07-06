import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import _, { omit } from "lodash";
import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { userIncludeAll } from "./user";

export const sessionRouter = createTRPCRouter({
  status: publicProcedure.query(({ ctx }) => {
    if (ctx.session?.user && ctx.session.isLoggedIn) {
      return {
        user: ctx.session.user,
        isLoggedIn: true,
      };
    } else {
      return {
        user: null,
        isLoggedIn: false,
      };
    }
  }),
  me: authenticatedProcedure.query( async ({ ctx }) => {
    const data = await prisma.user.findUnique({where:{id:ctx.session?.user?.id},include:userIncludeAll})
    return omit(data,["password"])
  }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input;

      try {
        const user = await prisma.user.findFirst({
          where: { username: username },
        });
        if (!user || !user.password) {
          throw new Error("Username or password is incorrect");
          return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Username or password is incorrect");
          return;
        }
        const sanitized_user = _.omit(user, ["password"]);
        if (ctx.session) {
          ctx.session.user = sanitized_user;
          ctx.session.isLoggedIn = true;
          await ctx.session.save();
        }
        return {
          user: sanitized_user,
          isLoggedIn: true,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    if (ctx.session) ctx.session.destroy();
    return { isLoggedIn: false, user: null };
  }),
});
