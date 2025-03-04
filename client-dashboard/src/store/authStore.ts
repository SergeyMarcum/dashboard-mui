import { create } from "zustand";
import { login as apiLogin } from "../features/auth/api";

interface AuthState {
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
    domain?: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (username, password, domain = "orenburg", rememberMe) => {
    await apiLogin(username, password, domain); // domain всегда string

    // Сохраняем в локальное хранилище
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("rememberMe");
    set({ isAuthenticated: false });
  },
}));
