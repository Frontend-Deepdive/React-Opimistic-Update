import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
};

export default useCardLikeManager;
