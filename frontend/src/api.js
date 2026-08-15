import axios from "axios";

const api = axios.create({
  baseURL: "http://13.203.85.168:8000/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(
    "access_token"
  );

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;
