// src/lib/api.ts
import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const APPLICATION_ID = "8eed2241-25c4-413b-8a40-c88ad258c62e";

interface RefreshResponse {
  success: boolean;
  message: string;
  code: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    Accept: "application/json",
    "Application-Id": APPLICATION_ID,
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalReq = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      err.response?.status === 401 &&
      !originalReq._retry &&
      originalReq.url !== "/api/v1/auth/refresh-token"
    ) {
      originalReq._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token stored");

        const { data } = await axios.post<RefreshResponse>(
          `${API_BASE}/api/v1/auth/refresh-token`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        if (originalReq.headers) {
          originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return api(originalReq);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
