import { omit } from "lodash";
import { z } from "zod";

import { clientSchema } from "@/schema/clientSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureGetById,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

const clientSchemaWithoutId = clientSchema
  .omit({ id: true, address: true })
  .merge(
    z.object({
      address: z
        .object({
          streetName: z.string().max(255).nullable().optional(),
          streetNumber: z.string().max(255).nullable().optional(),
          apartmentNumber: z.string().max(255).nullable().optional(),
          secondLine: z.string().max(255).nullable().optional(),
          postCode: z.string().max(255).nullable().optional(),
          city: z.string().max(255).nullable().optional(),
          province: z.string().max(255).nullable().optional(),
        })
        .optional()
        .nullable(),
    })
  );

export const clientRouter = createTRPCRouter({
  getAll: createProcedureGetAll("client"),
  getById: createProcedureGetById("client"),
  create: authenticatedProcedure
    .input(clientSchemaWithoutId)
    .mutation(async ({ input: clientData }) => {
      const newClient = await prisma.client.create({
        data: { ...clientData, address: { create: { ...clientData.address } } },
      });
      return newClient;
    }),
  deleteById: createProcedureDeleteById("client"),
  update: authenticatedProcedure
    .input(clientSchema)
    .mutation(async ({ input: clientData }) => {
      const updatedClient = await prisma.client.update({
        where: { id: clientData.id },
        data: {
          ...omit({ ...clientData }, ["id", "address"]),
          address: { update: { ...clientData.address } },
        },
      });
      return updatedClient;
    }),
  search: createProcedureSearch("client"),
  searchWithPagination: createProcedureSearchWithPagination("client"),
});
