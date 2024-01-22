import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiProductGetById(id: number | null) {
  return api.product.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiProductCreate() {
  const mutation = api.product.create.useMutation();
  return {
    ...mutation,
    createProduct: mutation.mutate,
    createProductAsync: mutation.mutateAsync,
  };
}

export function useApiProductUpdate() {
  const mutation = api.product.update.useMutation();
  return {
    ...mutation,
    updateProduct: mutation.mutate,
    updateProductAsync: mutation.mutateAsync,
  };
}

export function useApiProductDelete() {
  const mutation = api.product.deleteById.useMutation();
  return {
    ...mutation,
    deleteProduct: mutation.mutate,
    deleteProductAsync: mutation.mutateAsync,
  };
}
