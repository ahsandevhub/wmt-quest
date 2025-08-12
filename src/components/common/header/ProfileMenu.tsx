import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, type MenuProps } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = { onProfile: () => void; onLogout: () => void };

function ProfileMenu({ onProfile, onLogout }: Props) {
  const { t } = useTranslation("header");

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        label: t("profile.my_profile"),
        key: "profile",
        icon: <ProfileOutlined />,
      },
      { type: "divider" as const },
      {
        label: t("profile.logout_button"),
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
    [t]
  );

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") onProfile();
    if (key === "logout") onLogout();
  };

  return (
    <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
      <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
}

export default React.memo(ProfileMenu);
