import { useState } from "react";
import { Navigate } from "react-router-dom";
import NotFound from "../../containers/NotFound";
import { useAuth } from "../../hooks/useAuth";
import AppHeader from "../common/layout/Header";
import Sidebar from "../common/layout/Sidebar";
import { LoadingWrapper } from "./ProtectedRoute.styles";

// Import the layout styles from MainLayout
import { Spin } from "antd";
import {
  InnerLayout,
  RootLayout,
  StyledContent,
} from "../../layouts/MainLayout.styles";

/**
 * ConditionalNotFound - Shows 404 page for authenticated users,
 * redirects unauthenticated users to login page
 */
const ConditionalNotFound = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  // Show nothing while checking authentication
  if (isInitializing) {
    return (
      <LoadingWrapper>
        <Spin size="large" />
      </LoadingWrapper>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, show 404 page within the main layout structure
  return (
    <RootLayout>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <InnerLayout>
        <AppHeader collapsed={collapsed} onToggle={toggle} />
        <StyledContent>
          <NotFound />
        </StyledContent>
      </InnerLayout>
    </RootLayout>
  );
};

export default ConditionalNotFound;
