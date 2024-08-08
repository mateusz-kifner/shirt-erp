import type { SortType } from "./types";

export function IsSortForKeyDesc(
  sort?: SortType[] | SortType,
  key?: string,
): boolean | undefined {
  if (sort === undefined || key === undefined) return undefined;
  if (!Array.isArray(sort)) {
    return sort.id === key ? sort.desc : undefined;
  }
  for (const s of sort) {
    if (s.id === key) return s.desc;
  }
  return undefined;
}

export function getFirstArrayElementOrValue<T>(
  element: T[] | T,
): T | undefined {
  return Array.isArray(element) ? element[0] : element;
}
