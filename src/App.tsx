import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "./api/notion";

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notionData"],
    queryFn: fetchNotionData,
  });

  const mutation = useMutation({
    mutationFn: (pageId: string) => increaseLike(pageId),
    onSuccess: () => {
      // 서버에 업데이트가 성공하면 다시 데이터 refetch
      queryClient.invalidateQueries({ queryKey: ["notionData"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  return (
    <div>
      <h1>This is me</h1>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            {item.text} - 좋아요: {item.likes}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => mutation.mutate(item.id)}
            >
              ❤️ Like
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
