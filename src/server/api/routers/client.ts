import { z } from "zod";

import {
  createProcedureGetById,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/db";
import { clients, insertClientSchema } from "@/db/schema/clients";
import { eq } from "drizzle-orm";

export const clientRouter = createTRPCRouter({
  getById: createProcedureGetById("clients"),
  create: authenticatedProcedure
    .input(insertClientSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
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
    .input(insertClientSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const updatedClient = await db
        .update(clients)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(clients.id, id))
        .returning();
      return updatedClient[0];
    }),

  searchWithPagination: createProcedureSearchWithPagination(clients),
});
