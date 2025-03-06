import { createAPI } from "../../api/axios";

// Создаем экземпляр API
const api = createAPI();

// Пример функции получения списка пользователей
export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data; // Возвращаем список пользователей
};
