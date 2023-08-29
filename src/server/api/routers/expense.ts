import { z } from "zod";

import { db } from "@/db/db";
import { expenses } from "@/db/schema/expenses";
import {
  insertExpenseZodSchema,
  updateExpenseZodSchema,
} from "@/schema/expenseZodSchema";
import {
  createProcedureGetById,
  createProcedureSearch,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

export const expenseRouter = createTRPCRouter({
  getById: createProcedureGetById("expenses"),
  create: authenticatedProcedure
    .input(insertExpenseZodSchema)
    .mutation(async ({ input: expenseData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const newExpense = await db
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
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedClient = await db
        .delete(expenses)
        .where(eq(expenses.id, id))
        .returning();
      return deletedClient[0];
    }),
  update: authenticatedProcedure
    .input(updateExpenseZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const updatedClient = await db
        .update(expenses)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(expenses.id, id))
        .returning();
      return updatedClient[0];
    }),
  search: createProcedureSearch(expenses, "expenses"),
});
