interface CardProps {
  id: string;
  text: string;
  likes: number | null;
  onLike: (id: string, currentLikes: number) => void;
}
export const Card = (props: CardProps) => {
  const { id, text, likes, onLike } = props;

  return (
    <li key={id}>
      {text} - 좋아요: {likes}
      <button style={{ marginLeft: "10px" }} onClick={() => onLike(id, likes!)}>
        ❤️ Like
      </button>
    </li>
  );
};
