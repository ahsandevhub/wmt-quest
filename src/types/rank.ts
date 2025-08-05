export const Rank = {
  Silver: 1,
  Gold: 2,
  Diamond: 3,
} as const;

export type RankEnum = (typeof Rank)[keyof typeof Rank];

export const RankLabels: Record<RankEnum, string> = {
  [Rank.Silver]: "Silver",
  [Rank.Gold]: "Gold",
  [Rank.Diamond]: "Diamond",
};
