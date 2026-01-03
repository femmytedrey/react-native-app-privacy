import { create } from "zustand";

interface AuthStoreType {
  isAuthenticating: boolean;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  isAuthenticating: false,
  setIsAuthenticating: (isAuthenticating: boolean) => set({ isAuthenticating }),
}));
