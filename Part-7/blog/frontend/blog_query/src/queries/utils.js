import { useQueryClient, useMutation } from '@tanstack/react-query';

export const useEnhancedMutation = (
  mutationFn,
  {
    invalidate = [],
    update = [],
    onInternalSuccess,
    onInternalError,
    mutationOptions = {}
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      invalidate.forEach((key) => {
        const resolvedKey = typeof key === 'function' ? key(data, variables, context) : key;
        queryClient.invalidateQueries({ queryKey: resolvedKey });
      });

      update.forEach(({ key, updater }) => {
        const resolvedKey = typeof key === 'function' ? key(data, variables, context) : key;
        queryClient.setQueryData(resolvedKey, (prev) => updater(data, prev));
      });

      if (onInternalSuccess) {
        onInternalSuccess(data, variables, context);
      }

      // invoke outside onSuccess from mutate method additionally.
      mutationOptions?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (onInternalError) {
        onInternalError(error, variables, context);
      }

      // invoke outside onError from mutate method additionally.
      mutationOptions?.onError?.(error, variables, context);
    }
  });
};
