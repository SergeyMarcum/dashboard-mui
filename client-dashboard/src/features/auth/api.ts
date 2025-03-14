import api from "../../api/axios"; // Используем единый экземпляр axios
import axios from "axios"; // Импортируем axios для использования isAxiosError

// Авторизация пользователя
export const login = async (
  username: string,
  password: string,
  domain: string
) => {
  console.log("Отправляем запрос на сервер:", { username, password, domain });

  try {
    const response = await api.get("/login", {
      params: { username, password, domain },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error("Ошибка сети. Проверьте подключение к интернету.");
        throw new Error("Ошибка сети. Проверьте подключение.");
      }

      switch (error.response.status) {
        case 401:
          console.warn("Неверные учетные данные.");
          throw new Error("Неверный логин или пароль.");
        case 403:
          console.warn("Доступ запрещен.");
          throw new Error("У вас нет прав на выполнение данной операции.");
        default:
          console.error("Ошибка авторизации:", error);
          throw error; // Передаём оригинальный объект ошибки
      }
    }

    console.error("Неизвестная ошибка:", error);
    throw new Error("Неизвестная ошибка.");
  }
};

// Получение списка доступных доменов
export const fetchDomains = async (): Promise<Record<string, string>> => {
  try {
    const response = await api.get("/domain-list");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error("Ошибка сети. Проверьте подключение.");
        throw new Error("Ошибка сети. Проверьте подключение.");
      }

      console.error("Ошибка получения доменов:", error);
      throw error; // Передаём оригинальную ошибку
    }

    console.error("Неизвестная ошибка:", error);
    throw new Error("Неизвестная ошибка.");
  }
};
