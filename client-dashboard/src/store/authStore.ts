import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin } from "../features/auth/api";

// Интерфейс состояния авторизации
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, password: string, domain?: string) => Promise<void>;
  logout: () => void;
}
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      username: null,
      token: null,

      login: async (username, password, domain = "orenburg") => {
        try {
          const response = await apiLogin(username, password, domain);
          const token = response.token;
          const user = response.user?.login;

          if (!token || !user) {
            throw new Error("Ошибка аутентификации");
          }

          set({ isAuthenticated: true, username: user, token });

          // Сохраняем username и session_code в sessionStorage
          sessionStorage.setItem("username", user);
          sessionStorage.setItem("session_code", token); // Если session_code это token, сохраняем его
        } catch (error) {
          console.error("Ошибка авторизации", error);
        }
      },

      logout: () =>
        set({ isAuthenticated: false, username: null, token: null }),
    }),
    { name: "auth-storage" } // 👈 данные будут сохраняться в localStorage
  )
);
