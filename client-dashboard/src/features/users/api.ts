import api from "../../api/axios"; // Используем единый экземпляр axios

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
