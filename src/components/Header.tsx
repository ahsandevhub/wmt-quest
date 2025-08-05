import {
  BellOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Grid,
  Layout,
  message,
} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../auth/useAuth";

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

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-left: 24px;
    cursor: pointer;
  }
`;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const location = useLocation();
  const { t, i18n } = useTranslation("header");

  const isMobile = !screens.md;

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const formatted = (seg: string) =>
    seg
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const crumbs: { title: string }[] = [];

  if (!isMobile) {
    crumbs.push({
      title: pathSegments[0] ? formatted(pathSegments[0]) : t("home"),
    });
  }

  const secondOrLast = isMobile
    ? formatted(pathSegments[pathSegments.length - 1] || "")
    : pathSegments[1]
    ? formatted(pathSegments[1])
    : formatted(pathSegments[0] || "");

  crumbs.push({ title: secondOrLast });

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success(t("logout_success"));
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  const handleLanguageChange: MenuProps["onClick"] = ({ key }) => {
    i18n.changeLanguage(key).then(() => {
      message.success(t("language.changed_message"));
    });
  };

  const languageMenuItems: MenuProps["items"] = [
    { label: "English", key: "en" },
    { label: "বাংলা", key: "bn" },
  ];

  const profileMenuItems: MenuProps["items"] = [
    {
      label: t("profile.my_profile"),
      key: "profile",
      icon: <ProfileOutlined />,
    },
    {
      type: "divider",
      key: "divider",
    },
    {
      label: t("profile.logout_button"),
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <StyledHeader>
      <Left>
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 20 }} onClick={onToggle} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 20 }} onClick={onToggle} />
        )}

        <Breadcrumb style={{ marginLeft: 16 }} items={crumbs} />
      </Left>

      <Right>
        {!isMobile && (
          <>
            <Dropdown
              menu={{ items: languageMenuItems, onClick: handleLanguageChange }}
              placement="bottomRight"
              arrow
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <GlobalOutlined />
                <span style={{ marginLeft: 8 }}>
                  {i18n.language === "en"
                    ? t("language.english")
                    : t("language.bengali")}
                </span>
              </div>
            </Dropdown>

            <Badge>
              <BellOutlined className="border border-gray-300 p-2 rounded-lg" />
            </Badge>
          </>
        )}

        <Dropdown
          menu={{ items: profileMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          arrow
        >
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </Right>
    </StyledHeader>
  );
};

export default AppHeader;
