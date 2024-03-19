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
  }, [queryCustomerFull.isSuccess]);

  return queryCustomer;
}
function useCreate() {
  const mutation = trpc.customer.create.useMutation();
  return {
    ...mutation,
    createCustomer: mutation.mutate,
    createCustomerAsync: mutation.mutateAsync,
  };
}
function useUpdate() {
  const mutation = trpc.customer.update.useMutation();
  return {
    ...mutation,
    updateCustomer: mutation.mutate,
    updateCustomerAsync: mutation.mutateAsync,
  };
}
function useDelete() {
  const mutation = trpc.customer.deleteById.useMutation();
  return {
    ...mutation,
    deleteCustomer: mutation.mutate,
    deleteCustomerAsync: mutation.mutateAsync,
  };
}

const apiCustomer = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiCustomer;
