import { omit } from "lodash";

import { db } from "@/db/db";
import { insertProductSchema, products } from "@/db/schema/products";
import { productSchema } from "@/schema/productSchema";
import {
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

const productSchemaWithoutId = productSchema.omit({ id: true });

export const productRouter = createTRPCRouter({
  getAll: authenticatedProcedure
    .input(z.number())
    .query(async ({ input: productId }) => {
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
      const newProduct = await db.insert(products).values(productData);
      return newProduct;
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: productId }) => {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, productId));
      return deletedProduct;
    }),
  update: authenticatedProcedure
    .input(productSchema)
    .mutation(async ({ input: productData }) => {
      const updatedProduct = await prisma.product.update({
        where: { id: productData.id },
        data: omit({ ...productData }, ["id"]),
      });
      return updatedProduct;
    }),
  search: createProcedureSearch("product"),
  searchWithPagination: createProcedureSearchWithPagination("product"),
});
