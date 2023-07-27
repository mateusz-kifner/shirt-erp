import { productSchema } from "@/schema/productSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";

const productSchemaWithoutId = productSchema.omit({ id: true });

export const mailRouter = createTRPCRouter({
  getAll: authenticatedProcedure
    .input(
      z.object({
        sortColumn: z.string().default("id"),
        sort: z.enum(["desc", "asc"]).default("desc"),
      })
    )
    .query(async ({ input }) => {
      return {};
    }),
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    return {};
  }),
  create: authenticatedProcedure
    .input(productSchemaWithoutId)
    .mutation(async ({ input: productData }) => {
      return {};
    }),
  deleteById: authenticatedProcedure

    .input(z.number())
    .mutation(async ({ input: id }) => {
      return {};
    }),
  update: authenticatedProcedure
    .input(productSchema)
    .mutation(async ({ input: productData }) => {
      return {};
    }),
  search: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    return {};
  }),
});
