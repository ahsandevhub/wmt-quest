import { PlusOutlined } from "@ant-design/icons";
import { Button, Pagination, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
<<<<<<< HEAD:src/containers/quests/QuestRequestListContainer.tsx
import QuestRequestFilters from "../../components/quests/request/QuestRequestFilters";
import { QuestRequestStatusLabels } from "../../types/questRequestStatus";
import { QuestTypeLabels, type QuestTypeEnum } from "../../types/questType";
=======
import QuestRequestSearchToolbar from "../components/QuestRequestSearchToolbar";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
} from "../types/questRequestStatus";
import { QuestType, type QuestTypeEnum } from "../types/questType";
>>>>>>> 96ba1770cf821f161fafd983f790e6759aff38b6:src/pages/QuestRequestList.tsx

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TableContainer = styled.div`
  background: #ffffff;
  padding: 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const EllipsisText = styled.span`
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface QuestRequestListRow {
  id: number;
  code: string;
  challengeId: number;
  challengeCode: string;
  title: string;
  point: number | null;
  status: number;
  email: string;
  fullName: string;
  submittedDate: string;
  createdAt: string;
  questType: string;
}

export default function QuestRequestList() {
  const { t } = useTranslation("quest_request_list");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const QuestTypeLabels: Record<QuestTypeEnum, string> = {
    [QuestType.Common]: t("questType.common"),
    [QuestType.Welcome]: t("questType.welcome"),
    [QuestType.Tournament]: t("questType.tournament"),
  };

  const QuestRequestStatusLabels: Record<QuestRequestStatusEnum, string> = {
    [QuestRequestStatus.Pending]: t("questRequestStatus.pending"),
    [QuestRequestStatus.Approved]: t("questRequestStatus.approved"),
    [QuestRequestStatus.Rejected]: t("questRequestStatus.rejected"),
  };

  const { questRequests, totalItems, filters } = useLoaderData() as {
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

  const columns: ColumnsType<QuestRequestListRow> = [
    {
      title: t("columns.requestId"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("columns.questType"),
      dataIndex: "challengeId",
      key: "questType",
      render: (type: QuestTypeEnum) => QuestTypeLabels[type] ?? "—",
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
      render: (point: number) => point.toLocaleString(),
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
      render: (date: string) => dayjs(date).format("MM/DD/YYYY hh:mm:ss"),
    },
    {
      title: t("columns.updatedDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("MM/DD/YYYY hh:mm:ss"),
    },
    {
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        switch (status) {
          case 1:
            return <Tag color="blue">{QuestRequestStatusLabels[1]}</Tag>;
          case 2:
            return <Tag color="green">{QuestRequestStatusLabels[2]}</Tag>;
          case 3:
            return <Tag color="red">{QuestRequestStatusLabels[3]}</Tag>;
          default:
            return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: t("columns.actions"),
      key: "detail",
      align: "right",
      render: ({ id }) => (
        <Link to={`/quest/quest-requests/${id}`} style={{ color: "#1890ff" }}>
          {t("detail")}
        </Link>
      ),
    },
  ];

  return (
    <PageWrapper>
      <QuestRequestFilters />

      <TableContainer>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/quest/request/add")}
          >
            {t("addButton")}
          </Button>
        </div>

        <Table<QuestRequestListRow>
          columns={columns}
          dataSource={questRequests.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: t("locale.emptyText") }}
        />

        <PaginationContainer>
          <div>{t("totalItems", { count: totalItems })}</div>
          <Pagination
            current={filters.page}
            pageSize={filters.limit}
            total={totalItems}
            showSizeChanger
            onChange={(page, size) => {
              searchParams.set("page", String(page));
              if (size) searchParams.set("limit", String(size));
              setSearchParams(searchParams);
            }}
            pageSizeOptions={["10", "20", "50"]}
          />
        </PaginationContainer>
      </TableContainer>
    </PageWrapper>
  );
}
