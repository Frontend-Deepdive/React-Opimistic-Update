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
  const mutation = useMutation<
    void, // 반환값 (increaseLike는 반환값이 없음)
    unknown, // 에러 타입
    string, // 변수 타입 (pageId)
    { prevLikes: number } // context 타입
  >({
    mutationFn: (pageId: string) => increaseLike(pageId),
    // ✅ mutation 실행 직전에 context 반환
    onMutate: (pageId) => {
      const prevLikes = optimisticLikes[pageId] ?? 0;

      setOptimisticLikes((prev) => ({
        ...prev,
        [pageId]: prevLikes + 1,
      }));

      return { prevLikes };
    },
    // ✅ 에러나면 rollback
    onError: (_error, pageId, context) => {
      if (!pageId || !context) return;

      setOptimisticLikes((prev) => ({
        ...prev,
        [pageId]: context.prevLikes,
      }));
    },
  });

  /**
   * ✅ useState로 낙관적 likes 업데이트
   */
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, number>
  >({});

  const handleLike = (id: string) => {
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
