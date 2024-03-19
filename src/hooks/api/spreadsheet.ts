import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.spreadsheet.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useCreate() {
  const mutation = trpc.spreadsheet.create.useMutation();
  return {
    ...mutation,
    createSpreadsheet: mutation.mutate,
    createSpreadsheetAsync: mutation.mutateAsync,
  };
}

function useUpdate() {
  const mutation = trpc.spreadsheet.update.useMutation();
  return {
    ...mutation,
    updateSpreadsheet: mutation.mutate,
    updateSpreadsheetAsync: mutation.mutateAsync,
  };
}

function useDelete() {
  const mutation = trpc.spreadsheet.deleteById.useMutation();
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
