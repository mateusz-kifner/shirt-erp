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
import { prisma } from "@/server/db";

const designSchemaWithoutId = designSchema.omit({ id: true });

export const designRouter = createTRPCRouter({
  getAll: createProcedureGetAll("design"),
  getById: createProcedureGetById("design"),
  create: authenticatedProcedure
    .input(designSchemaWithoutId)
    .mutation(async ({ input: designData }) => {
      const newDesign = await prisma.design.create({
        data: { ...designData },
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
