import type { QuestPlatformEnum } from "./questPlatform";
import type { QuestRankEnum } from "./questRank";

export interface QuestDetail {
  id: number;
  status: boolean;
  title: string;
  expiryDate?: string;
  platform?: QuestPlatformEnum;
  point: number;
  accountRank: QuestRankEnum[];
  requiredUploadEvidence: boolean;
  requiredEnterLink: boolean;
  allowSubmitMultiple: boolean;
  description: string;
  usersData: { userId: number }[];
}
