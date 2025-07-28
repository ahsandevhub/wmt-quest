// src/components/Header.tsx
import {
  BellOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Breadcrumb, Grid, Layout } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const StyledHeader = styled(Header)`
  background: #ffffff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
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
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const location = useLocation();

  // Compute breadcrumb items
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || "";
  const formattedLast = lastSegment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return (
    <StyledHeader>
      <Left>
        {/* Sidebar toggle */}
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 20 }} onClick={onToggle} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 20 }} onClick={onToggle} />
        )}

        {/* Breadcrumb */}
        <Breadcrumb style={{ marginLeft: 16 }}>
          {!isMobile && (
            <Breadcrumb.Item>
              {pathSegments[0]?.charAt(0).toUpperCase() +
                pathSegments[0]?.slice(1) || "Home"}
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>
            {isMobile
              ? formattedLast
              : pathSegments[1]
              ? pathSegments[1]
                  .split("-")
                  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(" ")
              : formattedLast}
          </Breadcrumb.Item>
        </Breadcrumb>
      </Left>

      <Right>
        {/* On desktop/tablet: show language + notifications */}
        {!isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <GlobalOutlined />
              <span style={{ marginLeft: 8 }}>English</span>
            </div>
            <Badge>
              <BellOutlined className="border border-gray-300 p-2 rounded-lg" />
            </Badge>
          </>
        )}

        {/* Always show profile */}
        <Avatar icon={<UserOutlined />} />
      </Right>
    </StyledHeader>
  );
};

export default AppHeader;
