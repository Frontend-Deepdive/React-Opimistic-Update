import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "./api/notion";
import { useState } from "react";
import { Card } from "./components/Card";

function App() {
  /**
   * 데이터 패칭
   */

  const { data, isLoading, error } = useQuery({
    queryKey: ["notionData"],
    queryFn: fetchNotionData,
  });
  const mutation = useMutation({
    mutationFn: (pageId: string) => increaseLike(pageId),
  });

  /**
   * ✅ useState로 낙관적 likes 업데이트
   */
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, number>
  >({});

  const handleLike = (id: string, currentLikes: number) => {
    // 1. UI 먼저 업데이트
    setOptimisticLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentLikes) + 1,
    }));

    // 2. 서버에 실제 요청
    mutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  console.log("optimisticLikes", optimisticLikes);
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
