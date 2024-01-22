import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiSpreadsheetGetById(id: number | null) {
  return api.spreadsheet.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiSpreadsheetCreate() {
  const mutation = api.spreadsheet.create.useMutation();
  return {
    ...mutation,
    createSpreadsheet: mutation.mutate,
    createSpreadsheetAsync: mutation.mutateAsync,
  };
}

export function useApiSpreadsheetUpdate() {
  const mutation = api.spreadsheet.update.useMutation();
  return {
    ...mutation,
    updateSpreadsheet: mutation.mutate,
    updateSpreadsheetAsync: mutation.mutateAsync,
  };
}

export function useApiSpreadsheetDelete() {
  const mutation = api.spreadsheet.deleteById.useMutation();
  return {
    ...mutation,
    deleteSpreadsheet: mutation.mutate,
    deleteSpreadsheetAsync: mutation.mutateAsync,
  };
}
