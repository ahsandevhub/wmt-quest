import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import {
  QUEST_REQUEST_STATUS_OPTIONS,
  QuestRequestStatusLabels,
} from "../types/questRequestStatus";
import {
  buildQuestTypeMap,
  QUEST_LIST,
  QUEST_TYPE_OPTIONS,
} from "../types/questType";

const { RangePicker } = DatePicker;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;
`;

const ToolbarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
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

interface QuestRequestRow {
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

// Build the questTypeMap
const questTypeMap = buildQuestTypeMap(QUEST_LIST);

export default function QuestRequest() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const loaderData = useLoaderData() as {
    data: Omit<QuestRequestRow, "questType">[];
    totalItems: number;
    filters: {
      page: number;
      limit: number;
      keywords: string;
      from: string | null;
      to: string | null;
    };
  };

  const { data, totalItems, filters } = loaderData;

  // Merge questType into each data row
  const dataWithQuestType: QuestRequestRow[] = data.map((item) => ({
    ...item,
    questType: questTypeMap[item.challengeId] || "",
  }));

  const columns: ColumnsType<QuestRequestRow> = [
    {
      title: "Request ID",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Quest Type",
      dataIndex: "questType",
      key: "questType",
      render: (type: string) => type || "-",
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
      render: (title: string) => (
        <Tooltip title={title}>
          <span
            style={{
              maxWidth: 120,
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            }}
          >
            {title}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Point",
      dataIndex: "point",
      key: "point",
      render: (point: number | null, row: QuestRequestRow) =>
        row.questType === "Common quest" && point != null
          ? point.toLocaleString()
          : "",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <Tooltip title={email}>
          <span
            style={{
              maxWidth: 140,
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => (
        <Tooltip title={fullName}>
          <span
            style={{
              maxWidth: 120,
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fullName}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      render: (d: string) => dayjs(d).format("MM/DD/YYYY HH:mm:ss"),
    },
    {
      title: "Updated Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => dayjs(d).format("MM/DD/YYYY HH:mm:ss"),
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
      <Toolbar>
        <ToolbarItem>
          <Input
            placeholder="Search by Request ID/Quest ID/Email/Quest Title"
            maxLength={50}
            value={searchParams.get("keywords") || ""}
            onChange={(e) => {
              searchParams.set("keywords", e.target.value);
              setSearchParams(searchParams);
            }}
            suffix={<SearchOutlined />}
            style={{ width: 260 }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Select
            value={searchParams.get("status") || ""}
            onChange={(val) => {
              searchParams.set("status", val);
              setSearchParams(searchParams);
            }}
            options={QUEST_REQUEST_STATUS_OPTIONS}
            style={{ width: 140 }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Select
            value={searchParams.get("questType") || ""}
            onChange={(val) => {
              searchParams.set("questType", val);
              setSearchParams(searchParams);
            }}
            options={[
              { value: "", label: "All Quests" },
              ...QUEST_TYPE_OPTIONS,
            ]}
            style={{ width: 180 }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <RangePicker
            value={
              searchParams.get("from") && searchParams.get("to")
                ? [
                    dayjs(searchParams.get("from")),
                    dayjs(searchParams.get("to")),
                  ]
                : undefined
            }
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                searchParams.set("from", dates[0].toISOString());
                searchParams.set("to", dates[1].toISOString());
              } else {
                searchParams.delete("from");
                searchParams.delete("to");
              }
              setSearchParams(searchParams);
            }}
          />
        </ToolbarItem>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => setSearchParams(searchParams)}
        >
          Search
        </Button>
        <Button icon={<SyncOutlined />} onClick={() => setSearchParams({})}>
          Reset
        </Button>
      </Toolbar>

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
          dataSource={dataWithQuestType.map((i) => ({ ...i, key: i.id }))}
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
