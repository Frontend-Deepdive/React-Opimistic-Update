import { create } from 'zustand';

interface LikeState {
  likes: { [key: string]: number };
  incrementLikes: (id: string) => void;
  decrementLikes: (id: string) => void;
}

const useStore = create<LikeState>((set) => ({
  likes: {},
  incrementLikes: (id) =>
    set((state) => ({
      likes: {
        ...state.likes,
        [id]: (state.likes[id] || 0) + 1,
      },
    })),
  decrementLikes: (id) =>
    set((state) => ({
      likes: {
        ...state.likes,
        [id]: (state.likes[id] || 0) - 1,
      },
    })),
}));

export default useStore;
