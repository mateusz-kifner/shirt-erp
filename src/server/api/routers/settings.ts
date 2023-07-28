import { createTRPCRouter, privilegedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const settingsRouter = createTRPCRouter({
  getAll: privilegedProcedure.query(({ ctx }) => {
    return { message: "privilegedProcedure" };
  }),

  getAllMailCredentials: privilegedProcedure.query(async ({ ctx }) => {
    const data = await prisma.user.findUnique({
      where: { id: ctx.session!.user!.id },
      include: { emailCredentials: true },
    });
    return data;
  }),
});
