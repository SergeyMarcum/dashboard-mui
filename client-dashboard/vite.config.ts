import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.248:8080",
        changeOrigin: true,
        secure: false, // Отключает проверку SSL, если сервер использует HTTP
        ws: true, // Включает поддержку WebSocket, если требуется
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/parameters": "http://192.168.1.248:8080",
    },
  },
});
