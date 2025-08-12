export const Rank = {
  Silver: 1,
  Gold: 2,
  Diamond: 3,
} as const;

export type QuestRankEnum = (typeof Rank)[keyof typeof Rank];
