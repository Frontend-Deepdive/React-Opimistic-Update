import React, { useState } from 'react';
import './Card.css';
import imgArr from '../constants/img.json';
import useStore from '../stores/useStore';

interface CardProps {
  initialLikes: number;
  isError: boolean;
  id: string;
}

const Card: React.FC<CardProps> = ({ isError, id }) => {
  const { likes, incrementLikes, decrementLikes } = useStore();
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  const handleLike = async () => {
    if (pending) return;
    setPending(true);

    if (liked) {
      decrementLikes(id);
      setLiked(false);
      setPending(false);
      return;
    }
    incrementLikes(id);
    setLiked(true);

    try {
      if (isError) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        decrementLikes(id);
        setLiked(false);
        console.log('낙관적 업데이트로 좋아요가 취소됩니다!');
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className='card'>
      <div className='card-img'>
        {!isError ? (
          <img src={imgArr.imgArr[0]} alt='cider' />
        ) : (
          <img src={imgArr.imgArr[1]} alt='juni' />
        )}
      </div>
      <div>
        {id == 'cider' ? '사이다' : '쭈니'}를 {likes[id] || 0}명의 사람이 좋아합니다.
      </div>
      <button className='like-button' onClick={handleLike}>
        {liked ? (
          <i className='fa-solid fa-heart' style={{ color: '#ff4255' }}></i>
        ) : (
          <i className='fa-solid fa-heart' style={{ color: '#ebebeb' }}></i>
        )}
      </button>
    </div>
  );
};

export default Card;
