import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: string | null) {
  return trpc.user.getById.useQuery(id as string, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.user.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.user.create.useMutation(opts);
  return {
    ...mutation,
    createUser: mutation.mutate,
    createUserAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.user.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.user.update.useMutation(opts);
  return {
    ...mutation,
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.user.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.user.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteUser: mutation.mutate,
    deleteUserAsync: mutation.mutateAsync,
  };
}

const apiUser = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiUser;
