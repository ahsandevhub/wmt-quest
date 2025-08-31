import { message } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { AddNewQuestFormValues } from "../components/quests/add-quest/AddNewQuestForm";
import { namespaces } from "../i18n/namespaces";
import api from "../services/http";
import { QuestPlatform } from "../types/questPlatform";

export function useCreateQuest() {
  const { t } = useTranslation(namespaces.addNewQuest);
  const navigate = useNavigate();

  const handleCreateQuest = useCallback(
    async (values: AddNewQuestFormValues, userIds: number[]) => {
      const payload = {
        title: values.title,
        description: values.description,
        status: values.status,
        point: Number(values.point),
        platform: values.platform ?? QuestPlatform.Other,
        accountRank: values.accountRank ?? [],
        requiredUploadEvidence: values.requiredUploadEvidence,
        requiredEnterLink: values.requiredEnterLink,
        allowSubmitMultiple: values.allowSubmitMultiple,
        expiryDate: values.expiryDate?.toISOString(),
        userIds,
      };

      try {
        const res = await api.post(
          `${import.meta.env.VITE_API_BASE}/api/v1/wmt/quest`,
          payload
        );
        if (res.data.success) {
          message.success(t("messages.questAdded"));
          const newQuestId = res.data.data?.id;
          navigate(
            newQuestId ? `/quest/edit/${newQuestId}` : "/quest/quest-list"
          );
        } else {
          throw new Error(res.data.message || "Failed to add quest");
        }
      } catch (e: any) {
        message.error(
          e?.response?.data?.message ||
            t(
              "validation.questAddFailed",
              "Failed to add quest. Please try again."
            )
        );
      }
    },
    [navigate, t]
  );

  return { handleCreateQuest };
}
