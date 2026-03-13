import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const authAxios = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Har bir so'rovga tokenni qo'shish
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 xatolikda tokenni yangilash
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post(`${baseURL}/auth/token/refresh/`, {
          refresh,
        });
        localStorage.setItem("access", res.data.access);
        return authAxios(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
