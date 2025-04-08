import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "./api/notion";
import { useState } from "react";
import { Card } from "./components/Card";

function App() {
  //데이터 패칭
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

  //useState로 낙관적 업데이트
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, number>
  >({});
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(new Set());

  const handleLike = (id: string, currentLikes: number) => {
    mutation.mutate({ id, currentLikes });
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
            onLike={(id, currentLikes) => handleLike(id, currentLikes)}
            isPending={pendingLikeIds.has(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
