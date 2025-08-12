import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_BASE;
const APPLICATION_ID = import.meta.env.VITE_APPLICATION_ID;

interface TokenData {
  exp: number;
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Application-Id": APPLICATION_ID,
  },
});

// Helper to check token expiration
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenData>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Token decoding failed:", error);
    return false;
  }
};

// Request interceptor - adds valid token to requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && isTokenValid(token)) {
    config.headers.set("Authorization", `Bearer ${token}`, true);
  }

  return config;
});

// Response interceptor - handles token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors and avoid retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      // If refresh token is invalid, clear storage and redirect
      if (!isTokenValid(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/"; // redirect to login page
        return Promise.reject(error);
      }

      try {
        // Refresh the tokens
        const response = await api.post("/api/v1/auth/refresh-token", {
          refreshToken,
        });

        // Store new tokens
        setAccessToken(response.data.data.accessToken);
        setRefreshToken(response.data.data.refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/"; // redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
