import { GiftOutlined, TagOutlined, TrophyOutlined } from "@ant-design/icons";
import { Drawer, Grid, Layout, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import WmtIcon from "../assets/WeMasterTrade-icon.png";
import WmtLogo from "../assets/WeMasterTrade-logo.png";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Logo = styled.div`
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    key: "quests",
    icon: <TrophyOutlined />,
    title: "Quests",
    items: [
      { key: "quest-list", label: "Quests List", path: "/quests" },
      {
        key: "welcome-quests",
        label: "Welcome Quests",
        path: "/quests/welcome",
      },
      { key: "quest-requests", label: "Quest Requests", path: "/requests" },
      { key: "redeem", label: "Redeem", path: "/quests/redeem" },
      {
        key: "quest-config",
        label: "Configuration",
        path: "/quests/configuration",
      },
      {
        key: "tournament-quests",
        label: "Tournament Quests",
        path: "/quests/tournament",
      },
    ],
  },
  {
    key: "discount",
    icon: <TagOutlined />,
    title: "Discount Code",
    items: [
      { key: "discount-main", label: "Discount Code", path: "/discount" },
      { key: "ap-discount", label: "AP Discount Code", path: "/discount/ap" },
      {
        key: "discount-config",
        label: "Configuration",
        path: "/discount/configuration",
      },
    ],
  },
  {
    key: "blindbox",
    icon: <GiftOutlined />,
    title: "Blind Box",
    items: [
      { key: "box-list", label: "Box List", path: "/blindbox" },
      {
        key: "secret-config",
        label: "Secret Configuration",
        path: "/blindbox/secret",
      },
      {
        key: "probability",
        label: "Probability",
        path: "/blindbox/probability",
      },
      {
        key: "spin-config",
        label: "Spin Configuration",
        path: "/blindbox/spin",
      },
      { key: "rewards", label: "Rewards", path: "/blindbox/rewards" },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const current = location.pathname;
  const defaultOpenKeys = navItems
    .filter((nav) => current.startsWith(`/${nav.key}`))
    .map((nav) => nav.key);

  let selectedKey = "";
  navItems.forEach((nav) =>
    nav.items.forEach((item) => {
      if (
        current === item.path ||
        (nav.key === "quests" &&
          current.startsWith("/quests/") &&
          current.endsWith("/edit"))
      ) {
        selectedKey = item.key;
      }
    })
  );

  const menuContent = (
    <>
      <Logo>
        <a href="/">
          <img
            src={isMobile ? WmtLogo : collapsed ? WmtIcon : WmtLogo}
            alt="WeMasterTrade"
          />
        </a>
      </Logo>

      <Menu
        mode="inline"
        theme="light"
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[selectedKey]}
        style={{ borderRight: 0 }}
        onClick={() => {
          if (isMobile) onToggle();
        }}
      >
        {navItems.map((nav) => (
          <Menu.SubMenu key={nav.key} icon={nav.icon} title={nav.title}>
            {nav.items.map((item) => (
              <Menu.Item key={item.key}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        open={collapsed}
        onClose={onToggle}
        maskClosable={true}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: "none" }}
        width={250}
      >
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={80}
      width={210}
      style={{
        height: "100vh",
        background: "#fff",
        overflow: "hidden",
        transition: "width 0.2s",
      }}
    >
      {menuContent}
    </Sider>
  );
};

export default Sidebar;
