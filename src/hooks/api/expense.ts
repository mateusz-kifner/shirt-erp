import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiExpenseGetById(id: number | null) {
  return api.expense.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
