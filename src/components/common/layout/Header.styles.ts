import { Layout } from "antd";
import styled from "styled-components";
import BreadcrumbsBar from "../header/BreadcrumbsBar";

export const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  border-bottom: 1px solid #0000000f;
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Crumbs = styled(BreadcrumbsBar)`
  margin-left: 16px;
`;
