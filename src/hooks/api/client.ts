import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import queryDefaults from "./queryDefaults";

export function useApiClientGetById(id: number | null) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const queryClientFull = api.client.getFullById.useQuery(id as number, {
    enabled: id !== null && firstLoad,
    ...queryDefaults,
  });

  const queryClient = api.client.getById.useQuery(id as number, {
    enabled: id !== null && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const queryAddress = api.address.getById.useQuery(
    queryClientFull?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        !firstLoad &&
        (queryClientFull?.data?.addressId ?? undefined) !== undefined,
      refetchOnMount: false,
      staleTime: 60 * 1000, // 60s
    },
  );

  useEffect(() => {
    if (
      firstLoad &&
      typeof queryClientFull?.data?.addressId === "number" &&
      typeof queryClientFull?.data?.id === "number"
    ) {
      const addressGetByIdKey = getQueryKey(
        api.address.getById,
        queryClientFull.data.addressId,
        "query",
      );
      const clientGetByIdKey = getQueryKey(
        api.client.getById,
        queryClientFull.data.id,
        "query",
      );

      RQClient.setQueryData(
        addressGetByIdKey,
        queryClientFull?.data?.address ?? undefined,
      );
      RQClient.setQueryData(
        clientGetByIdKey,
        omit(queryClientFull?.data, "address"),
      );

      setFirstLoad(false);
    }
  }, [queryClientFull.isSuccess]);

  return { client: queryClient, address: queryAddress };
}

export function useApiClientCreate() {
  const mutation = api.client.create.useMutation();
  return {
    ...mutation,
    createClient: mutation.mutate,
    createClientAsync: mutation.mutateAsync,
  };
}

export function useApiClientUpdate() {
  const mutation = api.client.update.useMutation();
  return {
    ...mutation,
    updateClient: mutation.mutate,
    updateClientAsync: mutation.mutateAsync,
  };
}

export function useApiClientDelete() {
  const mutation = api.client.deleteById.useMutation();
  return {
    ...mutation,
    deleteClient: mutation.mutate,
    deleteClientAsync: mutation.mutateAsync,
  };
}
