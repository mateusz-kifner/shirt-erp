import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiExpenseGetById(id: number | null) {
  return api.expense.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiExpenseCreate() {
  const mutation = api.expense.create.useMutation();
  return {
    ...mutation,
    createExpense: mutation.mutate,
    createExpenseAsync: mutation.mutateAsync,
  };
}

export function useApiExpenseUpdate() {
  const mutation = api.expense.update.useMutation();
  return {
    ...mutation,
    updateExpense: mutation.mutate,
    updateExpenseAsync: mutation.mutateAsync,
  };
}

export function useApiExpenseDelete() {
  const mutation = api.expense.deleteById.useMutation();
  return {
    ...mutation,
    deleteExpense: mutation.mutate,
    deleteExpenseAsync: mutation.mutateAsync,
  };
}
