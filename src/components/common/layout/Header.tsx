import { Grid, message } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { namespaces } from "../../../i18n/namespaces";
import LanguageSwitcher from "../header/LanguageSwitcher";
import NotificationsBell from "../header/NotificationsBell";
import ProfileMenu from "../header/ProfileMenu";
import ToggleSidebarButton from "../header/ToggleSidebarButton";
import { Crumbs, LeftGroup, RightGroup, StyledHeader } from "./Header.styles";

const { useBreakpoint } = Grid;

type AppHeaderProps = { collapsed: boolean; onToggle: () => void };

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { t } = useTranslation(namespaces.header);
  const isMobile = !screens.md;

  const handleLogout = useCallback(() => {
    logout();
    message.success(t("logoutSuccess"));
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
