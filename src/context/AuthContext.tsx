import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/http";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/storage";

interface TokenData {
  exp: number;
}

export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper to validate token
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<TokenData>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const token = getAccessToken();
    if (isTokenValid(token)) {
      setAccessTokenState(token);
    } else {
      // Clear invalid tokens
      removeAccessToken();
      removeRefreshToken();
    }
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/v1/auth/login", {
        username,
        password,
      });
      const { accessToken, refreshToken } = response.data.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setAccessTokenState(accessToken);
    } catch (unknownError: any) {
      const message = unknownError?.response?.data?.message ?? "Login failed";
      setError(message);
      throw unknownError;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
    setAccessTokenState(null);
    navigate("/", { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken: accessTokenState,
      isAuthenticated: !!accessTokenState && isTokenValid(accessTokenState),
      isInitializing,
      login,
      logout,
      loading,
      error,
    }),
    [accessTokenState, isInitializing, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  return context;
}

export default AuthProvider;
