const likeApi = async (like: boolean, isError: boolean) => {
  if (isError) {
    await new Promise((res) => setTimeout(res, 3000));
    console.error('낙관적 업데이트 실패로 좋아요가 취소됩니다.');
    throw new Error('op');
  }

  await new Promise((res) => setTimeout(res, 300));
  return like;
};

export default likeApi;
