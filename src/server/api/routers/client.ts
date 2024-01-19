import { clients } from "@/db/schema/clients";
import {
  insertClientWithRelationZodSchema,
  updateClientZodSchema,
} from "@/schema/clientZodSchema";
import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import clientService from "@/server/services/client";
import { z } from "zod";

export const clientRouter = createTRPCRouter({
  getFullById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await clientService.getFullById(id)),

  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await clientService.getById(id)),

  create: employeeProcedure
    .input(insertClientWithRelationZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await clientService.create({
        ...clientData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),

  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => await clientService.deleteById(id)),

  update: employeeProcedure
    .input(updateClientZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const currentUserId = ctx.session.user.id;

      return await clientService.update({
        ...clientData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(clients),
});
