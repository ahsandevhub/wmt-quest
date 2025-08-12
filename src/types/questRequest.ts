import type { QuestPlatformEnum } from "./questPlatform";
import type { QuestRequestStatusEnum } from "./questRequestStatus";
import type { QuestTypeEnum } from "./questType";

/** Represents a single piece of evidence (e.g. an uploaded image). */
export interface Evidence {
  /** Original file name on upload */
  fileName: string;
  /** Public URL to view or download the file */
  fileUrl: string;
  /** MIME type (e.g. "image/png") */
  mimeType: string;
}

/**
 * Data shape for a quest point/request, as returned by:
 * GET /api/v1/wmt/point-request/:pointRequestId
 */
export interface QuestRequest {
  /** Internal database ID */
  id: number;
  /** ID of the user who made the request */
  userId: number;

  /** Formatted request code, e.g., "PR00006" */
  code: string;

  /** Numeric quest ID */
  challengeId: number;
  /** Formatted quest code, e.g., "C0000001" */
  challengeCode: string;

  /** Quest type (backend enum code) */
  challengeType: QuestTypeEnum;

  /** Quest title */
  title: string;

  /** Platform (backend enum code) */
  platform: QuestPlatformEnum;

  /** Quest description (HTML string) */
  description: string;

  /** Points awarded by this quest (nullable for some types) */
  point: number | null;

  /** Request status (backend enum code) */
  status: QuestRequestStatusEnum;

  /** Reason provided when rejecting */
  rejectedReason: string | null;

  /** Uploaded evidence files */
  evidence: Evidence[];

  /** Optional related link provided by the user */
  relatedLink: string | null;

  /** User’s email */
  email: string;
  /** User’s full name */
  fullName: string;

  /** ISO timestamp when submitted */
  submittedDate: string;
  /** ISO timestamp when this record was created */
  createdAt: string;
  /** ISO timestamp when last updated (only present if approved/rejected) */
  updatedAt: string | null;

  /** Username or ID of the actor who created this record */
  createdBy: string;
  /** Username or ID of the actor who last updated this record */
  updatedBy: string | null;
}
