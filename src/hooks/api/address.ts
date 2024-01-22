import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiAddressGetById(id: number | null) {
  return api.address.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiAddressCreate() {
  const mutation = api.address.create.useMutation();
  return {
    ...mutation,
    createAddress: mutation.mutate,
    createAddressAsync: mutation.mutateAsync,
  };
}

export function useApiAddressUpdate() {
  const mutation = api.address.update.useMutation();
  return {
    ...mutation,
    updateAddress: mutation.mutate,
    updateAddressAsync: mutation.mutateAsync,
  };
}

export function useApiAddressDelete() {
  const mutation = api.address.deleteById.useMutation();
  return {
    ...mutation,
    deleteAddress: mutation.mutate,
    deleteAddressAsync: mutation.mutateAsync,
  };
}
