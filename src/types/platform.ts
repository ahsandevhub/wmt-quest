export const Platform = {
  Other: 0,
  Facebook: 1,
  Instagram: 2,
  YouTube: 3,
  Telegram: 4,
  TikTok: 5,
  Twitter: 6,
  Discord: 7,
} as const;

export type PlatformEnum = (typeof Platform)[keyof typeof Platform];

export const PlatformLabels: Record<PlatformEnum, string> = {
  [Platform.Other]: "Other",
  [Platform.Facebook]: "Facebook",
  [Platform.Instagram]: "Instagram",
  [Platform.YouTube]: "YouTube",
  [Platform.Telegram]: "Telegram",
  [Platform.TikTok]: "TikTok",
  [Platform.Twitter]: "Twitter",
  [Platform.Discord]: "Discord",
};
