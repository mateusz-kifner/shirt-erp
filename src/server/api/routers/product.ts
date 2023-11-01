import { db } from "@/db";
import { products } from "@/db/schema/products";
import {
  insertProductZodSchema,
  updateProductZodSchema,
} from "@/schema/productZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createProcedureGetById, createProcedureSearch,createProcedureDeleteById } from "../procedures";

export const productRouter = createTRPCRouter({
  getById: createProcedureGetById(products),
  create: employeeProcedure
    .input(insertProductZodSchema)
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
      if (newProduct[0] === undefined)
        throw new Error("Could not create Product");
      return newProduct[0];
    }),
  deleteById: createProcedureDeleteById(products),
  update: employeeProcedure
    .input(updateProductZodSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const { id, ...dataToUpdate } = productData;
      const currentUserId = ctx.session!.user!.id;
      const updatedProduct = await db
        .update(products)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();
      return updatedProduct[0];
    }),
  search: createProcedureSearch(products),
});
