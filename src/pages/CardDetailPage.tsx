import useGetCardDetail from "../hooks/api/card/useGetCardDetail";
import useCardLikeManager from "../hooks/api/card/useCardLikeManager";
import Card from "../components/Card";

interface CardDetailPageProps {
  cardId: number;
}

const CardDetailPage = ({ cardId }: CardDetailPageProps) => {
  const { data } = useGetCardDetail(cardId);

  const { isLiked, likeCount, toggleLike } = useCardLikeManager({
    cardId,
    initialIsLiked: data.isLiked,
    initialLikeCount: data.likeCount,
  });

  return (
    <div style={styles.page}>
      <Card
        title={data.title}
        description={data.description}
        likeCount={likeCount}
        isLiked={isLiked}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "32px",
  },
};

export default CardDetailPage;
