import { z } from "zod";

import { db } from "@/db/db";
import { asc, ilike, not, or, sql, desc } from "drizzle-orm";
import { type PgTable, type TableConfig } from "drizzle-orm/pg-core";
import { authenticatedProcedure } from "./trpc";

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

export function createProcedureSearch(
  pgTable: PgTable<TableConfig>,
  tableName: string,
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
            ilike(pgTable[key as keyof typeof pgTable], queryParam),
          )
        : [];
      // @ts-ignore
      const results = await db.query[tableName].findMany({
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
        // @ts-ignore
        orderBy: (sort === "asc" ? asc : desc)(pgTable[sortColumn]),
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
