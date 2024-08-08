import { env } from "@/env";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { verificationTokens } from "@/server/api/user/schema";
import { db } from "@/server/db";

export const adminRouter = createTRPCRouter({
  purgeAuthTokens: (env.NEXT_PUBLIC_DEMO
    ? publicProcedure
    : adminProcedure
  ).mutation(async () => {
    await db.delete(verificationTokens);
    return { ok: true };
  }),
});
