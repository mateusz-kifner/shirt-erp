import { db } from "@/db/db";
import { insertProductSchema, products } from "@/db/schema/products";
import { productSchema } from "@/schema/productSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq, sql } from "drizzle-orm";
import { omit } from "lodash";
import { z } from "zod";

const productSchemaWithoutId = productSchema.omit({ id: true });

export const productRouter = createTRPCRouter({
  getAll: authenticatedProcedure.query(async () => {
    const data = await db.query.products.findMany();
    return data;
  }),
  getById: authenticatedProcedure
    .input(z.number())
    .query(async ({ input: productId }) => {
      const data = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });
      return data;
    }),
  create: authenticatedProcedure
    .input(insertProductSchema)
    .mutation(async ({ input: productData }) => {
      const newProduct = await db
        .insert(products)
        .values(productData)
        .returning();
      return newProduct;
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: productId }) => {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, productId))
        .returning();
      return deletedProduct;
    }),
  update: authenticatedProcedure
    .input(insertProductSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: productData }) => {
      const updatedProduct = await db
        .update(products)
        .set(omit(productData, ["id"]))
        .where(eq(products.id, productData.id))
        .returning();
      return updatedProduct;
    }),
  searchWithPagination: authenticatedProcedure
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
      // console.log(input);
      // const search = [];
      // if (input.query && input.query.length > 0) {
      //   const splitQuery = input.query.split(" ");
      //   for (const queryPart of splitQuery) {
      //     if (queryPart.length > 0) {
      //       for (const key of input.keys) {
      //         search.push({
      //           [key]: { contains: queryPart, mode: "insensitive" },
      //         });
      //       }
      //     }
      //   }
      // }
      // const query = {
      //   orderBy: {
      //     [input.sortColumn]: input.sort,
      //   },
      //   where:
      //     search.length > 0
      //       ? {
      //           OR: search,
      //         }
      //       : {
      //           NOT:
      //             input.excludeKey && input.excludeValue
      //               ? {
      //                   [input.excludeKey]: {
      //                     contains: input.excludeValue,
      //                   },
      //                 }
      //               : undefined,
      //         },
      // };

      // const results = await (
      //   prisma[modelName] as Prisma.ClientDelegate
      // ).findMany({
      //   ...query,
      //   take: input.itemsPerPage,
      //   skip: (input.currentPage - 1) * input.itemsPerPage,
      // });
      // const totalItems = await (
      //   prisma[modelName] as Prisma.ClientDelegate
      // ).count(query);
      const results = await db.query.products.findMany({
        limit: itemsPerPage,
        offset: (input.currentPage - 1) * input.itemsPerPage,
      });
      const totalItems = await db
        .select({ count: sql<number>`count(*)` })
        .from(products);

      return {
        results,
        totalItems: totalItems?.[0]?.count ?? 0,
      };
    }),
});
