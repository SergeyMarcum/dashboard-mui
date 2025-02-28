import { create } from "zustand";
import { login as loginAPI } from "../features/auth/api";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  //isAuthenticated: !!localStorage.getItem("token"), // Загружаем статус из localStorage
  isAuthenticated: false,
  user: null,
  login: async (username, password) => {
    try {
      const response = await loginAPI(username, password);
      if (response?.token) {
        set({ isAuthenticated: true, user: response.username });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token); // Сохраняем токен
        }
      }
    } catch (error) {
      console.error("Ошибка аутентификации", error);
    }
  },

  logout: () => {
    localStorage.removeItem("token"); // Удаляем токен
    set({ isAuthenticated: false, user: null });
  },
}));
