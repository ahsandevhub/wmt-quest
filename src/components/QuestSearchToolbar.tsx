import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { QuestStatus, type QuestStatusEnum } from "../types/questStatus";

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

  // Renamed from 'local' to 'filters'
  const [filters, setFilters] = useState<{
    keywords: string;
    status: QuestStatusEnum;
  }>({
    keywords: searchParams.get("keywords") ?? "",
    status: (searchParams.get("status") as QuestStatusEnum) ?? QuestStatus.All,
  });

  const statusLabels: Record<QuestStatusEnum, string> = {
    [QuestStatus.All]: t("toolbar.statusFilter.all"),
    [QuestStatus.Active]: t("toolbar.statusFilter.active"),
    [QuestStatus.Inactive]: t("toolbar.statusFilter.inactive"),
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.keywords) params.set("keywords", filters.keywords);
    if (filters.status) params.set("status", filters.status);
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({ keywords: "", status: QuestStatus.All });
    setSearchParams({});
  };

  return (
    <ToolbarContainer>
      <ToolbarItem>
        <span>{t("toolbar.searchBox.label")}</span>
        <StyledSearch
          placeholder={t("toolbar.searchBox.placeholder")}
          value={filters.keywords}
          onChange={(event) =>
            setFilters((previousFilters) => ({
              ...previousFilters,
              keywords: event.target.value,
            }))
          }
          onSearch={handleSearch}
          allowClear
          maxLength={50}
        />
      </ToolbarItem>

      <ToolbarItem>
        <span>{t("toolbar.statusFilter.label")}</span>
        <StyledSelect<QuestStatusEnum>
          value={filters.status}
          onChange={(selectedStatus) =>
            setFilters((previousFilters) => ({
              ...previousFilters,
              status: (selectedStatus ?? QuestStatus.All) as QuestStatusEnum,
            }))
          }
          allowClear
        >
          {Object.values(QuestStatus).map((statusValue) => (
            <Select.Option key={statusValue || "__all"} value={statusValue}>
              {statusLabels[statusValue]}
            </Select.Option>
          ))}
        </StyledSelect>
      </ToolbarItem>

      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        {t("toolbar.searchButton")}
      </Button>
      <Button icon={<SyncOutlined />} onClick={handleReset}>
        {t("toolbar.resetButton")}
      </Button>
    </ToolbarContainer>
  );
};
