import { Descriptions } from "antd";
import type { PropsWithChildren } from "react";
import React from "react";
import styled from "styled-components";

export const SectionDescriptions = styled(Descriptions)`
  && {
    .ant-descriptions-item-label {
      font-weight: 600;
      color: #000000e0;
      width: 200px;
      padding-right: 8px;
    }
    .ant-descriptions-item-content {
      font-size: 14px;
      word-break: break-word;
      white-space: pre-wrap;
    }
    @media (max-width: 768px) {
      .ant-descriptions-item-label {
        width: 120px;
      }
    }
  }
`;

export const Section: React.FC<
  PropsWithChildren<{ style?: React.CSSProperties }>
> = ({ children, style }) => (
  <SectionDescriptions
    column={1}
    layout="horizontal"
    colon={false}
    style={style}
  >
    {children}
  </SectionDescriptions>
);
