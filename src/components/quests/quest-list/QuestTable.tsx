import { Table } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../i18n/namespaces";
import { type QuestListRow } from "../../../types/questList";
import { buildQuestColumns } from "./columns";

type QuestTableProps = {
  rows: QuestListRow[];
};

const QuestTable: React.FC<QuestTableProps> = ({ rows }) => {
  const { t } = useTranslation(namespaces.questList);

  const columns = useMemo(() => buildQuestColumns(t), [t]);
  const dataSource = useMemo(
    () => rows.map((q) => ({ ...q, key: q.id })),
    [rows]
  );

  return (
    <Table<QuestListRow>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default QuestTable;
