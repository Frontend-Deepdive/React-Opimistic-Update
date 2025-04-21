import styled from "styled-components";

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
    <CardWrapper>
      <Text>{text}</Text>
      <LikeSection>
        <LikeCount>좋아요: {likes}</LikeCount>
        {isPending && <Pending>pending...</Pending>}
        <LikeButton onClick={() => onLike(id, likes ?? 0)}>❤️ Like</LikeButton>
      </LikeSection>
    </CardWrapper>
  );
};

const CardWrapper = styled.li`
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  list-style: none;
`;

const Text = styled.p`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const LikeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LikeCount = styled.span`
  font-weight: bold;
`;

const Pending = styled.span`
  color: gray;
  font-size: 0.9rem;
`;

const LikeButton = styled.button`
  background-color: #ffdddd;
  color: #d60000;
  font-weight: bold;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffc4c4;
  }
`;
