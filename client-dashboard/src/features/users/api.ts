import axios from "axios";

const API_BASE_URL = "http://192.168.1.248:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
