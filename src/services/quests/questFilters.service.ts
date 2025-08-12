import { QuestStatusLabels } from "../../constants/labels";
import { QuestStatus, type QuestStatusEnum } from "../../types/questStatus";

export type QuestFilterValues = {
  keywords?: string;
  status?: QuestStatusEnum;
};

export const buildStatusOptions = () =>
  Object.values(QuestStatus).map((value) => ({
    value: value as QuestStatusEnum,
    label: QuestStatusLabels[value as QuestStatusEnum],
  }));

export const getInitialValuesFromSearchParams = (
  searchParams: URLSearchParams
): QuestFilterValues => {
  const keywords = searchParams.get("keywords") ?? "";
  const status =
    (searchParams.get("status") as QuestStatusEnum | null) ?? QuestStatus.All;

  return { keywords, status };
};

export const buildParamsFromValues = (
  values: QuestFilterValues
): Record<string, string> => {
  const params: Record<string, string> = {};
  const trimmed = (values.keywords ?? "").trim();

  if (trimmed) params.keywords = trimmed;
  if (values.status) params.status = values.status;

  return params;
};
