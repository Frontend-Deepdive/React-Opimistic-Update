import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CardAPI, CardDetailResponse } from "../../../api/cardAPI";
import useGetCardDetail from "./useGetCardDetail";

interface UseCardLikeManagerProps {
  cardId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
}

const useCardLikeManager = ({
  cardId,
  initialIsLiked,
  initialLikeCount,
}: UseCardLikeManagerProps) => {
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

  const useLikeMutation = (
    mutationFunction: (cardId: number) => Promise<void>,
    isLikeAction: boolean
  ) => {
    return useMutation({
      mutationFn: mutationFunction,
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: useGetCardDetail.getKey(cardId),
        });

        setIsLiked(isLikeAction);
        setLikeCount((prevCount) => prevCount + (isLikeAction ? 1 : -1));

        const previousData = queryClient.getQueryData<CardDetailResponse>(
          useGetCardDetail.getKey(cardId)
        );

        return { previousData };
      },
    });
  };

  const { mutate: like } = useLikeMutation(CardAPI.like, true);
  const { mutate: unlike } = useLikeMutation(CardAPI.unlike, false);

  const toggleLike = () => {
    if (isLiked) {
      unlike(cardId);
      return;
    }

    like(cardId);
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
  };
};

export default useCardLikeManager;
