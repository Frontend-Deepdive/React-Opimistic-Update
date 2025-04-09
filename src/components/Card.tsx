import React, { useState, useEffect } from 'react';
import './Card.css';
import imgArr from '../constants/img.json';
import likeApi from '../apis/likeApi';
import { useMutation } from '@tanstack/react-query';
import useStore from '../stores/useStore';

interface CardProps {
  initialLikes: number;
  isError: boolean;
  id: string;
}

const Card: React.FC<CardProps> = ({ initialLikes, isError, id }) => {
  const { likes, incrementLikes, decrementLikes } = useStore();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!(id in likes)) {
      for (let i = 0; i < initialLikes; i++) incrementLikes(id);
    }
  }, [id, initialLikes, incrementLikes, likes]);

  const mutation = useMutation({
    mutationFn: (like: boolean) => likeApi(like, isError),

    onMutate: async (newLike) => {
      console.log(`${id}: ${newLike ? '좋아요' : '취소'} 시도`);
      if (newLike) incrementLikes(id);
      else decrementLikes(id);
      setLiked(newLike);
    },

    onError: (_err, newLike) => {
      console.error(`${id}: ${newLike ? '좋아요' : '취소'} 실패 → 롤백`);
      if (newLike) decrementLikes(id);
      else incrementLikes(id);
      setLiked(!newLike);
    },

    onSuccess: (_data, newLike) => {
      console.log(`${id}: ${newLike ? '좋아요 성공' : '좋아요 취소 성공'}`);
    },

    onSettled: () => {
      console.log(`${id}: 쿼리 무효화`);
    },
  });

  const handleLike = () => {
    if (mutation.isPending) return;
    const nextLiked = !liked;
    mutation.mutate(nextLiked);
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
        {id === 'cider' ? '사이다' : '쭈니'}를 {likes[id] || 0}명이 좋아합니다.
      </div>
      <button className='like-button' onClick={handleLike} disabled={mutation.isPending}>
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
