import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.product.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useCreate() {
  const mutation = trpc.product.create.useMutation();
  return {
    ...mutation,
    createProduct: mutation.mutate,
    createProductAsync: mutation.mutateAsync,
  };
}

function useUpdate() {
  const mutation = trpc.product.update.useMutation();
  return {
    ...mutation,
    updateProduct: mutation.mutate,
    updateProductAsync: mutation.mutateAsync,
  };
}

function useDelete() {
  const mutation = trpc.product.deleteById.useMutation();
  return {
    ...mutation,
    deleteProduct: mutation.mutate,
    deleteProductAsync: mutation.mutateAsync,
  };
}

const apiProduct = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiProduct;
