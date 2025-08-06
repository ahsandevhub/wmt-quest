export const QuestType = {
  Common: 1,
  Welcome: 2,
  Tournament: 3,
} as const;

export type QuestTypeEnum = (typeof QuestType)[keyof typeof QuestType];

export const QuestTypeLabels: Record<QuestTypeEnum, string> = {
  [QuestType.Common]: "Common quest",
  [QuestType.Welcome]: "Welcome quest",
  [QuestType.Tournament]: "Tournament quest",
};

export const QUEST_LIST = [
  { id: 1, questType: QuestType.Common },
  { id: 2, questType: QuestType.Welcome },
  { id: 3, questType: QuestType.Tournament },
];
