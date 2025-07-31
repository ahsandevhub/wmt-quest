// src/pages/QuestList.tsx
import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

const APPLICATION_ID = "8eed2241-25c4-413b-8a40-c88ad258c62e";

const PLATFORM_LABELS: Record<number, string> = {
  0: "Other",
  1: "Facebook",
  2: "Instagram",
  3: "YouTube",
  4: "Telegram",
  5: "TikTok",
  6: "Twitter",
  7: "Discord",
};

interface QuestRow {
  key: string;
  challengeCode: string;
  title: string;
  platform: number;
  point: number;
  expiryDate: string | null;
  createdAt: string;
  status: boolean;
}

export default function QuestList() {
  const navigate = useNavigate();

  const [data, setData] = useState<QuestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // paging & filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Application-Id": APPLICATION_ID,
      };
      const payload = {
        page,
        limit,
        keywords: keyword || undefined,
        sortFields: [{ fieldName: "createdAt", order: "DESC" }],
        status: statusFilter,
      };

      const res = await api.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/wmt/quest/search`,
        payload,
        { headers }
      );

      const items = res.data.data as QuestRow[];
      setTotalItems(res.data.paging.totalItem);

      setData(
        items.map((i) => ({
          key: i.challengeCode,
          challengeCode: i.challengeCode,
          title: i.title,
          platform: i.platform,
          point: i.point,
          expiryDate: i.expiryDate,
          createdAt: i.createdAt,
          status: i.status,
        }))
      );
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load quests";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [page, limit, statusFilter]);

  const columns: ColumnsType<QuestRow> = [
    { title: "Quest ID", dataIndex: "challengeCode", key: "challengeCode" },
    { title: "Quest Title", dataIndex: "title", key: "title" },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (p) => PLATFORM_LABELS[p] ?? `#${p}`,
    },
    { title: "Point", dataIndex: "point", key: "point" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => dayjs(d).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) =>
        s ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "",
      key: "detail",
      align: "right",
      render: (quest) => (
        <Link to={`/quests/${quest.challengeCode}`} className="text-blue-600">
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-lg border border-gray-200">
        {/* Keywords */}
        <span className="whitespace-nowrap">Keywords:</span>
        <Input
          placeholder="Search by Quest ID/Quest Title"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          suffix={
            <span
              style={{
                display: "flex",
                alignItems: "center",
                height: "140%",
                borderLeft: "1px solid #d9d9d9",
                paddingLeft: 8,
                marginLeft: 8,
              }}
            >
              <SearchOutlined />
            </span>
          }
          style={{ width: 356 }}
        />

        {/* Status */}
        <span className="whitespace-nowrap">Status:</span>
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          allowClear
          placeholder="All"
          className="w-40"
          style={{ width: 356 }}
        >
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>

        {/* Actions */}
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={fetchQuests}
          className="flex-none"
        >
          Search
        </Button>
        <Button
          icon={<SyncOutlined />}
          onClick={() => {
            setKeyword("");
            setStatusFilter(undefined);
            setPage(1);
            fetchQuests();
          }}
          className="flex-none"
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/quests/add-new-quest")}
          >
            Add
          </Button>
        </div>
        <Table<QuestRow>
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          // bordered
          rowKey="key"
          className=""
          scroll={{ x: "max-content" }}
        />
        <div className="flex items-center justify-end mt-5 gap-4">
          <div>Total {totalItems} items</div>
          <Pagination
            current={page}
            pageSize={limit}
            total={totalItems}
            showSizeChanger
            onChange={(page, size) => {
              setPage(page);
              if (size) setLimit(size);
            }}
            pageSizeOptions={["10", "20", "50"]}
          />
        </div>
      </div>
    </div>
  );
}
