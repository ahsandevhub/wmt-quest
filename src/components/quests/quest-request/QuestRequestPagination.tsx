import { Pagination } from "antd";
import React from "react";

type QuestRequestPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalLabel: string;
  onChange: (page: number, size?: number) => void;
};

const QuestRequestPagination: React.FC<QuestRequestPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  totalLabel,
  onChange,
}) => (
  <>
    <div>{totalLabel}</div>
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      total={totalItems}
      showSizeChanger
      onChange={onChange}
      pageSizeOptions={["10", "20", "50"]}
    />
  </>
);

export default QuestRequestPagination;
