// src/layouts/MainLayout.tsx
import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const StyledContent = styled(Content)`
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px - 48px);
`;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <Layout>
        <AppHeader collapsed={collapsed} onToggle={toggle} />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
