import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  // Получаем статус авторизации из Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Если пользователь авторизован, рендерим дочерние компоненты
  // Если не авторизован, перенаправляем на страницу логина
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
