import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "./api/notion";
import { useOptimistic, useState } from "react";
import { Card } from "./components/Card";

function App() {
  const queryClient = useQueryClient();

  /**
   * 데이터 패칭
   */

  const { data, isLoading, error } = useQuery({
    queryKey: ["notionData"],
    queryFn: fetchNotionData,
  });
  const mutation = useMutation({
    mutationFn: (pageId: string) => increaseLike(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notionData"] });
    },
  });

  /**
   * 낙관적 likes 업데이트
   */
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [optimisticLikes, addOptimisticLike] = useOptimistic<
    Record<string, number>,
    { id: string; currentLikes: number }
  >(likes, (state, newLike) => ({
    ...state,
    [newLike.id]: (state[newLike.id] ?? newLike.currentLikes) + 1,
  }));

  const handleLike = (id: string, currentLikes: number) => {
    // 1. UI에 먼저 반영
    addOptimisticLike({ id, currentLikes });
    // 2. 서버 요청 보내기
    mutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  return (
    <div>
      <ul>
        {data?.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            text={item.text}
            likes={optimisticLikes[item.id] ?? item.likes}
            onLike={handleLike}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
