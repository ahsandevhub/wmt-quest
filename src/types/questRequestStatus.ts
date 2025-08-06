export const QuestRequestStatus = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
} as const;

export type QuestRequestStatusEnum =
  (typeof QuestRequestStatus)[keyof typeof QuestRequestStatus];
