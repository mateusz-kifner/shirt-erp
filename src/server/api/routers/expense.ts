import { z } from "zod";

import { expenseSchema } from "@/schema/expenseSchema";
import {
  createProcedureGetById,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

const includeAll = {};

const expenseSchemaWithoutId = expenseSchema.omit({ id: true });

export const expenseRouter = createTRPCRouter({
  getById: createProcedureGetById("expenses"),
  create: authenticatedProcedure
    .input(
      expenseSchemaWithoutId
        .omit({ name: true })
        .merge(z.object({ name: z.string().max(255) })),
    )
    .mutation(async ({ input: expenseData }) => {
      // const newExpense = await prisma.expense.create({
      //   data: expenseData,
      // });

      // return newExpense;
    }),
  // deleteById: createProcedureDeleteById("expense"),
  update: authenticatedProcedure
    .input(expenseSchema)
    .mutation(async ({ input: expenseData }) => {
      // const updatedExpense = await prisma.expense.update({
      //   where: { id: expenseData.id },
      //   data: expenseData,
      // });
      // return updatedExpense;
    }),
  // searchWithPagination: createProcedureSearchWithPagination("expense"),
});
