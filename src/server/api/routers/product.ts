import { db } from "@/db/db";
import { Product, insertProductSchema, products } from "@/db/schema/products";
import { productSchema } from "@/schema/productSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq, ilike, not, or, sql } from "drizzle-orm";
import { z } from "zod";

const productSchemaWithoutId = productSchema.omit({ id: true });
const preparedTotalProducts = db
  .select({ count: sql<number>`count(*)` })
  .from(products)
  .prepare("total_products");

async function getTotalProducts() {
  const total = await preparedTotalProducts.execute();
  return total?.[0]?.count;
}

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
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const newProduct = await db
        .insert(products)
        .values({
          ...productData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      return newProduct[0];
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: productId }) => {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, productId))
        .returning();
      return deletedProduct[0];
    }),
  update: authenticatedProcedure
    .input(insertProductSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: productData, ctx }) => {
      const { id: productId, ...dataToUpdate } = productData;
      const updatedProduct = await db
        .update(products)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(products.id, productId))
        .returning();
      return updatedProduct[0];
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

      const queryParam = query && query.length > 0 ? `%${query}%` : undefined;

      const search = queryParam
        ? keys.map((key) => ilike(products[key as keyof Product], queryParam))
        : [];

      const results = await db.query.products.findMany({
        where: queryParam
          ? or(...search)
          : not(
              ilike(products[excludeKey as keyof Product], `${excludeValue}%`),
            ),
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        orderBy: (products, handlers) => [
          handlers[sort](products[sortColumn as keyof Product]),
        ],
      });

      const totalItems = await getTotalProducts();

      return {
        results,
        totalItems: totalItems ?? 0,
      };
    }),
});
