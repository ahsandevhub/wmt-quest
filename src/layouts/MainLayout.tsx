// src/layouts/MainLayout.tsx
import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

// Styled wrappers with literal values
const RootLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

const InnerLayout = styled(Layout)`
  overflow: hidden;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: #f5f5f5;
  height: calc(100vh - 64px);
  overflow: auto;
`;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <RootLayout>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <InnerLayout>
        <AppHeader collapsed={collapsed} onToggle={toggle} />

        <StyledContent>
          <Outlet />
        </StyledContent>
      </InnerLayout>
    </RootLayout>
  );
};

export default MainLayout;
