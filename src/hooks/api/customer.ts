import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import _ from "lodash";
import { useEffect, useState } from "react";
import queryDefaults from "./queryDefaults";

export function useApiCustomerGetById(id: number | null) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const queryCustomerFull = api.customer.getFullById.useQuery(id as number, {
    enabled: id !== null && firstLoad,
    ...queryDefaults,
  });

  const queryCustomer = api.customer.getById.useQuery(id as number, {
    enabled: id !== null && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const queryAddress = api.address.getById.useQuery(
    queryCustomerFull?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        !firstLoad &&
        (queryCustomerFull?.data?.addressId ?? undefined) !== undefined,
      refetchOnMount: false,
      staleTime: 60 * 1000, // 60s
    },
  );

  useEffect(() => {
    if (
      firstLoad &&
      typeof queryCustomerFull?.data?.addressId === "number" &&
      typeof queryCustomerFull?.data?.id === "number"
    ) {
      const addressGetByIdKey = getQueryKey(
        api.address.getById,
        queryCustomerFull.data.addressId,
        "query",
      );
      const customerGetByIdKey = getQueryKey(
        api.customer.getById,
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

  return { customer: queryCustomer, address: queryAddress };
}

export function useApiCustomerCreate() {
  const mutation = api.customer.create.useMutation();
  return {
    ...mutation,
    createCustomer: mutation.mutate,
    createCustomerAsync: mutation.mutateAsync,
  };
}

export function useApiCustomerUpdate() {
  const mutation = api.customer.update.useMutation();
  return {
    ...mutation,
    updateCustomer: mutation.mutate,
    updateCustomerAsync: mutation.mutateAsync,
  };
}

export function useApiCustomerDelete() {
  const mutation = api.customer.deleteById.useMutation();
  return {
    ...mutation,
    deleteCustomer: mutation.mutate,
    deleteCustomerAsync: mutation.mutateAsync,
  };
}
