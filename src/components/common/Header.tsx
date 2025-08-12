import { Grid, Layout, message } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../hooks/useAuth";
import BreadcrumbsBar from "./header/BreadcrumbsBar";
import LanguageSwitcher from "./header/LanguageSwitcher";
import NotificationsBell from "./header/NotificationsBell";
import ProfileMenu from "./header/ProfileMenu";
import ToggleSidebarButton from "./header/ToggleSidebarButton";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const StyledHeader = styled(Header)`
  background: #ffffff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  border-bottom: 1px solid #0000000f;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Crumbs = styled(BreadcrumbsBar)`
  margin-left: 16px;
`;

type AppHeaderProps = { collapsed: boolean; onToggle: () => void };

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { t } = useTranslation("header");
  const isMobile = !screens.md;

  const handleLogout = useCallback(() => {
    logout();
    message.success(t("logout_success"));
  }, [logout, t]);

  const handleProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  return (
    <StyledHeader>
      <LeftGroup>
        <ToggleSidebarButton collapsed={collapsed} onToggle={onToggle} />
        <Crumbs isMobile={isMobile} />
      </LeftGroup>

      <RightGroup>
        {!isMobile && (
          <>
            <LanguageSwitcher />
            <NotificationsBell />
          </>
        )}
        <ProfileMenu onProfile={handleProfile} onLogout={handleLogout} />
      </RightGroup>
    </StyledHeader>
  );
};

export default AppHeader;
