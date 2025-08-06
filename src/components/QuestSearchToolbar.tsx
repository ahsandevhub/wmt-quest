import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  QuestStatus,
  QuestStatusLabels,
  type QuestStatusEnum,
} from "../types/questStatus";

const { Search } = Input;

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;

  /* phones */
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const ToolbarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
`;

const StyledSearch = styled(Search)`
  width: 410px;
`;

const StyledSelect = styled(Select)`
  width: 432px;
`;

export const QuestSearchToolbar: React.FC = () => {
  const { t } = useTranslation("quest_list");
  const [searchParams, setSearchParams] = useSearchParams();

  const [local, setLocal] = useState<{
    keywords: string;
    status: QuestStatusEnum;
  }>({
    keywords: searchParams.get("keywords") ?? "",
    status: (searchParams.get("status") as QuestStatusEnum) ?? QuestStatus.All,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (local.keywords) params.set("keywords", local.keywords);
    if (local.status) params.set("status", local.status);
    setSearchParams(params);
  };

  const handleReset = () => {
    setLocal({ keywords: "", status: "" });
    setSearchParams({});
  };

  return (
    <ToolbarContainer>
      <ToolbarItem>
        <span>{t("toolbar.search_box.label")}</span>
        <StyledSearch
          placeholder={t("toolbar.search_box.placeholderSearch")}
          value={local.keywords}
          onChange={(e) =>
            setLocal((l) => ({ ...l, keywords: e.target.value }))
          }
          onSearch={handleSearch}
          allowClear
          maxLength={50}
        />
      </ToolbarItem>

      <ToolbarItem>
        <span>{t("toolbar.status_filter.label")}</span>
        <StyledSelect<QuestStatusEnum>
          value={local.status}
          onChange={(v) =>
            setLocal((l) => ({
              ...l,
              status: (v ?? QuestStatus.All) as QuestStatusEnum,
            }))
          }
          allowClear
        >
          {Object.values(QuestStatus).map((val) => (
            <Select.Option key={val || "__all"} value={val}>
              {QuestStatusLabels[val]}
            </Select.Option>
          ))}
        </StyledSelect>
      </ToolbarItem>

      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        {t("toolbar.search_button")}
      </Button>
      <Button icon={<SyncOutlined />} onClick={handleReset}>
        {t("toolbar.reset_button")}
      </Button>
    </ToolbarContainer>
  );
};
