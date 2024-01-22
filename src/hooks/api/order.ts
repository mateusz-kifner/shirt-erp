import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiOrderGetById(id: number | null) {
  return api.order.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
