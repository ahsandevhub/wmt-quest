// src/layouts/MainLayout.tsx
import { Spin } from "antd";
import React, { useState } from "react";
import { Outlet, useMatches, useNavigation } from "react-router-dom";
import AppHeader from "../components/common/layout/Header";
import QuickTabs from "../components/common/layout/QuickTabs";
import Sidebar from "../components/common/layout/Sidebar";
import {
  InnerLayout,
  LoaderOverlay,
  RootLayout,
  StyledContent,
} from "./MainLayout.styles";

const MainLayout: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);

  const matches = useMatches();
  const showTabs = !!matches.find(
    (match) => (match.handle as any)?.showQuickTabs
  );

  return (
    <RootLayout>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <InnerLayout>
        <AppHeader collapsed={collapsed} onToggle={toggle} />
        {showTabs && <QuickTabs />}

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
