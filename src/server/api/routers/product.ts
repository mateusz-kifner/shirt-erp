import { products } from "@/db/schema/products";
import {
  insertProductZodSchema,
  updateProductZodSchema,
} from "@/schema/productZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { createProcedureSearch } from "../procedures";
import productServices from "@/server/services/product";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await productServices.getById(id)),

  create: employeeProcedure
    .input(insertProductZodSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await productServices.create({
        ...productData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),

  deleteById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await productServices.deleteById(id)),

  update: employeeProcedure
    .input(updateProductZodSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await productServices.update({
        ...productData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(products),
});
