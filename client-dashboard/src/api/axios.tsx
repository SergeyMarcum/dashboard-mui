import axios from "axios";

const API_URL = "192.168.1.248:8080"; //"http://192.168.1.103:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // Убираем передачу кук
  // withCredentials: true, // Для работы с cookies, если требуется
});

// Добавляем токен в заголовки всех запросов
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
