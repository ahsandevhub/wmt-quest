import { Descriptions } from "antd";
import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #0000000f;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    padding: 1rem 1rem 1.25rem;
  }
`;

export const DescriptionsWrappper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 48px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const InfoColumn = styled(Descriptions)`
  flex: 1;
  min-width: 360px;
  .ant-descriptions-item-label {
    font-weight: 600;
    width: 250px;
    color: #000000d9;
  }
  /* Mobile: stack label above value */
  @media (max-width: 576px) {
    .ant-descriptions-item-container {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    .ant-descriptions-item-label {
      width: 100%; /* take full width so value drops below */
    }
  }
`;
