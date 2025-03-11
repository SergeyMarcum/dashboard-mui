import { create } from "zustand";
import api from "../api/axios"; // Import configured axios

// Export the User interface so it can be used in other files
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
  fetchUsers: (domain: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  editUser: (userId: number, updatedData: Partial<User>) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  departments: [],
  isLoading: false,
  fetchUsers: async (domain) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/users?domain=${domain}`);
      const users = response.data.map((user: User) => ({
        ...user,
        full_name: user.full_name || "N/A",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        department: user.department || "N/A",
      }));
      set({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
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
      console.error("Error fetching departments:", error);
    }
  },
  editUser: async (userId, updatedData) => {
    try {
      await api.put(`/edit-user`, {
        userId,
        ...updatedData,
      });
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        ),
      }));
    } catch (error) {
      console.error("Error editing user:", error);
    }
  },
}));
