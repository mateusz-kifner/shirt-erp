import { z } from "zod";

import { clients } from "@/db/schema/clients";
import { orders } from "@/db/schema/orders";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { ilike, or } from "drizzle-orm";
import { db } from "@/db";

export const searchRouter = createTRPCRouter({
  all: employeeProcedure
    .input(
      z.object({
        query: z.string().optional(),
        sort: z.enum(["desc", "asc"]).default("desc"),
        itemsPerPage: z.number().default(5),
      }),
    )
    .query(async ({ input, ctx }) => {
      const searchClients = [];
      const searchOrders = [];

      if (input.query && input.query.length > 0) {
        const splitQuery = input.query.split(" ");
        for (const queryPart of splitQuery) {
          if (queryPart.length > 0) {
            for (const key of [
              "username",
              "firstname",
              "lastname",
              "companyName",
              "email",
            ]) {
              searchClients.push(
                ilike(
                  clients[key as keyof typeof clients.$inferSelect],
                  `%${queryPart}%`,
                ),
              );
            }
          }
        }

        for (const queryPart of splitQuery) {
          if (queryPart.length > 0) {
            searchOrders.push(ilike(orders.name, `%${queryPart}%`));
          }
        }
      }

      const resultsClient = db.query.clients.findMany({
        where: or(...searchClients),
        limit: input.itemsPerPage,
      });

      const resultsOrder = db.query.orders.findMany({
        where: or(...searchOrders),
        limit: input.itemsPerPage,
      });

      const results = await Promise.all([resultsClient, resultsOrder]);

      return results;
    }),
});
