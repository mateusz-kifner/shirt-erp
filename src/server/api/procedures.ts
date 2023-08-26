import { z } from "zod";

import { db } from "@/db/db";
import { authenticatedProcedure } from "./trpc";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { sql, or, not, ilike } from "drizzle-orm";

export function createProcedureGetById(schemaName: string) {
  return authenticatedProcedure
    .input(z.number())
    .query(async ({ input: id }) => {
      const data = await db.query[schemaName as "users"].findFirst({
        where: (schema, { eq }) => eq(schema.id, id),
      });
      return data;
    });
}

export function createProcedureSearchWithPagination(
  pgTable: PgTable<TableConfig>,
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
        currentPage: z.number().default(1),
        itemsPerPage: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      const {
        keys,
        query,
        sort,
        sortColumn,
        excludeKey,
        excludeValue,
        currentPage,
        itemsPerPage,
      } = input;

      const queryParam = query && query.length > 0 ? `%${query}%` : undefined;

      const search = queryParam
        ? keys.map((key) =>
            // @ts-ignore
            ilike(pgTable[key], queryParam),
          )
        : [];

      const results = await db.query.products.findMany({
        where: queryParam
          ? or(...search)
          : excludeKey && excludeValue
          ? not(
              ilike(
                // @ts-ignore
                pgTable[excludeKey],
                `${excludeValue}%`,
              ),
            )
          : undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        orderBy: (_, handlers) => [
          // @ts-ignore
          handlers[sort](pgTable[sortColumn]),
        ],
      });

      const totalItems = await db
        .select({ count: sql<number>`count(*)` })
        .from(pgTable);

      return {
        results,
        totalItems: totalItems?.[0]?.count ?? 0,
      };
    });
}
