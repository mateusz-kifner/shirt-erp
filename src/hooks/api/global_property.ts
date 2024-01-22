import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiGlobalPropertyGetById(id: number | null) {
  return api["global-properties"].getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
