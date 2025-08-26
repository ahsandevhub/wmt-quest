import { Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

/**
 * PublicRoute - For routes that should only be accessible when NOT authenticated
 * (like login page). If user is authenticated, redirect to the main app.
 */
export default function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <LoadingWrapper>
        <Spin size="large" />
      </LoadingWrapper>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/quest/quest-list" replace />;
  }

  return <Outlet />;
}
