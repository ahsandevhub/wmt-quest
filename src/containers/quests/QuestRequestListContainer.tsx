import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";

import QuestRequestActionsBar from "../../components/quests/quest-request/QuestRequestActionsBar";
import QuestRequestFilters from "../../components/quests/quest-request/QuestRequestFilters";
import QuestRequestPagination from "../../components/quests/quest-request/QuestRequestPagination";
import QuestRequestTable from "../../components/quests/quest-request/QuestRequestTable";

import {
  ActionsBar,
  PageWrapper,
  PaginationBar,
  TableCard,
} from "../../components/quests/shared/ListWrappers";

import { namespaces } from "../../i18n/namespaces";
import {
  type QuestRequestListLoaderData,
  type QuestRequestListRow,
} from "../../types/questRequestList";

const QuestRequestListContainer: React.FC = () => {
  const { t } = useTranslation(namespaces.questRequestList);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { questRequests, totalItems, filters } =
    useLoaderData() as QuestRequestListLoaderData;

  const handleAddNew = useCallback(() => {
    navigate("/quest/request/add");
  }, [navigate]);

  const handlePageChange = useCallback(
    (page: number, size?: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(page));
      if (size) next.set("limit", String(size));
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  return (
    <PageWrapper>
      <QuestRequestFilters />

      <TableCard>
        <ActionsBar>
          <QuestRequestActionsBar
            addButtonText={t("addButton")}
            onAddNew={handleAddNew}
          />
        </ActionsBar>

        <QuestRequestTable rows={questRequests as QuestRequestListRow[]} />

        <PaginationBar>
          <QuestRequestPagination
            currentPage={filters.page}
            pageSize={filters.limit}
            totalItems={totalItems}
            totalLabel={t("totalItems", { count: totalItems })}
            onChange={handlePageChange}
          />
        </PaginationBar>
      </TableCard>
    </PageWrapper>
  );
};

export default QuestRequestListContainer;
