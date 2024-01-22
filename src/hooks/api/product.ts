import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiProductGetById(id: number | null) {
  return api.product.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
