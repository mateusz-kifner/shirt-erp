import { omit } from "lodash";
import { z } from "zod";

import { userSchema } from "@/schema/userSchema";
import {
  authenticatedProcedure,
  createTRPCRouter,
  privilegedProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";

const userSchemaWithoutId = userSchema.omit({ id: true });

export const userRouter = createTRPCRouter({
  // getAll: createProcedureGetAll("user"),
  getById: privilegedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await prisma.user.findUnique({
      where: { id: input },
    });
    return omit(data, ["password"]);
  }),
  create: privilegedProcedure
    .input(userSchemaWithoutId)
    .mutation(async ({ input: userData }) => {
      const newUser = await prisma.user.create({
        data: { ...userData },
      });
      return omit(newUser, ["password"]);
    }),
  // deleteById: createProcedureDeleteById("user"),
  update: privilegedProcedure
    .input(userSchema)
    .mutation(async ({ input: userData }) => {
      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: {
          ...omit({ ...userData }, ["id"]),
        },
      });
      return omit(updatedUser, ["password"]);
    }),
  // search: createProcedureSearch("user"),
  searchWithPagination: authenticatedProcedure
    .input(
      z.object({
        keys: z.array(z.string()),
        query: z.string().optional(),
        sort: z.enum(["desc", "asc"]).default("desc"),
        sortColumn: z.string().default("username"),
        excludeKey: z.string().optional(),
        excludeValue: z.string().optional(),
        currentPage: z.number(),
        itemsPerPage: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const search = [];
      if (input.query && input.query.length > 0) {
        const splitQuery = input.query.split(" ");
        for (const queryPart of splitQuery) {
          if (queryPart.length > 0) {
            for (const key of input.keys) {
              search.push({
                [key]: { contains: queryPart, mode: "insensitive" },
              });
            }
          }
        }
      }
      const query = {
        orderBy: {
          [input.sortColumn]: input.sort,
        },
        where:
          search.length > 0
            ? {
                OR: search,
                NOT:
                  input.excludeKey && input.excludeValue
                    ? {
                        [input.excludeKey]: {
                          contains: input.excludeValue,
                        },
                      }
                    : undefined,
              }
            : {
                NOT:
                  input.excludeKey && input.excludeValue
                    ? {
                        [input.excludeKey]: {
                          contains: input.excludeValue,
                        },
                      }
                    : undefined,
              },
      };

      const results = await prisma.user.findMany({
        ...query,
        take: input.itemsPerPage,
        skip: (input.currentPage - 1) * input.itemsPerPage,
      });
      const totalItems = await prisma.user.count(query);
      return {
        results: results.map((val) => omit(val, ["password"])),
        totalItems: totalItems,
      };
    }),
});
