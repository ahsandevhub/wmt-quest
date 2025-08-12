import { Layout } from "antd";
import styled from "styled-components";

const { Sider: AntdSider } = Layout;

export const SiderWrapper = styled(AntdSider)`
  height: 100vh !important;
  background: #fff;
  overflow: hidden;
  transition: width 0.2s;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
`;

export const DrawerBodyStyles = { padding: 0 } as const;
