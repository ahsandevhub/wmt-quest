import type { TFunction } from "i18next";

import { QuestPlatform, type QuestPlatformEnum } from "../types/questPlatform";
import { Rank, type QuestRankEnum } from "../types/questRank";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
} from "../types/questRequestStatus";
import { QuestStatus, type QuestStatusEnum } from "../types/questStatus";
import { QuestType, type QuestTypeEnum } from "../types/questType";

/* ====================== Shared ====================== */
type Option<T> = { value: T; label: string };

/* ====================== Platform ====================== */
export const getPlatformLabel = (
  value: QuestPlatformEnum | null | undefined,
  t: TFunction
): string => {
  if (value === null || value === undefined) return "—";
  return t(`labels:platform.${value}`);
};

export const getPlatformOptions = (t: TFunction): Option<QuestPlatformEnum>[] =>
  (Object.values(QuestPlatform) as QuestPlatformEnum[]).map((value) => ({
    value,
    label: getPlatformLabel(value, t),
  }));

/* ====================== Rank ====================== */
export const getRankLabel = (value: QuestRankEnum, t: TFunction): string =>
  t(`labels:rank.${value}`);

export const getRankOptions = (t: TFunction): Option<QuestRankEnum>[] =>
  (Object.values(Rank) as QuestRankEnum[]).map((value) => ({
    value,
    label: getRankLabel(value, t),
  }));

/* ====================== Quest Request Status ====================== */
export const getQuestRequestStatusLabel = (
  value: QuestRequestStatusEnum,
  t: TFunction
): string => t(`labels:toolbar.statusFilter.options.${value}`);

export const getQuestRequestStatusOptions = (
  t: TFunction
): Option<QuestRequestStatusEnum>[] =>
  (Object.values(QuestRequestStatus) as QuestRequestStatusEnum[]).map(
    (value) => ({
      value,
      label: getQuestRequestStatusLabel(value, t),
    })
  );

/* ====================== Quest Status (filter) ====================== */
export const getQuestStatusLabel = (
  value: QuestStatusEnum,
  t: TFunction
): string => t(`labels:toolbar.statusFilter.options.${value}`);

export const getQuestStatusOptions = (
  t: TFunction
): Option<QuestStatusEnum>[] =>
  (Object.values(QuestStatus) as QuestStatusEnum[]).map((value) => ({
    value,
    label: getQuestStatusLabel(value, t),
  }));

/* ====================== Quest Type ====================== */
// Runtime-safe lookup: if value is not a valid QuestType member return dash
const isQuestTypeValue = (v: unknown): v is QuestTypeEnum =>
  (Object.values(QuestType) as unknown[]).includes(v);

export const getQuestTypeLabel = (
  value: QuestTypeEnum | number | null | undefined,
  t: TFunction
): string => {
  if (value === null || value === undefined) return "-";
  if (!isQuestTypeValue(value)) return "-";
  return t(`labels:toolbar.questTypeFilter.options.${value}`);
};

export const getQuestTypeOptions = (t: TFunction): Option<QuestTypeEnum>[] =>
  (Object.values(QuestType) as QuestTypeEnum[]).map((value) => ({
    value,
    label: getQuestTypeLabel(value, t),
  }));
