import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

const defaultAxios = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

export const authAxios = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  timeout: 20000,
});

authAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || error.code === "ECONNABORTED") {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }

    return Promise.reject(error);
  },
);

export default defaultAxios;
