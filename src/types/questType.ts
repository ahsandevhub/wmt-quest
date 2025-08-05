export const QuestType = {
  Common: "Common quest",
  Welcome: "Welcome quest",
  Tournament: "Tournament quest",
} as const;

export type QuestTypeEnum = (typeof QuestType)[keyof typeof QuestType];

export const QuestTypeLabels: Record<QuestTypeEnum, string> = {
  [QuestType.Common]: "Common quest",
  [QuestType.Welcome]: "Welcome quest",
  [QuestType.Tournament]: "Tournament quest",
};

export const QUEST_TYPE_OPTIONS = Object.values(QuestType).map((value) => ({
  label: QuestTypeLabels[value],
  value,
}));

export const QUEST_LIST = [
  { id: 1, questType: QuestType.Common },
  { id: 2, questType: QuestType.Welcome },
  { id: 3, questType: QuestType.Tournament },
];

// Utility function to build the questTypeMap
export function buildQuestTypeMap(
  questList: { id: number; questType: QuestTypeEnum }[]
): Record<number, QuestTypeEnum> {
  const questTypeMap: Record<number, QuestTypeEnum> = {};
  questList.forEach((q) => {
    questTypeMap[q.id] = q.questType;
  });
  return questTypeMap;
}
