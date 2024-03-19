import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.file.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

function useUpdate() {
  const mutation = trpc.file.update.useMutation();
  return {
    ...mutation,
    updateFile: mutation.mutate,
    updateFileAsync: mutation.mutateAsync,
  };
}

function useDelete() {
  const mutation = trpc.file.deleteById.useMutation();
  return {
    ...mutation,
    deleteFile: mutation.mutate,
    deleteFileAsync: mutation.mutateAsync,
  };
}

const apiFile = {
  // useCreate,
  useDelete,
  useGetById,
  useUpdate,
};

export default apiFile;
