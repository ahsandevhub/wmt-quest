export const QuestStatus = {
  All: "",
  Active: "true",
  Inactive: "false",
} as const;

export type QuestStatusEnum = (typeof QuestStatus)[keyof typeof QuestStatus];
