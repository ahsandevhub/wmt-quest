import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface JWTPayload {
  exp: number;
}

function isTokenValid(token: string): boolean {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken") ?? "";

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
