import { type Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/server/db";
import { authenticatedProcedure } from "./trpc";

type PrismaModelName = keyof typeof prisma;

export function createProcedureGetById(modelName: PrismaModelName) {
  return authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await (
      prisma[modelName] as Prisma.ClientDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >
    ).findUnique({
      where: { id: input },
    });
    return data;
  });
}

export function createProcedureGetAll(modelName: PrismaModelName) {
  return authenticatedProcedure
    .input(
      z.object({
        sortColumn: z.string().default("id"),
        sort: z.enum(["desc", "asc"]).default("desc"),
      })
    )
    .query(async ({ input }) => {
      const sortParam = { orderBy: { [input.sortColumn]: input.sort } };
      const data = await (
        prisma[modelName] as Prisma.ClientDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      ).findMany({
        ...sortParam,
      });
      return data;
    });
}

export function createProcedureDeleteById(modelName: PrismaModelName) {
  return authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const data = await (
        prisma[modelName] as Prisma.ClientDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      ).delete({
        where: { id: id },
      });
      return data;
    });
}

export function createProcedureSearch(modelName: PrismaModelName) {
  return authenticatedProcedure
    .input(
      z.object({
        keys: z.array(z.string()),
        query: z.string().default(""),
        sort: z.enum(["desc", "asc"]).default("desc"),
        sortColumn: z.string().default("id"),
        excludeKey: z.string().optional(),
        excludeValue: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const results = await (
        prisma[modelName] as Prisma.ClientDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      ).findMany({
        orderBy: {
          [input.sortColumn]: input.sort,
        },
        where: {
          OR: input.keys.map((key) => ({ [key]: { contains: input.query } })),
          NOT:
            input.excludeKey && input.excludeValue
              ? { [input.excludeKey]: input.excludeValue }
              : {},
        },
      });
      return results;
    });
}

export function createProcedureSearchWithPagination(
  modelName: PrismaModelName
) {
  return authenticatedProcedure
    .input(
      z.object({
        keys: z.array(z.string()),
        query: z.string().optional(),
        sort: z.enum(["desc", "asc"]).default("desc"),
        sortColumn: z.string().default("name"),
        excludeKey: z.string().optional(),
        excludeValue: z.string().optional(),
        currentPage: z.number(),
        itemsPerPage: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      console.log(input);
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

      const results = await (
        prisma[modelName] as Prisma.ClientDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      ).findMany({
        ...query,
        take: input.itemsPerPage,
        skip: (input.currentPage - 1) * input.itemsPerPage,
      });
      const totalItems = await (
        prisma[modelName] as Prisma.ClientDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      ).count(query);
      return {
        results,
        totalItems: totalItems,
      };
    });
}
