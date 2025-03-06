import { create } from "zustand";
import { login as apiLogin } from "../features/auth/api";

// Интерфейс состояния авторизации
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (
    username: string,
    password: string,
    domain?: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
}

// Функция для получения данных из sessionStorage или localStorage
const getSessionData = () => {
  return {
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    username: sessionStorage.getItem("username"),
    token: sessionStorage.getItem("token"),
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getSessionData(), // Загружаем сохраненные данные

  login: async (
    username,
    password,
    domain = "orenburg",
    rememberMe = false
  ) => {
    try {
      const response = await apiLogin(username, password, domain);

      // Проверяем структуру ответа сервера
      console.log("Ответ от сервера:", response);

      const token = response.token;
      const user = response.user?.login; // Используем `user.login` из ответа сервера

      if (!token || !user) {
        throw new Error("Не получены данные для авторизации");
      }

      // В зависимости от "Запомнить меня" сохраняем в localStorage или sessionStorage
      if (rememberMe) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", user);
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("username", user);
        sessionStorage.setItem("token", token);
      }

      set({
        isAuthenticated: true,
        username: user,
        token,
      });

      console.log("Успешный вход:", { user, token });
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  },

  logout: () => {
    // Очистка sessionStorage и localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");

    set({
      isAuthenticated: false,
      username: null,
      token: null,
    });
  },
}));
