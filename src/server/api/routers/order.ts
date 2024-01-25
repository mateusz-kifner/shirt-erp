import { z } from "zod";

import { orders } from "@/db/schema/orders";

import {
  insertOrderByValueZodSchema,
  insertOrderZodSchema,
  updateOrderZodSchema,
} from "@/schema/orderZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { and, asc, desc, eq, ilike, sql, or, not, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import orderService from "@/server/services/order";

export const orderRouter = createTRPCRouter({
  getFullById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await orderService.getFullById(id)),

  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await orderService.getById(id)),

  create: employeeProcedure
    .input(insertOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.createFull({
        ...orderData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),
  createFull: employeeProcedure
    .input(insertOrderByValueZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.createFullByValue({
        ...orderData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),
  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => orderService.deleteById(id)),

  update: employeeProcedure
    .input(updateOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.update({
        ...orderData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  getByCompletionDateRange: employeeProcedure
    .input(
      z.object({
        rangeStart: z.string(),
        rangeEnd: z.string(),
        isArchived: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { rangeStart, rangeEnd, isArchived } = input;
      const results = await db
        .select()
        .from(orders)
        .where(
          and(
            gte(orders.dateOfCompletion, rangeStart),
            lte(orders.dateOfCompletion, rangeEnd),
            eq(orders.isArchived, isArchived),
          ),
        );
      return results;
    }),

  search: employeeProcedure
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
        isArchived: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        keys,
        query,
        sort,
        sortColumn,
        excludeKey,
        excludeValue,
        currentPage,
        itemsPerPage,
        isArchived,
      } = input;

      const queryParam = query && query.length > 0 ? `%${query}%` : undefined;

      const search = queryParam
        ? keys.map((key) =>
            ilike(orders[key as keyof typeof orders.$inferSelect], queryParam),
          )
        : [];
      const results = await db
        .select()
        .from(orders)
        .where(
          and(
            queryParam
              ? or(...search)
              : excludeKey && excludeValue
                ? not(
                    ilike(
                      orders[excludeKey as keyof typeof orders.$inferSelect],
                      `${excludeValue}%`,
                    ),
                  )
                : undefined,
            eq(orders.isArchived, isArchived),
          ),
        )
        .limit(itemsPerPage)
        .offset((currentPage - 1) * itemsPerPage)
        .orderBy(
          (sort === "asc" ? asc : desc)(
            orders[sortColumn as keyof typeof orders.$inferSelect],
          ),
        );
      // console.log(results);
      const totalItems = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders);

      return {
        results,
        totalItems: totalItems?.[0]?.count ?? 0,
      };
    }),
});
