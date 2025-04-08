import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "../api/notion";
import { useState } from "react";

export const useNotionData = () => {
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, number>
  >({});
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ["notionData"],
    queryFn: fetchNotionData,
  });

  const mutation = useMutation<
    void,
    unknown,
    { id: string; currentLikes: number },
    { prevLikes: number }
  >({
    mutationFn: ({ id }) => increaseLike(id),
    onMutate: ({ id, currentLikes }) => {
      const prevLikes = optimisticLikes[id] ?? currentLikes;

      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: prevLikes + 1,
      }));

      setPendingLikeIds((prev) => new Set(prev).add(id));

      return { prevLikes };
    },
    onError: (_error, { id }, context) => {
      if (!id || !context) return;

      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: context.prevLikes,
      }));
    },
    onSettled: (_data, _error, { id }) => {
      if (!id) return;

      setPendingLikeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    },
  });

  const handleLike = (id: string, currentLikes: number) => {
    mutation.mutate({ id, currentLikes });
  };

  return {
    data,
    isLoading,
    error,
    handleLike,
    optimisticLikes,
    pendingLikeIds,
  };
};
