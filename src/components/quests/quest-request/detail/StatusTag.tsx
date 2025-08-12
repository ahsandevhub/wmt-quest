import { Tag } from "antd";
import React from "react";
import type { QuestRequestStatusEnum } from "../../../../types/questRequestStatus";
import { QuestRequestStatus } from "../../../../types/questRequestStatus";

const STATUS_TAG_COLOR: Record<QuestRequestStatusEnum, string> = {
  [QuestRequestStatus.Pending]: "blue",
  [QuestRequestStatus.Approved]: "green",
  [QuestRequestStatus.Rejected]: "red",
};

export const StatusTag: React.FC<{
  status: QuestRequestStatusEnum;
  label: string;
}> = ({ status, label }) => <Tag color={STATUS_TAG_COLOR[status]}>{label}</Tag>;
