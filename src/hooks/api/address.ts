import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";
import { getQueryKey } from "@trpc/react-query";

function useGetById(id?: number | null) {
  return trpc.address.getById.useQuery(id as number, {
    enabled: id !== null && id !== undefined,
    ...queryDefaults,
  });
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.address.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.address.create.useMutation(opts);
  return {
    ...mutation,
    createAddress: mutation.mutate,
    createAddressAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.address.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const utils = trpc.useUtils();
  const mutation = trpc.address.update.useMutation({
    ...opts,
    // async onMutate(newPost) {
    //   // Cancel outgoing fetches (so they don't overwrite our optimistic update)
    //   utils
    //   await utils.address.update.cancel();
    //   // Get the data from the queryCache
    //   const prevData = utils.address.update.getData();
    //   // Optimistically update the data with our new post
    //   utils.address.update.setData(undefined, (old) => [...old, newPost]);
    //   // Return the previous data so we can revert if something goes wrong
    //   return { prevData };
    // },
    // onError(err, newPost, ctx) {
    //   // If the mutation fails, use the context-value from onMutate
    //   utils.address.update.setData(undefined, ctx.prevData);
    // },
    // onSettled() {
    //   // Sync with server once mutation has settled
    //   utils.address.update.invalidate();
    // },
  });
  return {
    ...mutation,
    updateAddress: mutation.mutate,
    updateAddressAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.address.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.address.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteAddress: mutation.mutate,
    deleteAddressAsync: mutation.mutateAsync,
  };
}

const apiAddress = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiAddress;
