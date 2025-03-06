import { createAPI } from "../../api/axios";

// Создаем экземпляр API
const api = createAPI();

// Пример функции получения списка пользователей
export const fetchUsers = async () => {
  try {
    const response = await api.get("/users"); // Теперь запрос будет передавать куки
    return response.data; // Возвращаем список пользователей
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    throw error;
  }
};
