import { Pagination } from "antd";
import React from "react";

type QuestPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalLabel: string;
  onChange: (page: number, size?: number) => void;
};

const QuestPagination: React.FC<QuestPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  totalLabel,
  onChange,
}) => {
  return (
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
};

export default QuestPagination;
