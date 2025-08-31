import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../i18n/namespaces";

type Props = { collapsed: boolean; onToggle: () => void };

function ToggleSidebarButton({ collapsed, onToggle }: Props) {
  const { t } = useTranslation(namespaces.header);
  return (
    <Button
      type="text"
      aria-label={
        collapsed ? t("actions.expandSidebar") : t("actions.collapseSidebar")
      }
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={onToggle}
      style={{ height: 32, width: 32, padding: 0 }}
    />
  );
}

export default ToggleSidebarButton;
