import { z } from "zod";

import { db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import { clients } from "@/db/schema/clients";
import {
  insertClientWithRelationZodSchema,
  updateClientZodSchema,
} from "@/schema/clientZodSchema";
import {
  createProcedureDeleteById,
  createProcedureGetById,
  createProcedureSearch,
} from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

export const clientRouter = createTRPCRouter({
  getById: createProcedureGetById(clients),
  create: employeeProcedure
    .input(insertClientWithRelationZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { address, ...simpleClientData } = clientData;
      const currentUserId = ctx.session!.user!.id;
      console.log(clientData);

      const newAddress = await db
        .insert(addresses)
        .values(address ?? {})
        .returning();
      if (newAddress[0] === undefined)
        throw new Error("Could not create address in client");
      const newClient = await db
        .insert(clients)
        .values({
          ...simpleClientData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      if (newClient[0] === undefined)
        throw new Error("Could not create client");
      return newClient[0];
    }),
  deleteById: createProcedureDeleteById(clients),
  update: employeeProcedure
    .input(updateClientZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const currentUserId = ctx.session!.user!.id;
      const updatedClient = await db
        .update(clients)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, id))
        .returning();
      return updatedClient[0];
    }),

  search: createProcedureSearch(clients),
});
