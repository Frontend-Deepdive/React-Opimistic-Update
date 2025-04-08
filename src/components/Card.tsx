interface CardProps {
  id: string;
  text: string;
  likes: number | null;
  onLike: (id: string, currentLikes: number) => void;
  isPending: boolean;
}
export const Card = (props: CardProps) => {
  const { id, text, likes, onLike, isPending } = props;

  return (
    <li key={id}>
      {text} - 좋아요: {likes}
      {isPending && (
        <span style={{ marginLeft: "8px", color: "gray" }}>pending...</span>
      )}
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => onLike(id, likes ?? 0)}
      >
        ❤️ Like
      </button>
    </li>
  );
};
