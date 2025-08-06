export const QuestStatus = {
  All: "",
  Active: "true",
  Inactive: "false",
} as const;

export type QuestStatusEnum = (typeof QuestStatus)[keyof typeof QuestStatus];

export const QuestStatusLabels: Record<QuestStatusEnum, string> = {
  [QuestStatus.All]: "All Statuses",
  [QuestStatus.Active]: "Active",
  [QuestStatus.Inactive]: "Inactive",
};
