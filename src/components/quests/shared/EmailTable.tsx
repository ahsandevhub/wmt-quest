import { Button, Input, Table, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { QUEST_FORM_PAGE_SIZE } from "../../../constants/form";
import type { UserEmail } from "../../../hooks/useEmailList";

const Shell = styled.div`
  border: 1px solid #0000000f;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
  margin-top: 12px;

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 6px 10px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;
const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 320px;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

export interface EmailTableProps {
  t: (key: string, vars?: any) => string;
  list: UserEmail[];
  filtered: UserEmail[];
  page: number;
  setPage: (p: number) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onRemove: (userId: number) => void;
  pageSize?: number;
}

const EmailTable: React.FC<EmailTableProps> = ({
  t,
  list,
  filtered,
  page,
  setPage,
  searchTerm,
  setSearchTerm,
  onRemove,
  pageSize = QUEST_FORM_PAGE_SIZE,
}) => {
  return (
    <Shell>
      <Toolbar>
        <Typography.Text>
          {t("table.totalEmails", { count: list.length })}
        </Typography.Text>

        <SearchBar>
          <Input.Search
            placeholder={t("table.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={() => setPage(1)}
            allowClear
          />
        </SearchBar>
      </Toolbar>

      <Table<UserEmail>
        dataSource={filtered}
        rowKey="userId"
        pagination={{ current: page, pageSize, onChange: setPage }}
        columns={[
          { title: t("table.columns.email"), dataIndex: "email", key: "email" },
          {
            title: t("table.columns.fullName"),
            dataIndex: "fullName",
            key: "fullName",
          },
          {
            key: "action",
            width: 100,
            align: "right" as const,
            render: (_, _record: UserEmail) => (
              <Button
                type="link"
                danger
                onClick={() => onRemove(_record.userId)}
              >
                {t("table.delete")}
              </Button>
            ),
          },
        ]}
      />
    </Shell>
  );
};

export default React.memo(EmailTable);
