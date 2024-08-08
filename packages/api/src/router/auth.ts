import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";
import { magicLink, signOut } from "@shirterp/api/auth";
import { z } from "zod";

export const authRouter = {
  authWithMagicLink: publicProcedure
    .input(z.string().email().min(5).max(32))
    .mutation(async ({ input }) => {
      await magicLink.initiateSignIn(input);
    }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  signOut: publicProcedure.mutation(async () => {
    return await signOut();
  }),
} satisfies TRPCRouterRecord;
