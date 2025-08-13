import type { MenuProps } from "antd";

import { useMemo } from "react";
import { Link } from "react-router-dom";

import { StyledMenu } from "./SidebarMenu.styles";

export type NavItem = { key: string; label: string; path: string };
export type NavSection = {
  key: string;
  icon: React.ReactNode;
  title: string;
  items: NavItem[];
};

type SidebarMenuProps = {
  sections: NavSection[];
  currentPath: string;
  onItemClick?: () => void;
};

function SidebarMenu({ sections, currentPath, onItemClick }: SidebarMenuProps) {
  const items: MenuProps["items"] = useMemo(
    () =>
      sections.map((section) => ({
        key: section.key,
        icon: section.icon,
        label: section.title,
        children: section.items.map((item) => ({
          key: item.key,
          label: <Link to={item.path}>{item.label}</Link>,
        })),
      })),
    [sections]
  );

  const defaultOpenKeys = useMemo(() => sections.map((s) => s.key), [sections]);

  // highlight for exact path and nested paths (/quest/quest-list/:id)
  const selectedKey = useMemo(() => {
    for (const section of sections) {
      const match = section.items.find(
        (it) => currentPath === it.path || currentPath.startsWith(`${it.path}/`)
      );
      if (match) return match.key;
    }
    return "";
  }, [currentPath, sections]);

  return (
    <StyledMenu
      mode="inline"
      theme="light"
      defaultOpenKeys={defaultOpenKeys}
      selectedKeys={selectedKey ? [selectedKey] : []}
      onClick={onItemClick}
      items={items}
    />
  );
}

export default SidebarMenu;
