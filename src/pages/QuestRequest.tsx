import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Pagination, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

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
  challengeCode: string;
  title: string;
  point: number;
  status: number;
  email: string;
  fullName: string;
  submittedDate: string;
  createdAt: string;
}

export default function QuestRequest() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const loaderData = useLoaderData() as {
    data: QuestRequestRow[];
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

  const columns = [
    { title: "Request ID", dataIndex: "code", key: "code" },
    { title: "Quest Type", key: "questType", render: () => "Common Quest" },
    { title: "Quest ID", dataIndex: "challengeCode", key: "challengeCode" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Point", dataIndex: "point", key: "point" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (e: string) => (
        <span title={e}>{e.length > 20 ? e.slice(0, 20) + "..." : e}</span>
      ),
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      render: (d: string) => dayjs(d).format("MMM DD, YYYY, HH:mm:ss"),
    },
    {
      title: "Updated Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => dayjs(d).format("MMM DD, YYYY, HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: number) => {
        switch (s) {
          case 1:
            return <Tag color="blue">Pending</Tag>;
          case 2:
            return <Tag color="green">Approved</Tag>;
          case 3:
            return <Tag color="red">Rejected</Tag>;
          default:
            return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: "",
      key: "detail",
      render: (row: QuestRequestRow) => (
        <Button
          type="link"
          onClick={() => navigate(`/quest/request/${row.id}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Toolbar>
        <ToolbarItem>
          <span>Keywords:</span>
          <Input
            placeholder="Search by Quest Title"
            defaultValue={filters.keywords}
            onChange={(e) => {
              searchParams.set("keywords", e.target.value);
              setSearchParams(searchParams);
            }}
            suffix={<SearchOutlined />}
            style={{ width: 220 }}
          />
        </ToolbarItem>

        <ToolbarItem>
          <span>Submitted Date:</span>
          <RangePicker
            value={
              filters.from && filters.to
                ? [dayjs(filters.from), dayjs(filters.to)]
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
          dataSource={data.map((i) => ({ ...i, key: i.id }))}
          pagination={false}
          scroll={{ x: "max-content" }}
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
