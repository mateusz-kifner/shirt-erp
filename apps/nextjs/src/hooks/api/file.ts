import { trpc } from "@/utils/trpc";
import queryDefaults from "./queryDefaults";

function useGetById(id: number | null) {
  return trpc.file.getById.useQuery(id as number, {
    enabled: id !== null,
    ...queryDefaults,
  });
}

type UseTRPCMutationUpdateOptions = Parameters<
  typeof trpc.file.update.useMutation
>[0];

function useUpdate(opts?: UseTRPCMutationUpdateOptions) {
  const mutation = trpc.file.update.useMutation(opts);
  return {
    ...mutation,
    updateFile: mutation.mutate,
    updateFileAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationDeleteOptions = Parameters<
  typeof trpc.file.deleteById.useMutation
>[0];

function useDelete(opts?: UseTRPCMutationDeleteOptions) {
  const mutation = trpc.file.deleteById.useMutation(opts);
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
