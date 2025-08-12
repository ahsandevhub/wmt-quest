import { Drawer, Grid } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import WmtIcon from "../../../assets/WeMasterTrade-icon.png";
import WmtLogo from "../../../assets/WeMasterTrade-logo.png";
import { namespaces } from "../../../i18n/namespaces";
import SidebarLogo from "../sidebar/SidebarLogo";
import SidebarMenu, { type NavSection } from "../sidebar/SidebarMenu";
import { buildSidebarSections } from "./Sidebar.sections";
import { DrawerBodyStyles, SiderWrapper } from "./Sidebar.styles";

const { useBreakpoint } = Grid;

type SidebarProps = { collapsed: boolean; onToggle: () => void };

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t } = useTranslation(namespaces.sidebar);
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const currentPath = location.pathname;

  // i18n-driven nav sections
  const sections: NavSection[] = useMemo(() => buildSidebarSections(t), [t]);

  const logoSrc = useMemo(
    () => (isMobile ? WmtLogo : collapsed ? WmtIcon : WmtLogo),
    [collapsed, isMobile]
  );

  const menu = (
    <>
      <SidebarLogo to="/" src={logoSrc} />
      <SidebarMenu
        sections={sections}
        currentPath={currentPath}
        onItemClick={isMobile ? onToggle : undefined}
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        open={collapsed}
        onClose={onToggle}
        maskClosable
        styles={{ body: DrawerBodyStyles }}
        width={250}
      >
        {menu}
      </Drawer>
    );
  }

  return (
    <SiderWrapper
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={80}
      width={210}
    >
      {menu}
    </SiderWrapper>
  );
};

export default Sidebar;
