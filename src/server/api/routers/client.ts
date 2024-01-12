import { addresses } from "@/db/schema/addresses";
import { clients } from "@/db/schema/clients";
import {
  insertClientWithRelationZodSchema,
  updateClientZodSchema,
} from "@/schema/clientZodSchema";
import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const clientRouter = createTRPCRouter({
  getByIdFull: employeeProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const data = await ctx.db.query.clients.findFirst({
        where: eq(clients.id, id),
        with: {
          address: true,
        },
      });
      return data;
    }),
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id, ctx }) => {
      const data = await ctx.db.query.clients.findFirst({
        where: eq(clients.id, id),
      });
      return data;
    }),
  create: employeeProcedure
    .input(insertClientWithRelationZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { address, ...simpleClientData } = clientData;
      const currentUserId = ctx.session.user.id;

      // All clients must have address
      const newAddress = await ctx.db
        .insert(addresses)
        .values(address ?? {})
        .returning();
      if (newAddress[0] === undefined)
        throw new Error("Could not create address in client");
      const newClient = await ctx.db
        .insert(clients)
        .values({
          ...simpleClientData,
          addressId: newAddress[0].id,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      if (newClient[0] === undefined)
        throw new Error("Could not create client");
      return { ...newClient[0], address: newAddress[0] };
    }),
  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const data = await ctx.db.query.clients.findFirst({
        where: eq(clients.id, id),
      });
      // Delete address to cascade delete related client, All clients must have address
      if (data?.addressId === undefined || data?.addressId === null)
        throw new Error("Client: Address not found");
      const deletedAddress = await ctx.db
        .delete(addresses)
        .where(eq(addresses.id, data.addressId))
        .returning();
      if (deletedAddress[0] === undefined)
        throw new Error(
          "Client: Address could not be deleted (or doesn't exist)",
        );
      return { ...data, address: deletedAddress[0] };
    }),
  update: employeeProcedure
    .input(updateClientZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const currentUserId = ctx.session.user.id;

      const updatedClient = await ctx.db
        .update(clients)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, id))
        .returning();
      if (updatedClient[0] === undefined) throw new Error("Could not update");
      return updatedClient[0];
    }),

  search: createProcedureSearch(clients),
});
