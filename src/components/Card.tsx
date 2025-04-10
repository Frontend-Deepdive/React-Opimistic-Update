import React, { useState, useEffect } from 'react';
import './Card.css';
import imgArr from '../constants/img.json';
import likeApi from '../apis/likeApi';
import { useMutation } from '@tanstack/react-query';
import useStore from '../stores/useStore';

interface CardProps {
  initialLikes: number; // 초기 좋아요 개수
  isError: boolean; // 해당 카드의 에러 여부
  id: string; // 카드의 ID (고유 식별자)
}

const Card: React.FC<CardProps> = ({ initialLikes, isError, id }) => {
  const { likes, incrementLikes, decrementLikes } = useStore(); // 좋아요 상태 관리 훅
  const [liked, setLiked] = useState(false); // 좋아요 개수 상태

  // 초기 좋아요 수에 따라 상태 업데이트
  useEffect(() => {
    if (!(id in likes)) {
      for (let i = 0; i < initialLikes; i++) incrementLikes(id); // 초기 좋아요 수만큼 증가
    }
  }, [id, initialLikes, incrementLikes, likes]);

  const mutation = useMutation({
    mutationFn: (like: boolean) => likeApi(like, isError), // 좋아요 API 호출

    // 뮤테이션 시작
    onMutate: async (newLike) => {
      console.log(`${id}: ${newLike ? '좋아요' : '취소'} 시도`);
      if (newLike) incrementLikes(id);
      else decrementLikes(id);
      setLiked(newLike); // 상태 업데이트
    },

    // 에러 발생 시 로직
    onError: (_err, newLike) => {
      console.error(`${id}: ${newLike ? '좋아요' : '취소'} 실패 → 롤백`);
      if (newLike) decrementLikes(id);
      else incrementLikes(id);
      setLiked(!newLike); // 롤백(토글)
    },

    onSuccess: (_data, newLike) => {
      // 뮤테이션 성공 시
      console.log(`${id}: ${newLike ? '좋아요 성공' : '좋아요 취소 성공'}`);
    },

    // 항상 호출 (현재는 별 의미없는 코드)
    onSettled: () => {
      console.log(`${id}: 쿼리 무효화`);
    },
  });

  // 좋아요 버튼 핸들러 함수
  const handleLike = () => {
    if (mutation.isPending) return; // 현재 좋아요 처리가 진행 중이면 뮤테이션을 무시
    const nextLiked = !liked; // 다음 좋아요 상태 결정 (토글)
    mutation.mutate(nextLiked); // 뮤테이션 쿼리 실행
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
      {/* 좋아요 버튼을 조건부 렌더링 및 업데이트 중일 때 disabled */}
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
