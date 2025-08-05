export const QuestRequestStatus = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
} as const;

export type QuestRequestStatusEnum =
  (typeof QuestRequestStatus)[keyof typeof QuestRequestStatus];

export const QuestRequestStatusLabels: Record<QuestRequestStatusEnum, string> =
  {
    [QuestRequestStatus.Pending]: "Pending",
    [QuestRequestStatus.Approved]: "Approved",
    [QuestRequestStatus.Rejected]: "Rejected",
  };

export const QUEST_REQUEST_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...Object.values(QuestRequestStatus).map((value) => ({
    value: String(value),
    label: QuestRequestStatusLabels[value as QuestRequestStatusEnum],
  })),
];
