import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchNotionData, increaseLike } from "../api/notion";
import { useState } from "react";

/**
 * Notion 데이터를 가져오고, 좋아요 기능을 낙관적 업데이트로 처리하는 커스텀 훅
 *
 * @returns {
 *   data: Notion에서 가져온 데이터,
 *   isLoading: 로딩 상태,
 *   error: 에러 상태,
 *   handleLike: 좋아요 처리 함수,
 *   optimisticLikes: 낙관적으로 반영된 좋아요 수,
 *   pendingLikeIds: 좋아요 처리 중인 ID 목록
 * }
 */
export const useNotionData = () => {
  //좋아요 수를 낙관적으로 반영하기 위한 상태 : {key: 콘텐츠 ID, value: 좋아요 수}
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, number>
  >({});
  //현재 좋아요 요청 중인 콘텐츠의 ID를 저장하는 Set
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(new Set());

  // Notion 데이터 가져오는 쿼리
  const { data, isLoading, error } = useQuery({
    queryKey: ["notionData"],
    queryFn: fetchNotionData,
  });

  // 좋아요 증가 요청을 처리하는 뮤테이션
  const mutation = useMutation<
    void, // 성공 시 반환값 없음
    unknown, // 에러 타입
    { id: string; currentLikes: number }, // 전달되는 매개변수
    { prevLikes: number } // onMutate에서 반환하여 context로 전달
  >({
    mutationFn: ({ id }) => increaseLike(id),

    /**
     * mutation 요청 직전에 호출되어 UI에 낙관적으로 좋아요 반영
     *
     * @param id - 좋아요 대상 콘텐츠 ID
     * @param currentLikes - 현재 좋아요 수
     * @returns 이전 좋아요 수 (롤백용)
     */
    onMutate: ({ id, currentLikes }) => {
      const prevLikes = optimisticLikes[id] ?? currentLikes;

      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: prevLikes + 1,
      }));

      setPendingLikeIds((prev) => new Set(prev).add(id));

      return { prevLikes };
    },

    // mutation 실패 시 낙관적으로 반영된 좋아요 수를 롤백
    onError: (_error, { id }, context) => {
      if (!id || !context) return;

      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: context.prevLikes,
      }));
    },

    // 성공/실패 관계없이 mutation 완료 후 pending ID 제거
    onSettled: (_data, _error, { id }) => {
      if (!id) return;

      setPendingLikeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    },
  });

  /**
   * 좋아요 버튼 클릭 시 호출되는 핸들러
   *
   * @param id - 좋아요 대상 콘텐츠 ID
   * @param currentLikes - 현재 좋아요 수
   */
  const handleLike = (id: string, currentLikes: number) => {
    mutation.mutate({ id, currentLikes });
  };

  return {
    data,
    isLoading,
    error,
    handleLike,
    optimisticLikes,
    pendingLikeIds,
  };
};
