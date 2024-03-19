import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.expense.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useCreate() {
  const mutation = trpc.expense.create.useMutation();
  return {
    ...mutation,
    createExpense: mutation.mutate,
    createExpenseAsync: mutation.mutateAsync,
  };
}

function useUpdate() {
  const mutation = trpc.expense.update.useMutation();
  return {
    ...mutation,
    updateExpense: mutation.mutate,
    updateExpenseAsync: mutation.mutateAsync,
  };
}

function useDelete() {
  const mutation = trpc.expense.deleteById.useMutation();
  return {
    ...mutation,
    deleteExpense: mutation.mutate,
    deleteExpenseAsync: mutation.mutateAsync,
  };
}

const apiExpense = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiExpense;
