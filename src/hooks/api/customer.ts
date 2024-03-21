import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import _ from "lodash";
import { useEffect, useState } from "react";
import queryDefaults from "./queryDefaults";
function useGetById(id: number | null) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const queryCustomerFull = trpc.customer.getFullById.useQuery(id as number, {
    enabled: id !== null && firstLoad,
    ...queryDefaults,
  });

  const queryCustomer = trpc.customer.getById.useQuery(id as number, {
    enabled: id !== null && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  // trpc.address.getById.useQuery(
  //   queryCustomerFull?.data?.addressId as number,
  //   {
  //     enabled:
  //       id !== null &&
  //       !firstLoad &&
  //       (queryCustomerFull?.data?.addressId ?? undefined) !== undefined,
  //     refetchOnMount: false,
  //     staleTime: 60 * 1000, // 60s
  //   },
  // );

  // biome-ignore lint/correctness/useExhaustiveDependencies: queryCustomerFull.data.id should always be present
  useEffect(() => {
    if (
      firstLoad &&
      typeof queryCustomerFull?.data?.addressId === "number" &&
      typeof queryCustomerFull?.data?.id === "number"
    ) {
      const addressGetByIdKey = getQueryKey(
        trpc.address.getById,
        queryCustomerFull.data.addressId,
        "query",
      );
      const customerGetByIdKey = getQueryKey(
        trpc.customer.getById,
        queryCustomerFull.data.id,
        "query",
      );

      RQClient.setQueryData(
        addressGetByIdKey,
        queryCustomerFull?.data?.address ?? undefined,
      );
      RQClient.setQueryData(
        customerGetByIdKey,
        _.omit(queryCustomerFull?.data, "address"),
      );

      setFirstLoad(false);
    }
  }, [queryCustomerFull.isSuccess, queryCustomerFull?.data?.id]);

  return queryCustomer;
}

type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.customer.create.useMutation
>[0];
function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.customer.create.useMutation(opts);
  return {
    ...mutation,
    createCustomer: mutation.mutate,
    createCustomerAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.customer.update.useMutation
>[0];
function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.customer.update.useMutation(opts);
  return {
    ...mutation,
    updateCustomer: mutation.mutate,
    updateCustomerAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.customer.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.customer.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteCustomer: mutation.mutate,
    deleteCustomerAsync: mutation.mutateAsync,
  };
}

function useGetRelatedAddress(id: number | null | undefined) {
  const addressQuery = trpc.customer.getRelatedAddress.useQuery(id as number, {
    enabled: id !== null && id !== undefined,
    ...queryDefaults,
  });
  return addressQuery;
}

const apiCustomer = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
  useGetRelatedAddress,
};

export default apiCustomer;
