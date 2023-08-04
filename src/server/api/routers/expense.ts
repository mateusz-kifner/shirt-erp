import { z } from "zod";

import { expenseSchema } from "@/schema/expenseSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

const includeAll = {};

const expenseSchemaWithoutId = expenseSchema.omit({ id: true });

export const expenseRouter = createTRPCRouter({
  getAll: createProcedureGetAll("expense"),
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await prisma.expense.findUnique({
      where: { id: input },
    });
    return data;
  }),
  create: authenticatedProcedure
    .input(
      expenseSchemaWithoutId
        .omit({ name: true })
        .merge(z.object({ name: z.string().max(255) })),
    )
    .mutation(async ({ input: expenseData }) => {
      const newExpense = await prisma.expense.create({
        data: expenseData,
      });

      return newExpense;
    }),
  deleteById: createProcedureDeleteById("expense"),
  update: authenticatedProcedure
    .input(expenseSchema)
    .mutation(async ({ input: expenseData }) => {
      const updatedExpense = await prisma.expense.update({
        where: { id: expenseData.id },
        data: expenseData,
      });
      return updatedExpense;
    }),
  search: createProcedureSearch("expense"),
  searchWithPagination: createProcedureSearchWithPagination("expense"),
});
