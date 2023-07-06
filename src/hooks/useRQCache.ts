import { useQuery, useQueryClient } from "@tanstack/react-query";

function useRQCache<T>(
  key: string,
  initialData: T
): [T | null, (value: T) => void] {
  const client = useQueryClient();

  const data =  useQuery<T>([key], () => initialData, {
        enabled: false,
        initialData,
      }).data

  return [data, (value) => client.setQueryData([key], value)];
}

export default useRQCache;
