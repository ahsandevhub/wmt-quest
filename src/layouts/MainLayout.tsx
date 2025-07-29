import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <Layout style={{ overflow: "hidden" }}>
        <AppHeader collapsed={collapsed} onToggle={toggle} />

        <Content
          style={{
            padding: 24,
            background: "#f5f5f5",
            height: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
