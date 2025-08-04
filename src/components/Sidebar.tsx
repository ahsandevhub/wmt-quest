import { GiftOutlined, TagOutlined, TrophyOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Drawer, Grid, Layout, Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import WmtIcon from "../assets/WeMasterTrade-icon.png";
import WmtLogo from "../assets/WeMasterTrade-logo.png";

const { Sider: AntdSider } = Layout;
const { useBreakpoint } = Grid;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const LogoWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  overflow: hidden;

  img {
    max-height: 26px;
    transition: all 0.2s ease;
  }
`;

const SiderWrapper = styled(AntdSider)`
  height: 100vh !important;
  background: #fff;
  overflow: hidden;
  transition: width 0.2s;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
`;

const StyledMenu = styled(Menu)`
  .ant-menu-submenu-title {
    color: rgba(0, 0, 0, 0.88) !important;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t } = useTranslation("sidebar");
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const currentPath = location.pathname;

  // Navigation Config using i18n translations
  const NavConfig = [
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
        { key: "discount-main", label: t("discount_main"), path: "/discount" },
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
        { key: "spin-config", label: t("spin_config"), path: "/blindbox/spin" },
        { key: "rewards", label: t("rewards"), path: "/blindbox/rewards" },
      ],
    },
  ];

  // Generate menu items
  const menuItems: MenuProps["items"] = NavConfig.map((nav) => ({
    key: nav.key,
    icon: nav.icon,
    label: nav.title,
    children: nav.items.map((item) => ({
      key: item.key,
      label: <Link to={item.path}>{item.label}</Link>,
    })),
  }));

  const defaultOpenKeys = NavConfig.map((nav) => nav.key);

  const selectedKey = (() => {
    for (const nav of NavConfig) {
      const match = nav.items.find((item) => item.path === currentPath);
      if (match) {
        return match.key;
      }
    }
    return ""; // no match → no highlight
  })();

  const logoSrc = isMobile ? WmtLogo : collapsed ? WmtIcon : WmtLogo;

  const menuContent = (
    <>
      <LogoWrapper>
        <Link to="/">
          <img src={logoSrc} alt="WeMasterTrade Logo" />
        </Link>
      </LogoWrapper>

      <StyledMenu
        mode="inline"
        theme="light"
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[selectedKey]}
        onClick={isMobile ? onToggle : undefined}
        items={menuItems}
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
        styles={{
          body: { padding: 0 },
        }}
        width={250}
      >
        {menuContent}
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
      {menuContent}
    </SiderWrapper>
  );
};

export default Sidebar;
