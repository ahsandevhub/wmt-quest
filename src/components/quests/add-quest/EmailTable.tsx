import { Button, Input, Table, Typography } from "antd";
import React from "react";
import styled from "styled-components";
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

type Props = {
  t: (key: string, vars?: any) => string;
  list: UserEmail[];
  filtered: UserEmail[];
  page: number;
  setPage: (p: number) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onRemove: (userId: number) => void;
};

const EmailTable: React.FC<Props> = ({
  t,
  list,
  filtered,
  page,
  setPage,
  searchTerm,
  setSearchTerm,
  onRemove,
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
        pagination={{ current: page, pageSize: 10, onChange: setPage }}
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
            render: (_, record) => (
              <Button
                type="link"
                danger
                onClick={() => onRemove(record.userId)}
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

export default EmailTable;
