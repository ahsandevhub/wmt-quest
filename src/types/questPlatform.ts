export const QuestPlatform = {
  Other: 0,
  Facebook: 1,
  Instagram: 2,
  YouTube: 3,
  Telegram: 4,
  TikTok: 5,
  Twitter: 6,
  Discord: 7,
} as const;

export type QuestPlatformEnum =
  (typeof QuestPlatform)[keyof typeof QuestPlatform];

export const PlatformLabels: Record<QuestPlatformEnum, string> = {
  [QuestPlatform.Other]: "Other",
  [QuestPlatform.Facebook]: "Facebook",
  [QuestPlatform.Instagram]: "Instagram",
  [QuestPlatform.YouTube]: "YouTube",
  [QuestPlatform.Telegram]: "Telegram",
  [QuestPlatform.TikTok]: "TikTok",
  [QuestPlatform.Twitter]: "Twitter",
  [QuestPlatform.Discord]: "Discord",
};
