import { z } from "zod";

import { clientSchema } from "@/schema/clientSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

import { Prisma } from "@prisma/client";

const includeAll = {
  address: true,
  orders: true,
  ordersArchive: true,
};

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
    }),
  );

export const clientRouter = createTRPCRouter({
  getAll: createProcedureGetAll("client"),
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await prisma.client.findUnique({
      where: { id: input },
      include: includeAll,
    });
    return data;
  }),
  create: authenticatedProcedure
    .input(clientSchemaWithoutId)
    .mutation(async ({ input: clientData }) => {
      const { address, ...simpleClientData } = clientData;

      const createData: Prisma.ClientCreateInput = { ...simpleClientData };

      createData.address = { create: address ?? {} };

      const newClient = await prisma.client.create({
        data: createData,
        include: includeAll,
      });

      return newClient;
    }),
  deleteById: createProcedureDeleteById("client"),
  update: authenticatedProcedure
    .input(clientSchema)
    .mutation(async ({ input: clientData }) => {
      const { id: clientId, address, ...simpleClientData } = clientData;

      const updateData: Prisma.ClientUpdateInput = { ...simpleClientData };

      if (address) updateData.address = { update: address };

      console.log(updateData);
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: updateData,
        include: includeAll,
      });
      return updatedClient;
    }),
  search: createProcedureSearch("client"),
  searchWithPagination: createProcedureSearchWithPagination("client"),
});
