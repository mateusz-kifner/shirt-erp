import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

// TODO populate address cache and customer cache
// Attempt to populate Product cache, users cache and file cache
// ignore spreadsheet cache
//
export function useApiOrderGetById(id: number | null | undefined) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const queryOrderFull = api.order.getFullById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && firstLoad,
    ...queryDefaults,
  });

  const queryOrder = api.order.getById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const queryCustomer = api.customer.getById.useQuery(id as number, {
    enabled:
      id !== null &&
      id !== undefined &&
      !firstLoad &&
      (queryOrderFull?.data?.customerId ?? null) !== null,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const queryAddress = api.address.getById.useQuery(
    queryOrderFull?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        id !== undefined &&
        !firstLoad &&
        (queryOrderFull?.data?.addressId ?? null) !== null,
      refetchOnMount: false,
      staleTime: 60 * 1000, // 60s
    },
  );

  useEffect(() => {
    if (
      firstLoad &&
      typeof queryOrderFull?.data?.addressId === "number" &&
      typeof queryOrderFull?.data?.customerId === "number" &&
      typeof queryOrderFull?.data?.id === "number"
    ) {
      // Order
      const orderGetByIdKey = getQueryKey(
        api.order.getById,
        queryOrderFull.data.id,
        "query",
      );

      // RQClient.setQueryData(
      //   customerGetByIdKey,
      //   omit(queryOrderFull?.data, "address"),
      // );

      // Customer
      const customerGetByIdKey = getQueryKey(
        api.customer.getById,
        queryOrderFull.data.id,
        "query",
      );

      RQClient.setQueryData(
        customerGetByIdKey,
        queryOrderFull?.data?.customer ?? undefined,
      );

      // Address
      const addressGetByIdKey = getQueryKey(
        api.address.getById,
        queryOrderFull.data.addressId,
        "query",
      );

      RQClient.setQueryData(
        addressGetByIdKey,
        queryOrderFull?.data?.address ?? undefined,
      );

      setFirstLoad(false);
    }
  }, [queryOrderFull.isSuccess]);

  return { order: queryOrder, customer: queryCustomer, address: queryAddress };
}

export function useApiOrderCreate() {
  const mutation = api.order.create.useMutation();
  return {
    ...mutation,
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
  };
}

export function useApiOrderUpdate() {
  const mutation = api.order.update.useMutation();
  return {
    ...mutation,
    updateOrder: mutation.mutate,
    updateOrderAsync: mutation.mutateAsync,
  };
}

export function useApiOrderDelete() {
  const mutation = api.order.deleteById.useMutation();
  return {
    ...mutation,
    deleteOrder: mutation.mutate,
    deleteOrderAsync: mutation.mutateAsync,
  };
}
