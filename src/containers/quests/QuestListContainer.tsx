import React from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";

import {
  ActionsBar,
  PageWrapper,
  PaginationBar,
  TableCard,
} from "../../components/quests/quest-list/ListWrappers";
import QuestActionsBar from "../../components/quests/quest-list/QuestActionsBar";
import QuestFilters from "../../components/quests/quest-list/QuestFilters";
import QuestPagination from "../../components/quests/quest-list/QuestPagination";
import QuestTable from "../../components/quests/quest-list/QuestTable";
import { namespaces } from "../../i18n/namespaces";
import {
  type QuestListLoaderData,
  type QuestListRow,
} from "../../types/questList";

import { useQuestListNavigation } from "../../hooks/useQuestListNavigation";

const QuestListContainer: React.FC = () => {
  const { t } = useTranslation(namespaces.questList);
  const { quests, totalItems, filters } =
    useLoaderData() as QuestListLoaderData;
  const { handleAddNew, handlePageChange } = useQuestListNavigation();

  return (
    <PageWrapper>
      <QuestFilters />

      <TableCard>
        <ActionsBar>
          <QuestActionsBar
            addButtonText={t("addButton")}
            onAddNew={handleAddNew}
          />
        </ActionsBar>

        <QuestTable rows={quests as QuestListRow[]} />

        <PaginationBar>
          <QuestPagination
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

export default QuestListContainer;
