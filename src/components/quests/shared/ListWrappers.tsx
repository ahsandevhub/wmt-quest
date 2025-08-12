import { Link } from "react-router-dom";
import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

export const TableCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;
`;

export const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
`;

export const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

export const EllipsisText = styled.span`
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DetailLink = styled(Link)`
  color: #1890ff;
`;
