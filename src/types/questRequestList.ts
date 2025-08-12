import { type QuestRequestStatusEnum } from "../types/questRequestStatus";
import { type QuestTypeEnum } from "../types/questType";

export interface QuestRequestListRow {
  id: number;
  code: string;
  challengeId: number;
  challengeCode: string;
  title: string;
  point: number | null;
  status: QuestRequestStatusEnum; // 1|2|3
  email: string;
  fullName: string;
  submittedDate: string;
  createdAt: string;
  /** Quest type enum as returned by API (challengeType on detail) */
  challengeType: QuestTypeEnum;
}

export type QuestRequestListLoaderData = {
  questRequests: QuestRequestListRow[];
  totalItems: number;
  filters: {
    page: number;
    limit: number;
    keywords: string;
    from: string | null;
    to: string | null;
  };
};
