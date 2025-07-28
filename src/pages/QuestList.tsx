// src/pages/QuestList.tsx
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React from "react";
import styled from "styled-components";

export interface Quest {
  id: string;
  title: string;
  platform: string;
  point: number;
  expiryDate: string;
  createdAt: string;
  status: "Active" | "Inactive" | "Approved";
}

// — Static data matching your mockup —
const staticQuests: Quest[] = [
  {
    id: "C0000027",
    title: "Invite New Friends",
    platform: "Facebook",
    point: 1000,
    expiryDate: "-",
    createdAt: "Jun 26, 2025, 22:00:30",
    status: "Inactive",
  },
  {
    id: "C0000027",
    title: "Invite New Friends",
    platform: "Other",
    point: 1000,
    expiryDate: "-",
    createdAt: "Jun 26, 2025, 22:00:30",
    status: "Approved",
  },
  {
    id: "C0000027",
    title: "Invite New Friends",
    platform: "Instagram",
    point: 1000,
    expiryDate: "-",
    createdAt: "Jun 26, 2025, 22:00:30",
    status: "Active",
  },
  {
    id: "C0000027",
    title: "Invite New Friends",
    platform: "Other",
    point: 1000,
    expiryDate: "-",
    createdAt: "Jun 26, 2025, 22:00:30",
    status: "Active",
  },
];

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const FilterItem = styled.div<{ minW: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: ${({ minW }) => `${minW}px`};
`;

const TableContainer = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const HeaderbBar = styled.div`
  margin-bottom: 20px;
`;

const FooterBar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const QuestList: React.FC = () => {
  // pagination state
  const totalItems = 85;
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size) setPageSize(size);
  };

  // table columns
  const columns: ColumnsType<Quest> = [
    { title: "Quest ID", dataIndex: "id", key: "id" },
    { title: "Quest Title", dataIndex: "title", key: "title" },
    { title: "Platform", dataIndex: "platform", key: "platform" },
    { title: "Point", dataIndex: "point", key: "point" },
    { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Quest["status"]) => {
        let color = "blue";
        if (status === "Inactive") color = "red";
        if (status === "Approved") color = "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "",
      key: "detail",
      render: () => <a className="text-blue-600">Detail</a>,
    },
  ];

  return (
    <>
      {/* 🔎 Filter Bar */}
      <FilterBar>
        {/* Keywords field: about 300px wide */}
        <FilterItem minW={500}>
          <span className="font-medium text-gray-700">Keywords:</span>
          <Input
            placeholder="Search by Quest ID/Quest Title"
            suffix={<SearchOutlined />}
            className="flex-1"
          />
        </FilterItem>

        {/* Status field: about 200px wide */}
        <FilterItem minW={250}>
          <span className="font-medium text-gray-700">Status:</span>
          <Select defaultValue="Active" className="flex-1">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
          </Select>
        </FilterItem>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />}>Reset</Button>
        </div>
      </FilterBar>

      {/* ➕ Add Button + Table */}
      <TableContainer>
        <HeaderbBar className="mb-6">
          <Button type="primary" icon={<PlusOutlined />}>
            Add
          </Button>
        </HeaderbBar>

        <Table<Quest>
          columns={columns}
          dataSource={staticQuests}
          rowKey="id"
          pagination={false}
          bordered={true}
        />

        <FooterBar>
          <div className="me-4">Total {totalItems} items</div>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            onChange={onPageChange}
          />
        </FooterBar>
      </TableContainer>
    </>
  );
};

export default QuestList;
