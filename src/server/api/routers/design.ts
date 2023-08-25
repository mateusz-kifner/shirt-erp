import { omit } from "lodash";

import { designSchema } from "@/schema/designSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureGetById,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

import { z } from "zod";

const designSchemaWithoutId = designSchema.omit({ id: true });

export const designRouter = createTRPCRouter({
  getAll: createProcedureGetAll("design"),
  getById: createProcedureGetById("design"),
  create: authenticatedProcedure
    .input(
      designSchemaWithoutId.merge(z.object({ orderId: z.number().optional() })),
    )
    .mutation(async ({ input }) => {
      const { orderId, ...designData } = input;
      const newDesign = await prisma.design.create({
        data: {
          ...designData,
          orders: { connect: { id: orderId } },
        },
      });
      return newDesign;
    }),
  deleteById: createProcedureDeleteById("design"),
  update: authenticatedProcedure
    .input(designSchema)
    .mutation(async ({ input: designData }) => {
      const updatedDesign = await prisma.design.update({
        where: { id: designData.id },
        data: omit({ ...designData }, ["id"]),
      });
      return updatedDesign;
    }),
  search: createProcedureSearch("design"),
  searchWithPagination: createProcedureSearchWithPagination("design"),
});
