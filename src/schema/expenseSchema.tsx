import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number(),
  name: z.string().max(255),
  cost: z.number().nullable().optional(),
  expensesCost: z.array(z.number()).nullable().optional(),
  expensesNames: z.array(z.string()).nullable().optional(),
});

export type ExpenseType = z.infer<typeof expenseSchema>;
