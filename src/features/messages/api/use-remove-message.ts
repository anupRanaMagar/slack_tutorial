import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"messages">;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSetteled?: () => void;
  throwError?: boolean;
};

export const useRemoveMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  // const [isPending, setIsPending] = useState<boolean>(false);
  // const [isSuccess, setIsSuccess] = useState<boolean>(false);
  // const [isError, setIsError] = useState<boolean>(false);
  // const [isSettled, setIsSettled] = useState<boolean>(false);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [error]);
  const isError = useMemo(() => status === "error", [error]);
  const isSettled = useMemo(() => status === "settled", [error]);

  const mutation = useMutation(api.messages.remove);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSetteled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isError,
    isPending,
    isSuccess,
    isSettled,
  };
};
