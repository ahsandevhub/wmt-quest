import { PlusOutlined } from "@ant-design/icons";
import { Button, Pagination, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import QuestRequestSearchToolbar from "../components/QuestRequestSearchToolbar";
import { QuestRequestStatusLabels } from "../types/questRequestStatus";
import { QuestTypeLabels, type QuestTypeEnum } from "../types/questType";

// Styled Components
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
      title: "Request ID",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Quest Type",
      dataIndex: "challengeId",
      key: "questType",
      render: (questType: QuestTypeEnum) => QuestTypeLabels[questType] ?? "—",
    },
    {
      title: "Quest ID",
      dataIndex: "challengeCode",
      key: "challengeCode",
    },
    {
      title: "Quest Title",
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
      title: "Point",
      dataIndex: "point",
      key: "point",
      render: (point: number) => point.toLocaleString(), // Adds comma separators for thousands
    },
    {
      title: "Email",
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
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: { showTitle: false },
      render: (fullName: string) => (
        <Tooltip title={fullName}>
          <EllipsisText>{fullName}</EllipsisText>
        </Tooltip>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      render: (d: string) => dayjs(d).format("MM/DD/YYYY hh:mm:ss"),
    },
    {
      title: "Updated Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => dayjs(d).format("MM/DD/YYYY hh:mm:ss"),
    },
    {
      title: "Status",
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
      title: "",
      key: "detail",
      align: "right",
      render: (questRequest) => (
        <Link
          to={`/quest/quest-requests/${questRequest.id}`}
          style={{ color: "#1890ff" }}
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <PageWrapper>
      <QuestRequestSearchToolbar />

      <TableContainer>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/quest/request/add")}
          >
            Add
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={questRequests.map((i) => ({ ...i, key: i.id }))}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: "No results are matching with your filter criteria",
          }}
        />
        <PaginationContainer>
          <div>Total {totalItems} items</div>
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
