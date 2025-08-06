import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  QuestRequestStatus,
  QuestRequestStatusLabels,
  type QuestRequestStatusEnum,
} from "../types/questRequestStatus";
import {
  QuestType,
  QuestTypeLabels,
  type QuestTypeEnum,
} from "../types/questType";

const { Search } = Input;
const { RangePicker } = DatePicker;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;
`;

const ToolbarItemsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  & > * {
    flex: 1;
    min-width: 0;
  }
`;

const ToolbarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  & > :last-child {
    flex: 1;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export default function QuestRequestSearchToolbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [local, setLocal] = useState<{
    keywords: string;
    status: QuestRequestStatusEnum | "";
    questType: QuestTypeEnum | "";
    submittedDateRange: [Dayjs, Dayjs] | null;
  }>({
    keywords: searchParams.get("keywords") || "",
    status: searchParams.get("status")
      ? (Number(searchParams.get("status")) as QuestRequestStatusEnum)
      : "",
    questType: searchParams.get("questType")
      ? (Number(searchParams.get("questType")) as QuestTypeEnum)
      : "",
    submittedDateRange: null,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (local.keywords) params.set("keywords", local.keywords);
    if (local.status !== "") params.set("status", String(local.status));
    if (local.questType !== "")
      params.set("questType", String(local.questType));
    if (local.submittedDateRange) {
      params.set("startDate", local.submittedDateRange[0].toISOString());
      params.set("endDate", local.submittedDateRange[1].toISOString());
    }
    setSearchParams(params);
  };

  const handleReset = () => {
    setLocal({
      keywords: "",
      status: "",
      questType: "",
      submittedDateRange: null,
    });
    setSearchParams({});
  };

  return (
    <Toolbar>
      <ToolbarItemsWrapper>
        {/* Keywords */}
        <ToolbarItem>
          <span>Keywords:</span>
          <Search
            placeholder="Search by Quest Title"
            value={local.keywords}
            onChange={(e) =>
              setLocal((l) => ({ ...l, keywords: e.target.value }))
            }
            onSearch={handleSearch}
            allowClear
          />
        </ToolbarItem>

        {/* Status */}
        <ToolbarItem>
          <span>Status:</span>
          <Select<QuestRequestStatusEnum | "">
            value={local.status}
            onChange={(v) =>
              setLocal((l) => ({ ...l, status: (v ?? "") as any }))
            }
            allowClear
          >
            <Select.Option value="">All Statuses</Select.Option>
            {Object.values(QuestRequestStatus).map((val) => (
              <Select.Option key={val} value={val}>
                {QuestRequestStatusLabels[val]}
              </Select.Option>
            ))}
          </Select>
        </ToolbarItem>

        {/* Quest Type */}
        <ToolbarItem>
          <span>Quest Type:</span>
          <Select<QuestTypeEnum | "">
            value={local.questType}
            onChange={(v) =>
              setLocal((l) => ({ ...l, questType: (v ?? "") as any }))
            }
            allowClear
          >
            <Select.Option value="">All Quests</Select.Option>
            {Object.values(QuestType).map((val) => (
              <Select.Option key={val} value={val}>
                {QuestTypeLabels[val]}
              </Select.Option>
            ))}
          </Select>
        </ToolbarItem>

        {/* Date Range */}
        <ToolbarItem>
          <span>Submitted Date:</span>
          <RangePicker
            value={local.submittedDateRange as any}
            onChange={(dates) =>
              setLocal((l) => ({
                ...l,
                submittedDateRange: dates as any,
              }))
            }
            allowClear
          />
        </ToolbarItem>
      </ToolbarItemsWrapper>

      <ButtonsWrapper>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
        <Button icon={<SyncOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </ButtonsWrapper>
    </Toolbar>
  );
}
