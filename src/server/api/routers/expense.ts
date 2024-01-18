import { z } from "zod";
import { expenses } from "@/db/schema/expenses";
import {
  insertExpenseZodSchema,
  updateExpenseZodSchema,
} from "@/schema/expenseZodSchema";
import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import expenseService from "@/server/services/expense";

export const expenseRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => await expenseService.deleteById(id)),

  create: employeeProcedure
    .input(insertExpenseZodSchema)
    .mutation(async ({ input: expenseData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await expenseService.create({
        ...expenseData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),

  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => expenseService.deleteById(id)),

  update: employeeProcedure
    .input(updateExpenseZodSchema)
    .mutation(async ({ input: expenseData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await expenseService.update({
        ...expenseData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(expenses),
});
