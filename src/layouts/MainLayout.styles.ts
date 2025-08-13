import { Layout } from "antd";
import styled from "styled-components";

const { Content } = Layout;

export const RootLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

export const InnerLayout = styled(Layout)`
  overflow: hidden;
`;

export const StyledContent = styled(Content)`
  position: relative;
  padding: 24px;
  background: #f5f5f5;
  height: calc(100vh - 64px);
  overflow: auto;

  /* phones */
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 24px;
  border-radius: 8px;
  border: 1px solid #0000000f;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;
