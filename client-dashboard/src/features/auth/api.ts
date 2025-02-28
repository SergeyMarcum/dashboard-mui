import { api } from "../../api/axios";

export const login = async (username: string, password: string) => {
  const response = await api.post("/login", {
    username,
    password,
    domain: "orenburg",
  });

  return response.data; // Должен вернуть { token: "JWT-токен", username: "user123" }
};
