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

export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = getAccessToken();
    if (token) setAccessTokenState(token);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken: accessTokenState,
      isAuthenticated: !!accessTokenState,
      login,
      logout,
      loading,
      error,
    }),
    [accessTokenState, loading, error, login, logout]
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
