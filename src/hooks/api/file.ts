import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiFileGetById(id: number | null) {
  return api.file.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
