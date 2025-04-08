import { Card } from "./components/Card";
import { useNotionData } from "./api/useNotionData";

function App() {
  const {
    data,
    isLoading,
    error,
    handleLike,
    optimisticLikes,
    pendingLikeIds,
  } = useNotionData();

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
            isPending={pendingLikeIds.has(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
