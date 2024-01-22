import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";

export function useApiOrderGetById(id: number | null) {
  return api.order.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

export function useApiOrderCreate() {
  const mutation = api.order.create.useMutation();
  return {
    ...mutation,
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
  };
}

export function useApiOrderUpdate() {
  const mutation = api.order.update.useMutation();
  return {
    ...mutation,
    updateOrder: mutation.mutate,
    updateOrderAsync: mutation.mutateAsync,
  };
}

export function useApiOrderDelete() {
  const mutation = api.order.deleteById.useMutation();
  return {
    ...mutation,
    deleteOrder: mutation.mutate,
    deleteOrderAsync: mutation.mutateAsync,
  };
}
