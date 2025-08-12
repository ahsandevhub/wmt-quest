import { message } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { QuestDetailFormValues } from "../components/quests/quest-detail/QuestDetailForm";
import api from "../services/http";

export function useUpdateQuest(questId: number) {
  const { t } = useTranslation("quest_detail");
  const navigate = useNavigate();

  const handleUpdateQuest = useCallback(
    async (values: QuestDetailFormValues, newlyAddedUserIds: number[]) => {
      const payload = {
        title: values.title,
        description: values.description,
        status: values.status,
        point: Number(values.point),
        platform: values.platform ?? 0,
        accountRank: values.accountRank,
        requiredUploadEvidence: values.requiredUploadEvidence,
        requiredEnterLink: values.requiredEnterLink,
        allowSubmitMultiple: values.allowSubmitMultiple,
        expiryDate: values.expiryDate?.toISOString(),
        ...(newlyAddedUserIds.length ? { userIds: newlyAddedUserIds } : {}),
      };
      try {
        await api.put(`/api/v1/wmt/quest/${questId}`, payload);
        message.success(
          t("messages.questUpdated", "Quest updated successfully")
        );
        navigate(-1);
      } catch (e: any) {
        message.error(
          e?.response?.data?.message ||
            t("messages.updateFailed", "Failed to update quest")
        );
      }
    },
    [questId, t, navigate]
  );

  return { handleUpdateQuest };
}
