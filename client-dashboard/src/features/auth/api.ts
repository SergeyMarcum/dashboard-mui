import { createAPI } from "../../api/axios";

// Создаем экземпляр API
const api = createAPI();

// Функция для авторизации пользователя
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

    return response.data; // Возвращаем данные от сервера (например, токен)
  } catch (error) {
    console.error("Ошибка авторизации", error);
    throw new Error("Ошибка авторизации");
  }
};

// Функция для получения списка доступных доменов
export const fetchDomains = async (): Promise<Record<string, string>> => {
  try {
    const response = await api.get("/domain-list");
    return response.data; // Сервер должен возвращать объект { orenburg: "Инженерно-Технический центр", ... }
  } catch (error) {
    console.error("Ошибка получения доменов", error);
    throw new Error("Ошибка получения доменов");
  }
};
