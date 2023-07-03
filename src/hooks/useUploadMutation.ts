import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

const useUploadMutation = (
  options?: Omit<
    UseMutationOptions<Response, unknown, FormData, unknown>,
    "mutationFn"
  >
) => {
  return useMutation((formData: FormData) => {
    return fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  }, options);
};

export default useUploadMutation;
