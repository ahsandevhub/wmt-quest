import { type QuestPlatformEnum } from "../types/questPlatform";

export interface QuestListRow {
  id: number;
  key: number;
  challengeCode: string;
  title: string;
  platform: QuestPlatformEnum;
  point: number;
  expiryDate: string | null;
  createdAt: string;
  status: boolean;
}

export type QuestListLoaderData = {
  quests: QuestListRow[];
  totalItems: number;
  filters: {
    page: number;
    limit: number;
    keywords: string;
    status: "" | "true" | "false";
  };
};
