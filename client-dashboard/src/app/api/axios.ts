import axios from "axios";

// Получение базового URL из переменной окружения
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.248:8080";

// Глобальный экземпляр axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Передача Cookies
});

// Интерцептор для автоматического добавления токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
