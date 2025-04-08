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
      queryClient.invalidateQueries({ queryKey: ["notionData"] }); // 데이터 무효화
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
    addOptimisticLike({ id, currentLikes }); // UI에 즉시 반영
    mutation.mutate(id); // 서버에 좋아요 증가 요청
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
