// src/lib/api.ts
import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

interface RefreshResponse {
  success: boolean;
  message: string;
  code: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 1) Create a dedicated axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2) Request interceptor: attach the access token
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

// 3) Response interceptor: on 401, call refresh and retry original request
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

        // persist new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // update header on the original request
        if (originalReq.headers) {
          originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        // retry it
        return axios(originalReq);
      } catch (refreshError) {
        // if refresh also fails, redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
