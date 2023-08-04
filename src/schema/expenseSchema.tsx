import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number(),
  name: z.string().max(255).optional(),
  cost: z.number().nullable().optional(),
  expensesData: z
    .object({
      name: z.string().nullable().optional(),
      cost: z.number().nullable().optional(),
    })
    .array()
    .optional(),
});

export type ExpenseType = z.infer<typeof expenseSchema>;
