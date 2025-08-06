import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
} from "../types/questRequestStatus";
import { QuestType, type QuestTypeEnum } from "../types/questType";

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
  const { t } = useTranslation("quest_request_list");
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
          <span>{t("toolbar.searchBox.label")}</span>
          <Search
            placeholder={t("toolbar.searchBox.placeholder")}
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
          <span>{t("toolbar.statusFilter.label")}</span>
          <Select<QuestRequestStatusEnum | "">
            value={local.status}
            onChange={(v) =>
              setLocal((l) => ({ ...l, status: (v ?? "") as any }))
            }
            allowClear
          >
            <Select.Option value="">
              {t("toolbar.statusFilter.all")}
            </Select.Option>
            {Object.values(QuestRequestStatus).map((val) => (
              <Select.Option key={val} value={val}>
                {QuestRequestStatusLabels[val]}
              </Select.Option>
            ))}
          </Select>
        </ToolbarItem>

        {/* Quest Type */}
        <ToolbarItem>
          <span>{t("toolbar.questTypeFilter.label")}</span>
          <Select<QuestTypeEnum | "">
            value={local.questType}
            onChange={(v) =>
              setLocal((l) => ({ ...l, questType: (v ?? "") as any }))
            }
            allowClear
          >
            <Select.Option value="">
              {t("toolbar.questTypeFilter.all")}
            </Select.Option>
            {Object.values(QuestType).map((val) => (
              <Select.Option key={val} value={val}>
                {QuestTypeLabels[val]}
              </Select.Option>
            ))}
          </Select>
        </ToolbarItem>

        {/* Date Range */}
        <ToolbarItem>
          <span>{t("toolbar.submittedDate.label")}</span>
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
          {t("toolbar.searchButton")}
        </Button>
        <Button icon={<SyncOutlined />} onClick={handleReset}>
          {t("toolbar.resetButton")}
        </Button>
      </ButtonsWrapper>
    </Toolbar>
  );
}
