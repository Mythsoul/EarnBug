import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  showVerifyModal: false,

  setUser: (user) => set({
    user: { 
      id: user.id,
      username: user.username,
      email: user.email, 
      verified: user.verified
    },
    isLoggedIn: true,
    isLoading: false, 
    showVerifyModal: false

  }),

  setLoading: (isLoading) => set({ isLoading }),
  setShowVerifyModal: (show) => set({ showVerifyModal: show }),
  resetAuth: () => set({
    user: null,
    isLoggedIn: false,
    isLoading: false
  }),

  updateVerification: (verified) => set((state) => ({
    user: state.user ? { ...state.user, verified } : null,
  }))
}));

export default useAuthStore;