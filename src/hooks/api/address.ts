import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiAddressGetById(id: number | null) {
  return api.address.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
