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

// Считывание состояния авторизации из localStorage (если есть)
const storedAuthState = localStorage.getItem("isAuthenticated");

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: storedAuthState === "true", // Проверяем, если в localStorage true, значит авторизован
  login: async (username, password, domain = "orenburg", rememberMe) => {
    try {
      await apiLogin(username, password, domain);

      // Сохраняем в localStorage, если выбрано "запомнить"
      if (rememberMe) {
        localStorage.setItem("isAuthenticated", "true");
      } else {
        localStorage.setItem("isAuthenticated", "true");
      }

      set({ isAuthenticated: true });
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  },
  logout: () => {
    // Очистка localStorage при логауте
    localStorage.removeItem("isAuthenticated");
    set({ isAuthenticated: false });
  },
}));
