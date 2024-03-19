import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

// TODO populate address cache and customer cache

function useGetById(id: number | null | undefined) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const orderFullQuery = trpc.order.getFullById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && firstLoad,
    ...queryDefaults,
  });

  const orderQuery = trpc.order.getById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  // trpc.customer.getById.useQuery(id as number, {
  //   enabled:
  //     id !== null &&
  //     id !== undefined &&
  //     !firstLoad &&
  //     (orderFullQuery?.data?.customerId ?? null) !== null,
  //   refetchOnMount: false,
  //   staleTime: 60 * 1000, // 60s
  // });

  // trpc.address.getById.useQuery(
  //   orderFullQuery?.data?.addressId as number,
  //   {
  //     enabled:
  //       id !== null &&
  //       id !== undefined &&
  //       !firstLoad &&
  //       (orderFullQuery?.data?.addressId ?? null) !== null,
  //     refetchOnMount: false,
  //     staleTime: 60 * 1000, // 60s
  //   },
  // );

  useEffect(() => {
    if (
      firstLoad &&
      typeof orderFullQuery?.data?.addressId === "number" &&
      typeof orderFullQuery?.data?.customerId === "number" &&
      typeof orderFullQuery?.data?.id === "number"
    ) {
      // Order
      const orderGetByIdKey = getQueryKey(
        trpc.order.getById,
        orderFullQuery.data.id,
        "query",
      );

      // RQClient.setQueryData(
      //   customerGetByIdKey,
      //   omit(orderFullQuery?.data, "address"),
      // );

      // Customer
      const customerGetByIdKey = getQueryKey(
        trpc.customer.getById,
        orderFullQuery.data.id,
        "query",
      );

      RQClient.setQueryData(
        customerGetByIdKey,
        orderFullQuery?.data?.customer ?? undefined,
      );

      // Address
      const addressGetByIdKey = getQueryKey(
        trpc.address.getById,
        orderFullQuery.data.addressId,
        "query",
      );

      RQClient.setQueryData(
        addressGetByIdKey,
        orderFullQuery?.data?.address ?? undefined,
      );

      setFirstLoad(false);
    }
  }, [orderFullQuery.isSuccess]);

  return orderQuery;
}



type UseTRPCMutationCreateOptions = Parameters<
  typeof trpc.order.create.useMutation
>[0];

function useCreate(opts?: UseTRPCMutationCreateOptions) {
  const mutation = trpc.order.create.useMutation(opts);
  return {
    ...mutation,
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.order.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.order.update.useMutation(opts);
  return {
    ...mutation,
    updateOrder: mutation.mutate,
    updateOrderAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.order.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.order.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteOrder: mutation.mutate,
    deleteOrderAsync: mutation.mutateAsync,
  };
}

function useGetRelatedEmails(id: number | null | undefined) {}
function useGetRelatedProducts(id: number | null | undefined) {}
function useGetRelatedSpreadsheets(id: number | null | undefined) {}
function useGetRelatedFiles(id: number | null | undefined) {}
function useGetRelatedCustomer(id: number | null | undefined) {}

const apiOrder = {
  useCreate,
  useDelete,
  useGetById,
  useUpdate,
  useGetRelatedEmails,
  useGetRelatedProducts,
  useGetRelatedSpreadsheets,
  useGetRelatedFiles,
  useGetRelatedCustomer
};

export default apiOrder;
