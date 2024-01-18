import { products } from "@/db/schema/products";
import {
  insertProductZodSchema,
  updateProductZodSchema,
} from "@/schema/productZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { createProcedureSearch } from "../procedures";
import productService from "@/server/services/product";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await productService.getById(id)),

  create: employeeProcedure
    .input(insertProductZodSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await productService.create({
        ...productData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),

  deleteById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await productService.deleteById(id)),

  update: employeeProcedure
    .input(updateProductZodSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await productService.update({
        ...productData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(products),
});
