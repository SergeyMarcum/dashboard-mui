import axios from "axios";

// Получение базового URL из переменной окружения
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.248:8080";

// Функция для создания экземпляра axios с предустановленным базовым URL
function createAPI() {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });
}

// Экспортируем функцию с именем createAPI
export { createAPI };
