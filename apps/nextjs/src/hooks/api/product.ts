import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.product.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.product.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.product.create.useMutation(opts);
  return {
    ...mutation,
    createProduct: mutation.mutate,
    createProductAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.product.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.product.update.useMutation(opts);
  return {
    ...mutation,
    updateProduct: mutation.mutate,
    updateProductAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.product.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.product.deleteById.useMutation(opts);
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
