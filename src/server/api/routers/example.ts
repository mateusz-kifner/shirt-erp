import { z } from "zod";

import {
  employeeProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.text}`,
      };
    }),
  authenticated: employeeProcedure.query(() => {
    return {
      message: "authenticated",
    };
  }),
  // privileged: privilegedProcedure.query(() => {
  //   return {
  //     message: "privileged",
  //   };
  // }),
});
