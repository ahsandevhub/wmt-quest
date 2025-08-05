import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import { PlatformLabels, type PlatformEnum } from "../types/platform";
const { Search } = Input;

interface QuestRow {
  id: number;
  key: number;
  challengeCode: string;
  title: string;
  platform: PlatformEnum;
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
  gap: 12px;
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

const EllipsisText = styled.span`
  display: inline-block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuestIdLink = styled(Link)`
  color: inherit;
  &:hover {
    color: #1890ff;
  }
`;

export default function QuestList() {
  const { t } = useTranslation("quest_list");
  const navigate = useNavigate();
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
  const [searchParams, setSearchParams] = useSearchParams();

  // local “draft” state for filter
  const [local, setLocal] = useState({
    keywords: filters.keywords,
    status: filters.status,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (local.keywords) params.set("keywords", local.keywords);
    if (local.status) params.set("status", local.status);
    setSearchParams(params);
  };

  const handleReset = () => {
    setLocal({ keywords: "", status: "" });
    setSearchParams({}); // clears all
  };

  const columns: ColumnsType<QuestRow> = [
    {
      title: t("columns.questId"),
      dataIndex: "challengeCode",
      key: "challengeCode",
      render: (challengeCode: string, quest: QuestRow) => (
        <QuestIdLink to={`/quest/quest-list/${quest.id}`}>
          {challengeCode}
        </QuestIdLink>
      ),
    },
    {
      title: t("columns.questTitle"),
      dataIndex: "title",
      key: "title",
      width: 300,
      ellipsis: { showTitle: false },
      render: (title: string) => (
        <Tooltip placement="topLeft" title={title}>
          <EllipsisText>{title}</EllipsisText>
        </Tooltip>
      ),
    },
    {
      title: t("columns.platform"),
      dataIndex: "platform",
      key: "platform",
      render: (platform: PlatformEnum) => PlatformLabels[platform] ?? "—",
    },
    {
      title: t("columns.point"),
      dataIndex: "point",
      key: "point",
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
      <Toolbar>
        <ToolbarItem>
          <span>{t("toolbar.search_box.label")}</span>
          <Search
            placeholder={t("toolbar.search_box.placeholderSearch")}
            value={local.keywords}
            onChange={(e) =>
              setLocal((l) => ({ ...l, keywords: e.target.value }))
            }
            onSubmit={handleSearch}
            allowClear
            maxLength={50}
            style={{ width: 410 }}
          />
        </ToolbarItem>

        <ToolbarItem>
          <span>{t("toolbar.status_filter.label")}</span>
          <Select<"" | "true" | "false">
            value={local.status}
            onChange={(v) => setLocal((l) => ({ ...l, status: v ?? "" }))}
            allowClear
            style={{ width: 432 }}
          >
            <Select.Option value="">
              {t("toolbar.status_filter.all")}
            </Select.Option>
            <Select.Option value="true">
              {t("toolbar.status_filter.active")}
            </Select.Option>
            <Select.Option value="false">
              {t("toolbar.status_filter.inactive")}
            </Select.Option>
          </Select>
        </ToolbarItem>

        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          {t("toolbar.search_button")}
        </Button>
        <Button icon={<SyncOutlined />} onClick={handleReset}>
          {t("toolbar.reset_button")}
        </Button>
      </Toolbar>

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
