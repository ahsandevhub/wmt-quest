import { Table } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type QuestRequestListRow } from "../../../types/questRequestList";
import { buildQuestRequestColumns } from "./columns";

type QuestRequestTableProps = {
  rows: QuestRequestListRow[];
};

const QuestRequestTable: React.FC<QuestRequestTableProps> = ({ rows }) => {
  const { t } = useTranslation("quest_request_list");
  const columns = useMemo(() => buildQuestRequestColumns(t), [t]);
  const dataSource = useMemo(
    () => rows.map((r) => ({ ...r, key: r.id })),
    [rows]
  );

  return (
    <Table<QuestRequestListRow>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{ x: "max-content" }}
      locale={{ emptyText: t("locale.emptyText") }}
    />
  );
};

export default QuestRequestTable;
