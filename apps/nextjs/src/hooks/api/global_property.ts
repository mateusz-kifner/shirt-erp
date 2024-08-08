import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.globalProperty.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useGetByCategory(category: string | null) {
  return trpc.globalProperty.getByCategory.useQuery(category as string, {
    enabled: category !== null,
    ...queryDefaults,
  });
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.globalProperty.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.globalProperty.create.useMutation(opts);
  return {
    ...mutation,
    createGlobalProperty: mutation.mutate,
    createGlobalPropertyAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.globalProperty.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.globalProperty.update.useMutation(opts);
  return {
    ...mutation,
    updateGlobalProperty: mutation.mutate,
    updateGlobalPropertyAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.globalProperty.deleteById.useMutation
>[0];

export function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.globalProperty.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteGlobalProperty: mutation.mutate,
    deleteGlobalPropertyAsync: mutation.mutateAsync,
  };
}

const apiGlobalProperty = {
  useCreate,
  useDelete,
  useGetByCategory,
  useGetById,
  useUpdate,
};

export default apiGlobalProperty;
