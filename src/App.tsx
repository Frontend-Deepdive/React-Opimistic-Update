import styled from "styled-components";
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
    <Container>
      <CardList>
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
      </CardList>
    </Container>
  );
}

export default App;

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 0 16px;
`;

const CardList = styled.ul`
  padding: 0;
  margin: 0;
`;
