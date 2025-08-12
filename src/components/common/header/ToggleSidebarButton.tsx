import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = { collapsed: boolean; onToggle: () => void };

function ToggleSidebarButton({ collapsed, onToggle }: Props) {
  const { t } = useTranslation("header");
  return (
    <Button
      type="text"
      aria-label={
        collapsed ? t("actions.expand_sidebar") : t("actions.collapse_sidebar")
      }
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={onToggle}
      style={{ height: 32, width: 32, padding: 0 }}
    />
  );
}

export default React.memo(ToggleSidebarButton);
