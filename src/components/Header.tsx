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
import { Avatar, Badge, Dropdown, Grid, Layout, message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../auth/useAuth";
import Breadcrumbs from "../components/Breadcrumbs"; // <-- Import Here

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
  const { t, i18n } = useTranslation("header");

  const isMobile = !screens.md;

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
    { label: t("language.english"), key: "en" },
    { label: t("language.bengali"), key: "bn" },
  ];

  const profileMenuItems: MenuProps["items"] = [
    {
      label: t("profile.my_profile"),
      key: "profile",
      icon: <ProfileOutlined />,
    },
    { type: "divider", key: "divider" },
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
          <MenuUnfoldOutlined onClick={onToggle} />
        ) : (
          <MenuFoldOutlined onClick={onToggle} />
        )}
        <div style={{ marginLeft: 16 }}>
          <Breadcrumbs /> {/* Use Component Here */}
        </div>
      </Left>
      <Right>
        {!isMobile && (
          <>
            <Dropdown
              menu={{
                items: languageMenuItems,
                onClick: handleLanguageChange,
              }}
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
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </Right>
    </StyledHeader>
  );
};

export default AppHeader;
