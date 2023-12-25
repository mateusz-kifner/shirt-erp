import { z } from "zod";

import { expenses } from "@/db/schema/expenses";
import {
  insertExpenseZodSchema,
  updateExpenseZodSchema,
} from "@/schema/expenseZodSchema";
import {
  createProcedureGetById,
  createProcedureSearch,
} from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

export const expenseRouter = createTRPCRouter({
  getById: createProcedureGetById(expenses),
  create: employeeProcedure
    .input(insertExpenseZodSchema)
    .mutation(async ({ input: expenseData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const newExpense = await ctx.db
        .insert(expenses)
        .values({
          ...expenseData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      if (newExpense[0] === undefined) {
        throw new Error("Could not create Expense");
      }
      return newExpense[0];
    }),
  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const deletedExpense = await ctx.db
        .delete(expenses)
        .where(eq(expenses.id, id))
        .returning();
      return deletedExpense[0];
    }),
  update: employeeProcedure
    .input(updateExpenseZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const currentUserId = ctx.session.user.id;
      const updatedExpense = await ctx.db
        .update(expenses)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(expenses.id, id))
        .returning();
      if (updatedExpense[0] === undefined)
        throw new Error("Expense: Expense could not be updated");
      return updatedExpense[0];
    }),
  search: createProcedureSearch(expenses),
});
