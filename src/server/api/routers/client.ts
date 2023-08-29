import { z } from "zod";

import { db } from "@/db/db";
import { addresses } from "@/db/schema/addresses";
import { clients } from "@/db/schema/clients";
import {
  insertClientWithRelationZodSchema,
  updateClientZodSchema,
} from "@/schema/clientZodSchema";
import {
  createProcedureGetById,
  createProcedureSearch,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

db;

export const clientRouter = createTRPCRouter({
  getById: createProcedureGetById("clients"),
  create: authenticatedProcedure
    .input(insertClientWithRelationZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const { address, ...simpleClientData } = clientData;
      console.log(clientData);

      const newAddress = await db
        .insert(addresses)
        .values(address ?? {})
        .returning();
      if (newAddress[0] === undefined)
        throw new Error("Could not create address in client");
      const newProduct = await db
        .insert(clients)
        .values({
          ...clientData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      return newProduct[0];
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedClient = await db
        .delete(clients)
        .where(eq(clients.id, id))
        .returning();
      return deletedClient[0];
    }),
  update: authenticatedProcedure
    .input(updateClientZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const updatedClient = await db
        .update(clients)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(clients.id, id))
        .returning();
      return updatedClient[0];
    }),

  search: createProcedureSearch(clients, "clients"),
});
