import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { omit } from "lodash";
import { useEffect, useState } from "react";

export function useApiClientGetById(id: number | null) {
  const [loadStep, setLoadStep] = useState(0);
  const RQClient = useQueryClient();

  const queryClientFull = api.client.getByIdFull.useQuery(id as number, {
    enabled: id !== null && loadStep === 0,
  });

  const queryClient = api.client.getById.useQuery(id as number, {
    enabled: id !== null && loadStep > 1,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 30s
  });

  const queryAddress = api.address.getById.useQuery(
    queryClientFull?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        loadStep > 1 &&
        (queryClientFull?.data?.addressId ?? undefined) !== undefined,
      refetchOnMount: false,
      staleTime: 60000,
      cacheTime: 60000,
    },
  );
  useEffect(() => {
    if (
      loadStep === 0 &&
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

      setLoadStep(1);
    }
  }, [queryClientFull.isSuccess]);

  useEffect(() => {
    if (loadStep === 1) setLoadStep(2);
  }, [loadStep]);

  return { client: queryClient, address: queryAddress };
}
