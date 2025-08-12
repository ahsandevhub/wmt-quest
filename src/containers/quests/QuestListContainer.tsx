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
import QuestFilters from "../../components/quests/list/QuestFilters";
import {
  PlatformLabels,
  type QuestPlatformEnum,
} from "../../types/questPlatform";

interface QuestRow {
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

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  /* phones */
  @media (max-width: 480px) {
    gap: 16px;
  }
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

const EllipsisText = styled.div`
  display: inline-block;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function QuestList() {
  const { t } = useTranslation("quest_list");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { quests, totalItems, filters } = useLoaderData() as {
    quests: QuestRow[];
    totalItems: number;
    filters: {
      page: number;
      limit: number;
      keywords: string;
      status: "" | "true" | "false";
    };
  };

  const columns: ColumnsType<QuestRow> = [
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
      render: (platform: QuestPlatformEnum) => PlatformLabels[platform] ?? "—",
    },
    {
      title: t("columns.point"),
      dataIndex: "point",
      key: "point",
      width: 200,
      render: (point: number) => point.toLocaleString(), // Adds comma separators for thousands
    },
    {
      title: t("columns.expiryDate"),
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (expiryDate) =>
        expiryDate ? dayjs(expiryDate).format("MM/DD/YYYY hh:mm:ss") : "—",
    },
    {
      title: t("columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("MM/DD/YYYY hh:mm:ss"),
    },
    {
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) =>
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
      render: (quest) => (
        <Link to={`/quest/quest-list/${quest.id}`} style={{ color: "#1890ff" }}>
          {t("detail")}
        </Link>
      ),
    },
  ];

  return (
    <PageWrapper>
      <QuestFilters />

      <TableContainer>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/quest/quest-list/add-new-quest")}
          >
            {t("add_button")}
          </Button>
        </div>

        <Table<QuestRow>
          columns={columns}
          dataSource={quests.map((q) => ({ ...q, key: q.id }))}
          pagination={false}
          scroll={{ x: "max-content" }}
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
