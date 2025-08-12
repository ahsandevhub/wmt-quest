import { GiftOutlined, TagOutlined, TrophyOutlined } from "@ant-design/icons";
import { Drawer, Grid, Layout } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import WmtIcon from "../../assets/WeMasterTrade-icon.png";
import WmtLogo from "../../assets/WeMasterTrade-logo.png";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarMenu, { type NavSection } from "./sidebar/SidebarMenu";

const { Sider: AntdSider } = Layout;
const { useBreakpoint } = Grid;

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SiderWrapper = styled(AntdSider)`
  height: 100vh !important;
  background: #fff;
  overflow: hidden;
  transition: width 0.2s;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
`;

const DrawerBodyStyles = { padding: 0 } as const;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t } = useTranslation("sidebar");
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const currentPath = location.pathname;

  // i18n-driven nav sections
  const sections: NavSection[] = useMemo(
    () => [
      {
        key: "quests",
        icon: <TrophyOutlined />,
        title: t("quests"),
        items: [
          {
            key: "quest-list",
            label: t("quest_list"),
            path: "/quest/quest-list",
          },
          {
            key: "welcome-quests",
            label: t("welcome_quests"),
            path: "/quest/welcome",
          },
          {
            key: "quest-requests",
            label: t("quest_requests"),
            path: "/quest/quest-requests",
          },
          { key: "redeem", label: t("redeem"), path: "/quests/redeem" },
          {
            key: "quest-config",
            label: t("quest_config"),
            path: "/quests/configuration",
          },
          {
            key: "tournament-quests",
            label: t("tournament_quests"),
            path: "/quests/tournament",
          },
        ],
      },
      {
        key: "discount",
        icon: <TagOutlined />,
        title: t("discount"),
        items: [
          {
            key: "discount-main",
            label: t("discount_main"),
            path: "/discount",
          },
          { key: "ap-discount", label: t("ap_discount"), path: "/discount/ap" },
          {
            key: "discount-config",
            label: t("discount_config"),
            path: "/discount/configuration",
          },
        ],
      },
      {
        key: "blindbox",
        icon: <GiftOutlined />,
        title: t("blindbox"),
        items: [
          { key: "box-list", label: t("box_list"), path: "/blindbox" },
          {
            key: "secret-config",
            label: t("secret_config"),
            path: "/blindbox/secret",
          },
          {
            key: "probability",
            label: t("probability"),
            path: "/blindbox/probability",
          },
          {
            key: "spin-config",
            label: t("spin_config"),
            path: "/blindbox/spin",
          },
          { key: "rewards", label: t("rewards"), path: "/blindbox/rewards" },
        ],
      },
    ],
    [t]
  );

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
