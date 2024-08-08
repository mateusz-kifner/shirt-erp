import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.expense.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.expense.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.expense.create.useMutation(opts);
  return {
    ...mutation,
    createExpense: mutation.mutate,
    createExpenseAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.expense.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.expense.update.useMutation(opts);
  return {
    ...mutation,
    updateExpense: mutation.mutate,
    updateExpenseAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.expense.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.expense.deleteById.useMutation(opts);
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
