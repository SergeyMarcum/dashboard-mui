import { create } from "zustand";
import api from "../app/api/axios";
import { AxiosError } from "axios"; // Импортируем тип AxiosError

// Интерфейс пользователя
export interface User {
  id: number;
  full_name: string | null;
  company: string | null;
  email: string | null;
  role_id: number;
  status_id: number | null;
  position: string | null;
  name: string;
  department: string | null;
  phone: string | null;
  domain: string | null;
}

interface UsersState {
  users: User[];
  departments: string[];
  isLoading: boolean;
  fetchUsers: (username: string, sessionCode: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  editUser: (userId: number, updatedData: Partial<User>) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  departments: [],
  isLoading: false,

  fetchUsers: async (username, sessionCode) => {
    set({ isLoading: true });
    try {
      console.log("Запрос на сервер...");

      // Выполняем запрос к API
      const response = await api.get("/users", {
        params: { username, session_code: sessionCode },
      });

      console.log("Ответ от сервера:", response);
      console.log("Ответ от сервера (data):", response.data);

      if (!response.data || response.data.length === 0) {
        console.log("Ответ пустой или не содержит пользователей");
      }

      const users = response.data.map((user: User) => ({
        ...user,
        full_name: user.full_name || "N/A",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        department: user.department || "N/A",
      }));

      console.log("Преобразованные данные пользователей:", users); // Логируем после обработки

      set({ users });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Ошибка загрузки пользователей (AxiosError):",
          error.response?.data || error.message
        );
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDepartments: async () => {
    try {
      const response = await api.get("/parameters");
      const departments = response.data.map(
        (param: { name: string }) => param.name
      );
      set({ departments });
    } catch (error) {
      console.error("Ошибка загрузки отделов:", error);
    }
  },

  editUser: async (userId, updatedData) => {
    try {
      await api.put("/edit-user", {
        userId,
        ...updatedData,
      });
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        ),
      }));
    } catch (error) {
      console.error("Ошибка редактирования пользователя:", error);
    }
  },
}));
