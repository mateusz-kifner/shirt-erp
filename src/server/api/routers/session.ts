import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import _ from "lodash";
import { z } from "zod";

import {
  employeeProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export const sessionRouter = createTRPCRouter({
  status: publicProcedure.query(({ ctx }) => {
    if (!!ctx.session?.user) {
      return {
        user: ctx.session.user,
      };
    } else {
      return {
        user: null,
      };
    }
  }),
  me: employeeProcedure.query(async ({ ctx }) => {
    const result = await db.query.users.findFirst({
      where: eq(users.id, ctx.session!.user!.id),
      with: {
        emailCredentials: { with: { emailCredentials: true } },
        orders: { with: { orders: true } },
      },
    });
    if (!result)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "FORBIDDEN: user not found",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { emailCredentials, orders, password, ...simpleUser } = result;

    return {
      ...simpleUser,
      emailCredentials: emailCredentials.map((v) => v.emailCredentials),
      orders: orders.map((v) => v.orders),
    };
  }),
});
