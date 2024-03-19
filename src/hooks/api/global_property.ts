import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.globalProperty.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useGetByCategory(id: string | null) {
  return trpc.globalProperty.getByCategory.useQuery(id as string, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useCreate() {
  const mutation = trpc.globalProperty.create.useMutation();
  return {
    ...mutation,
    createGlobalProperty: mutation.mutate,
    createGlobalPropertyAsync: mutation.mutateAsync,
  };
}

function useUpdate() {
  const mutation = trpc.globalProperty.update.useMutation();
  return {
    ...mutation,
    updateGlobalProperty: mutation.mutate,
    updateGlobalPropertyAsync: mutation.mutateAsync,
  };
}

export function useDelete() {
  const mutation = trpc.globalProperty.deleteById.useMutation();
  return {
    ...mutation,
    deleteGlobalProperty: mutation.mutate,
    deleteGlobalPropertyAsync: mutation.mutateAsync,
  };
}

const apiGlobalProperty = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiGlobalProperty;
