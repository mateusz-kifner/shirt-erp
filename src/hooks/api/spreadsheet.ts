import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiSpreadsheetGetById(id: number | null) {
  return api.spreadsheet.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}
