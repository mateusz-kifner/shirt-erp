import { z } from "zod";

import { db, type schemaType } from "@/db";
import { asc, ilike, not, or, sql, desc, eq } from "drizzle-orm";
import { employeeProcedure } from "./trpc";

export function createProcedureGetById<T extends schemaType>(schema: T) {
  return employeeProcedure
    .input(z.number().or(z.string()))
    .query(async ({ input: id }) => {
      if (!(schema && "id" in schema)) {
        throw new Error(
          `GetById: Schema ${schema._.name} does not have property id`,
        );
      }
      const data = await db.select().from<T>(schema).where(eq(schema.id, id));
      return data[0];
    });
}

export function createProcedureSearch<TSchema extends schemaType>(
  schema: TSchema,
) {
  return employeeProcedure
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
            ilike(schema[key as keyof typeof schema.$inferSelect], queryParam),
          )
        : [];
      const results = await db
        .select()
        .from<TSchema>(schema)
        .where(
          queryParam
            ? or(...search)
            : excludeKey && excludeValue
            ? not(
                ilike(
                  schema[excludeKey as keyof typeof schema.$inferSelect],
                  `${excludeValue}%`,
                ),
              )
            : undefined,
        )
        .limit(itemsPerPage)
        .offset((currentPage - 1) * itemsPerPage)
        .orderBy(
          (sort === "asc" ? asc : desc)(
            schema[sortColumn as keyof typeof schema.$inferSelect],
          ),
        );
      console.log(results);
      const totalItems = await db
        .select({ count: sql<number>`count(*)` })
        .from<TSchema>(schema);

      return {
        results,
        totalItems: totalItems?.[0]?.count ?? 0,
      };
    });
}
