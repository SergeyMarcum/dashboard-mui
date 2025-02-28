import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true, // По умолчанию панель открыта
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
