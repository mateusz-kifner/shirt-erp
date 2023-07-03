import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaded } from "./useLoaded";

function useRQCache<T>(
  key: string,
  initialData: T
): [T | null, (value: T) => void] {
  const isLoaded = useLoaded();
  const client = useQueryClient();

  const data = isLoaded
    ? useQuery<T>([key], () => initialData, {
        enabled: false,
        initialData,
      }).data
    : null;

  return [data, (value) => client.setQueryData([key], value)];
}

export default useRQCache;
