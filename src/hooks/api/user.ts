import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: string | null) {
  return trpc.user.getById.useQuery(id as string, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useCreate() {
  const mutation = trpc.user.create.useMutation();
  return {
    ...mutation,
    createUser: mutation.mutate,
    createUserAsync: mutation.mutateAsync,
  };
}

function useUpdate() {
  const mutation = trpc.user.update.useMutation();
  return {
    ...mutation,
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
  };
}

function useDelete() {
  const mutation = trpc.user.deleteById.useMutation();
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
