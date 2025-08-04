import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api/axiosInstance";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/storage";
import { AuthContext } from "./authContext";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/v1/auth/login", {
        username,
        password,
      });
      const { accessToken: newAccessToken, refreshToken } = response.data.data;

      setAccessToken(newAccessToken);
      setRefreshToken(refreshToken);
      setAccessTokenState(newAccessToken);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAccessToken();
    removeRefreshToken();
    setAccessTokenState(null);
    navigate("/");
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setAccessTokenState(token);
    }
  }, []);

  const value = {
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
