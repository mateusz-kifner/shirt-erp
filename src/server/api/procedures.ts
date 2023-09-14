import { z } from "zod";

import {
  db,
  type schemaType,
  type inferSchemaKeys,
  type schemaNames,
} from "@/db/db";
import { asc, ilike, not, or, sql, desc, eq } from "drizzle-orm";
import { type PgTable } from "drizzle-orm/pg-core";
import { authenticatedProcedure } from "./trpc";

async function queryById<T extends schemaType>(schema: T, id: number) {
  if (!(schema && "id" in schema)) {
    throw new Error(
      `ProcedureGetById: Schema ${schema._.name} does not have property id`,
    );
  }
  const data = await db.select().from<T>(schema).where(eq(schema.id, id));
  if (data.length === 0) throw new Error("NotFound");
  return data[0];
}

export function createProcedureGetById<T extends schemaType>(schema: T) {
  return authenticatedProcedure
    .input(z.number())
    .query(async ({ input: id }) => {
      return await queryById(schema, id);
    });
}

export function createProcedureSearch(
  pgTable: PgTable,
  tableName: schemaNames,
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
            ilike(pgTable[key as inferSchemaKeys<typeof pgTable>], queryParam),
          )
        : [];

      // @ts-ignore
      const results = await db.query[tableName].findMany({
        where: queryParam
          ? or(...search)
          : excludeKey && excludeValue
          ? not(
              ilike(
                pgTable[excludeKey as inferSchemaKeys<typeof pgTable>],
                `${excludeValue}%`,
              ),
            )
          : undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        orderBy: (sort === "asc" ? asc : desc)(
          pgTable[sortColumn as inferSchemaKeys<typeof pgTable>],
        ),
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
