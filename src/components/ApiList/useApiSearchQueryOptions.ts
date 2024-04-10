import { useReducer } from "react";

interface queryOptionsType<TColumns extends string> {
  keys: string[];
  currentPage: number;
  itemsPerPage?: number;
}

type setKeysActionType = { type: "setKeys"; payload: string[] };

type queryActionsType = setKeysActionType;

function queryReducer<T extends string>(
  state: queryOptionsType<T>,
  action: queryActionsType,
): queryOptionsType<T> {
  return state;
}

function useApiSearchQueryOptions<T extends string>(
  defaultOptions: queryOptionsType<T> = {
    keys: ["name"],
    currentPage: 1,
    itemsPerPage: undefined,
  },
) {
  return useReducer(queryReducer, defaultOptions);
}

export default useApiSearchQueryOptions;
