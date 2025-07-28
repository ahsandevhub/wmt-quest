// src/pages/QuestList.tsx
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React from "react";

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

const QuestList: React.FC = () => {
  // pagination state
  const totalItems = 85;
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size) setPageSize(size);
  };

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
    <div className="bg-gray-100 min-h-screen space-y-6">
      {/* Filter Section */}
      <div className="flex flex-wrap md:flex-row flex-col gap-6 items-center bg-white p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[300px] md:min-w-[500px]">
          <span className="font-medium text-gray-700">Keywords:</span>
          <Input
            placeholder="Search by Quest ID/Quest Title"
            suffix={<SearchOutlined />}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px] md:min-w-[250px]">
          <span className="font-medium text-gray-700">Status:</span>
          <Select defaultValue="Active" className="flex-1">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
          </Select>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />}>Reset</Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg overflow-hidden space-y-6">
        {/* Header */}
        <div className="mb-4">
          <Button type="primary" icon={<PlusOutlined />}>
            Add
          </Button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <Table<Quest>
            columns={columns}
            dataSource={staticQuests}
            rowKey="id"
            pagination={false}
            bordered
            scroll={{ x: "max-content" }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
          <div>Total {totalItems} items</div>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            onChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestList;
