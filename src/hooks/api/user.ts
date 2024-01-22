import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiUserGetById(id: string | null) {
  return api.user.getById.useQuery(id as string, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiUserCreate() {
  const mutation = api.user.create.useMutation();
  return {
    ...mutation,
    createUser: mutation.mutate,
    createUserAsync: mutation.mutateAsync,
  };
}

export function useApiUserUpdate() {
  const mutation = api.user.update.useMutation();
  return {
    ...mutation,
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
  };
}

export function useApiUserDelete() {
  const mutation = api.user.deleteById.useMutation();
  return {
    ...mutation,
    deleteUser: mutation.mutate,
    deleteUserAsync: mutation.mutateAsync,
  };
}
