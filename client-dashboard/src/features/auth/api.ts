import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.248:8080";

// http://192.168.1.248:8080/login?username=frontend&password=!QAZxsw2!@3&domain=orenburg
export const login = async (
  username: string,
  password: string,
  domain: string
) => {
  console.log("Отправляем запрос на сервер:", { username, password, domain });

  const response = await axios.get(`${API_URL}/login`, {
    params: { username, password, domain },
  });

  return response.data;
};

export const fetchDomains = async (): Promise<Record<string, string>> => {
  const response = await axios.get(`${API_URL}/domain-list`);
  return response.data; // Сервер должен возвращать объект { orenburg: "Инженерно-Технический центр", ... }
};
