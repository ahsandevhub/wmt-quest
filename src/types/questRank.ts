export const Rank = {
  Silver: 1,
  Gold: 2,
  Diamond: 3,
} as const;

export type QuestRankEnum = (typeof Rank)[keyof typeof Rank];

export const QuestRankLabels: Record<QuestRankEnum, string> = {
  [Rank.Silver]: "Silver",
  [Rank.Gold]: "Gold",
  [Rank.Diamond]: "Diamond",
};
