import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useQuestListNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleAddNew = useCallback(() => {
    navigate("/quest/quest-list/add-new-quest");
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

  return {
    searchParams,
    handleAddNew,
    handlePageChange,
  };
}
