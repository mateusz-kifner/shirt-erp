import { createTRPCRouter, privilegedProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  getAll: privilegedProcedure.query(({ ctx }) => {
    return { message: "privilegedProcedure" };
  }),
});
