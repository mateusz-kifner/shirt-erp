import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const exampleRouter = createTRPCRouter({
  search: authenticatedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        sort: z.enum(["desc", "asc"]).default("desc"),
        itemsPerPage: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      const searchClient = [];
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
              searchClient.push({
                [key]: { contains: queryPart, mode: "insensitive" },
              });
            }
          }
        }

        for (const queryPart of splitQuery) {
          if (queryPart.length > 0) {
            for (const key of ["name"]) {
              searchOrders.push({
                [key]: { contains: queryPart, mode: "insensitive" },
              });
            }
          }
        }
      }
      const queryClient = {
        orderBy: {
          updatedAt: input.sort,
        },
        where:
          searchClient.length > 0
            ? {
                OR: searchClient,
                NOT: {
                  username: {
                    contains: "Szablon",
                  },
                },
              }
            : {
                NOT: {
                  username: {
                    contains: "Szablon",
                  },
                },
              },
      };

      const queryOrder = {
        orderBy: {
          updatedAt: input.sort,
        },
        where:
          searchOrders.length > 0
            ? {
                OR: searchOrders,
                NOT: {
                  name: {
                    contains: "Szablon",
                  },
                },
              }
            : {
                NOT: {
                  name: {
                    contains: "Szablon",
                  },
                },
              },
      };

      const resultsClient = prisma.client.findMany({
        ...queryClient,
        take: input.itemsPerPage,
      });

      const resultsOrder = prisma.order.findMany({
        ...queryOrder,
        take: input.itemsPerPage,
      });

      const results = await Promise.all([resultsClient, resultsOrder]);

      return results;
    }),
});
