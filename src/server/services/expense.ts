import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq, sql } from "drizzle-orm";
import { MetadataType } from "@/schema/MetadataType";
import { Expense, UpdatedExpense } from "@/schema/expenseZodSchema";

// compile query ahead of time
const dbPrepareGetById = db.query.expenses
  .findFirst({
    where: eq(expenses.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: number) {
  return await dbPrepareGetById.execute({ id });
}

async function create(expenseData: Partial<Expense>) {
  const newExpense = await db.insert(expenses).values(expenseData).returning();
  if (newExpense[0] === undefined)
    throw new Error("[ExpenseService]: Could not create expense");
  return newExpense[0];
}

async function deleteById(id: number) {
  return await db.delete(expenses).where(eq(expenses.id, id));
}

async function update(expenseData: UpdatedExpense & MetadataType) {
  const { id, ...dataToUpdate } = expenseData;
  const updatedExpense = await db
    .update(expenses)
    .set(dataToUpdate)
    .where(eq(expenses.id, id))
    .returning();
  if (updatedExpense[0] === undefined)
    throw new Error("[ExpenseService]: Could not update expense");
  return updatedExpense[0];
}

const expenseService = { getById, create, deleteById, update };

export default expenseService;
