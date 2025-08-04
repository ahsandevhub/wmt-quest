// src/layouts/MainLayout.tsx
import { Layout, Spin } from "antd";
import React, { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

// Styled wrappers
const RootLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

const InnerLayout = styled(Layout)`
  overflow: hidden;
`;

const StyledContent = styled(Content)`
  position: relative;
  padding: 24px;
  background: #f5f5f5;
  height: calc(100vh - 64px);
  overflow: auto;
`;

// Loader overlay for content loading state
const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 24px;
  border-radius: 8px;
  border: 1px solid #0000000f;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const MainLayout: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <RootLayout>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <InnerLayout>
        <AppHeader collapsed={collapsed} onToggle={toggle} />

        <StyledContent>
          {isLoading && (
            <LoaderOverlay>
              <Spin size="large" />
            </LoaderOverlay>
          )}
          <Outlet />
        </StyledContent>
      </InnerLayout>
    </RootLayout>
  );
};

export default MainLayout;
