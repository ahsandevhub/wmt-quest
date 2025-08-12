import { Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import {
  getQuestRequestStatusLabel,
  getQuestTypeLabel,
} from "../../../constants/labels";
import { type QuestRequestListRow } from "../../../types/questRequestList";
import { DetailLink, EllipsisText } from "../shared/ListWrappers";

export const buildQuestRequestColumns = (
  t: TFunction
): ColumnsType<QuestRequestListRow> => [
  {
    title: t("columns.requestId"),
    dataIndex: "code",
    key: "code",
  },
  {
    title: t("columns.questType"),
    dataIndex: "challengeId",
    key: "challengeType",
    render: (type) => getQuestTypeLabel(type, t) ?? "—",
  },
  {
    title: t("columns.questId"),
    dataIndex: "challengeCode",
    key: "challengeCode",
  },
  {
    title: t("columns.questTitle"),
    dataIndex: "title",
    key: "title",
    width: 150,
    ellipsis: { showTitle: false },
    render: (title: string) => (
      <Tooltip title={title}>
        <EllipsisText>{title}</EllipsisText>
      </Tooltip>
    ),
  },
  {
    title: t("columns.point"),
    dataIndex: "point",
    key: "point",
    render: (point: number | null) =>
      typeof point === "number" ? point.toLocaleString() : "—",
  },
  {
    title: t("columns.email"),
    dataIndex: "email",
    key: "email",
    width: 150,
    ellipsis: { showTitle: false },
    render: (email: string) => (
      <Tooltip title={email}>
        <EllipsisText>{email}</EllipsisText>
      </Tooltip>
    ),
  },
  {
    title: t("columns.fullName"),
    dataIndex: "fullName",
    key: "fullName",
    width: 150,
    ellipsis: { showTitle: false },
    render: (name: string) => (
      <Tooltip title={name}>
        <EllipsisText>{name}</EllipsisText>
      </Tooltip>
    ),
  },
  {
    title: t("columns.submittedDate"),
    dataIndex: "submittedDate",
    key: "submittedDate",
    render: (date: string) => dayjs(date).format("MM/DD/YYYY HH:mm:ss"),
  },
  {
    title: t("columns.updatedDate"),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => dayjs(date).format("MM/DD/YYYY HH:mm:ss"),
  },
  {
    title: t("columns.status"),
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const label = getQuestRequestStatusLabel(status, t);
      switch (status) {
        case 1:
          return <Tag color="blue">{label}</Tag>;
        case 2:
          return <Tag color="green">{label}</Tag>;
        case 3:
          return <Tag color="red">{label}</Tag>;
        default:
          return <Tag>{label ?? "Unknown"}</Tag>;
      }
    },
  },
  {
    title: t("columns.actions"),
    key: "detail",
    align: "right",
    render: ({ id }) => (
      <DetailLink to={`/quest/quest-requests/${id}`}>{t("detail")}</DetailLink>
    ),
  },
];
