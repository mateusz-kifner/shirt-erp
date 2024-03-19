import { db } from "@/server/db";
import { verificationTokens } from "@/server/api/user/schema";
import { env } from "@/env";
import {
  publicProcedure,
  adminProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  purgeAuthTokens: (env.NEXT_PUBLIC_DEMO
    ? publicProcedure
    : adminProcedure
  ).mutation(async ({}) => {
    await db.delete(verificationTokens);
    return { ok: true };
  }),
});
