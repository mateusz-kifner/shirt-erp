import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiGlobalPropertyGetById(id: number | null) {
  return api["global-properties"].getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiGlobalPropertyCreate() {
  const mutation = api["global-properties"].create.useMutation();
  return {
    ...mutation,
    createGlobalProperty: mutation.mutate,
    createGlobalPropertyAsync: mutation.mutateAsync,
  };
}

export function useApiGlobalPropertyUpdate() {
  const mutation = api["global-properties"].update.useMutation();
  return {
    ...mutation,
    updateGlobalProperty: mutation.mutate,
    updateGlobalPropertyAsync: mutation.mutateAsync,
  };
}

export function useApiGlobalPropertyDelete() {
  const mutation = api["global-properties"].deleteById.useMutation();
  return {
    ...mutation,
    deleteGlobalProperty: mutation.mutate,
    deleteGlobalPropertyAsync: mutation.mutateAsync,
  };
}
