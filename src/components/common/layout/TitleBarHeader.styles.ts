import { Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  margin-bottom: 1.5rem;
`;

export const BackLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledTitle = styled(Title)<{ $isMobile?: boolean }>`
  margin-bottom: 0 !important;
  && {
    font-size: ${(p) => (p.$isMobile ? "16px" : "20px")};
    line-height: ${(p) => (p.$isMobile ? 1.2 : 1.3)};
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
