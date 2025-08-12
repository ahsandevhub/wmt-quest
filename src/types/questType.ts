export const QuestType = {
  Common: 1,
  Welcome: 2,
  Tournament: 3,
} as const;

export type QuestTypeEnum = (typeof QuestType)[keyof typeof QuestType];
