import { omit } from "lodash";

import { productSchema } from "@/schema/productSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureGetById,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

const productSchemaWithoutId = productSchema.omit({ id: true });

export const productRouter = createTRPCRouter({
  getAll: createProcedureGetAll("product"),
  getById: createProcedureGetById("product"),
  create: authenticatedProcedure
    .input(productSchemaWithoutId)
    .mutation(async ({ input: productData }) => {
      const newProduct = await prisma.product.create({
        data: { ...productData },
      });
      return newProduct;
    }),
  deleteById: createProcedureDeleteById("product"),
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
