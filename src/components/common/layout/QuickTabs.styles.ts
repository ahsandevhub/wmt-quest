import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const TabsWrapper = styled.div`
  background: #ffffff;
  padding: 10px 24px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #0000000f;

  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

export const StyledClose = styled(CloseOutlined)`
  font-size: 12px;
`;
