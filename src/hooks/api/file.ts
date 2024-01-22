import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiFileGetById(id: number | null) {
  return api.file.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiFileUpdate() {
  const mutation = api.file.update.useMutation();
  return {
    ...mutation,
    updateFile: mutation.mutate,
    updateFileAsync: mutation.mutateAsync,
  };
}

export function useApiFileDelete() {
  const mutation = api.file.deleteById.useMutation();
  return {
    ...mutation,
    deleteFile: mutation.mutate,
    deleteFileAsync: mutation.mutateAsync,
  };
}
