import { create } from "zustand";
import api from "../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
  lastVisit: string;
  status: string;
}

interface UsersState {
  users: User[];
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const response = await api.get("/users"); // Токен автоматически добавится через axios interceptors
      set({ users: response.data });
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  },
}));
