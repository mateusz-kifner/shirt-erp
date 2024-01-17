import { db } from "@/db";
import { verificationTokens } from "@/db/schema/users";
import { env } from "@/env.mjs";
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
