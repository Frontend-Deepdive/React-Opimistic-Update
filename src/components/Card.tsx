interface CardProps {
  title: string;
  description: string;
  likeCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
}

const Card = ({ title, description, likeCount, isLiked, onToggleLike }: CardProps) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
      <div style={styles.likeSection}>
        <button
          style={{
            ...styles.likeButton,
            ...(isLiked ? styles.liked : styles.notLiked),
          }}
          onClick={onToggleLike}
        >
          🤍
        </button>
        <span>좋아요 : {likeCount}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "16px",
  },
  likeSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeButton: {
    padding: "8px",
    margin: "0 8px 0 0",
    borderRadius: "4px",
    border: "2px solid",
    cursor: "pointer",
    fontSize: "20px",
  },
  liked: {
    backgroundColor: "#e80a0a",
    color: "#fff",
    borderColor: "#fff",
  },
  notLiked: {
    backgroundColor: "#eee",
    color: "#000",
    borderColor: "#000",
  },
};

export default Card;
