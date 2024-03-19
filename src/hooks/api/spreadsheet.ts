import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.spreadsheet.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.spreadsheet.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.spreadsheet.create.useMutation(opts);
  return {
    ...mutation,
    createSpreadsheet: mutation.mutate,
    createSpreadsheetAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.spreadsheet.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.spreadsheet.update.useMutation(opts);
  return {
    ...mutation,
    updateSpreadsheet: mutation.mutate,
    updateSpreadsheetAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.spreadsheet.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.spreadsheet.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteSpreadsheet: mutation.mutate,
    deleteSpreadsheetAsync: mutation.mutateAsync,
  };
}

const apiSpreadsheet = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiSpreadsheet;
