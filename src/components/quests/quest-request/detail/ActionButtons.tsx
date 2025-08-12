import { Button } from "antd";
import React from "react";
import styled from "styled-components";

interface Props {
  loadingAction: null | "approve" | "reject";
  onApprove(): void;
  onReject(): void;
  approveLabel: string;
  rejectLabel: string;
  show: boolean;
}

const ActionsWrap = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 768px) {
    width: 100%;
    button {
      flex: 1;
    }
  }
`;

export const ActionButtons: React.FC<Props> = ({
  loadingAction,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  show,
}) => {
  if (!show) return null;
  return (
    <ActionsWrap>
      <Button onClick={onReject} loading={loadingAction === "reject"}>
        {rejectLabel}
      </Button>
      <Button
        type="primary"
        onClick={onApprove}
        loading={loadingAction === "approve"}
      >
        {approveLabel}
      </Button>
    </ActionsWrap>
  );
};
