import { customers } from "@/server/api/customer/schema";
import {
  insertCustomerWithRelationZodSchema,
  updateCustomerZodSchema,
} from "@/server/api/customer/validator";
import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import customerService from "@/server/api/customer/service";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
  getFullById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await customerService.getFullById(id)),

  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await customerService.getById(id)),

  create: employeeProcedure
    .input(insertCustomerWithRelationZodSchema)
    .mutation(async ({ input: customerData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await customerService.create({
        ...customerData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),

  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => await customerService.deleteById(id)),

  update: employeeProcedure
    .input(updateCustomerZodSchema)
    .mutation(async ({ input: customerData, ctx }) => {
      const currentUserId = ctx.session.user.id;

      return await customerService.update({
        ...customerData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(customers),
});
