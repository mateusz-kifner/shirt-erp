import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiGlobalPropertyGetById(id: number | null) {
  return api.globalProperty.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiGlobalPropertyGetByCategory(id: string | null) {
  return api.globalProperty.getByCategory.useQuery(id as string, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiGlobalPropertyCreate() {
  const mutation = api.globalProperty.create.useMutation();
  return {
    ...mutation,
    createGlobalProperty: mutation.mutate,
    createGlobalPropertyAsync: mutation.mutateAsync,
  };
}

export function useApiGlobalPropertyUpdate() {
  const mutation = api.globalProperty.update.useMutation();
  return {
    ...mutation,
    updateGlobalProperty: mutation.mutate,
    updateGlobalPropertyAsync: mutation.mutateAsync,
  };
}

export function useApiGlobalPropertyDelete() {
  const mutation = api.globalProperty.deleteById.useMutation();
  return {
    ...mutation,
    deleteGlobalProperty: mutation.mutate,
    deleteGlobalPropertyAsync: mutation.mutateAsync,
  };
}
