import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { omit } from "lodash";
import { useEffect, useState } from "react";

export function useApiClientGetById(id: number | null) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const queryClientFull = api.client.getByIdFull.useQuery(id as number, {
    enabled: id !== null && firstLoad,
  });

  const queryClient = api.client.getById.useQuery(id as number, {
    enabled: id !== null && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 30s
  });

  const queryAddress = api.address.getById.useQuery(
    queryClientFull?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        !firstLoad &&
        (queryClientFull?.data?.addressId ?? undefined) !== undefined,
      refetchOnMount: false,
      staleTime: 60 * 1000, // 30s
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
