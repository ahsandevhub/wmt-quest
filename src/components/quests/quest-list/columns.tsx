import { Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TFunction } from "i18next";
import { getPlatformLabel } from "../../../constants/labels";
import { type QuestListRow } from "../../../types/questList";
import { formatDate } from "../../../utils/format";
import { DetailLink, EllipsisText } from "./ListWrappers";

export const buildQuestColumns = (t: TFunction): ColumnsType<QuestListRow> => [
  {
    title: t("columns.questId"),
    dataIndex: "challengeCode",
    key: "challengeCode",
  },
  {
    title: t("columns.questTitle"),
    dataIndex: "title",
    key: "title",
    width: 250,
    ellipsis: { showTitle: false },
    render: (title: string) => (
      <Tooltip title={title}>
        <EllipsisText>{title}</EllipsisText>
      </Tooltip>
    ),
  },
  {
    title: t("columns.platform"),
    dataIndex: "platform",
    key: "platform",
    width: 200,
    render: (platform) => getPlatformLabel(platform, t) ?? "—",
  },
  {
    title: t("columns.point"),
    dataIndex: "point",
    key: "point",
    width: 200,
    render: (point: number) => point.toLocaleString(),
  },
  {
    title: t("columns.expiryDate"),
    dataIndex: "expiryDate",
    key: "expiryDate",
    render: (expiryDate: string | null) =>
      expiryDate ? formatDate(expiryDate) : "—",
  },
  {
    title: t("columns.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt: string) => formatDate(createdAt),
  },
  {
    title: t("columns.status"),
    dataIndex: "status",
    key: "status",
    render: (status: boolean) =>
      status ? (
        <Tag color="green">{t("status.active")}</Tag>
      ) : (
        <Tag color="red">{t("status.inactive")}</Tag>
      ),
  },
  {
    title: t("columns.actions"),
    key: "detail",
    align: "right",
    render: (quest: QuestListRow) => (
      <DetailLink to={`/quest/quest-list/${quest.id}`}>
        {t("detail")}
      </DetailLink>
    ),
  },
];
