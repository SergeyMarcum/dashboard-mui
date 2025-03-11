import api from "../../api/axios"; // Используем единый экземпляр axios

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
  } catch (error) {
    console.error("Ошибка авторизации", error);
    throw new Error("Ошибка авторизации");
  }
};

// Получение списка доступных доменов
export const fetchDomains = async (): Promise<Record<string, string>> => {
  try {
    const response = await api.get("/domain-list");
    return response.data;
  } catch (error) {
    console.error("Ошибка получения доменов", error);
    throw new Error("Ошибка получения доменов");
  }
};
