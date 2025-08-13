// pages/QuestDetail.tsx
import { Button, Form, Layout } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import TitleBarHeader from "../../components/common/layout/TitleBarHeader";
import QuestDetailForm, {
  type QuestDetailFormValues,
} from "../../components/quests/quest-detail/QuestDetailForm";
import { useUpdateQuest } from "../../hooks/useUpdateQuest";
import { namespaces } from "../../i18n/namespaces";
import type { QuestDetail } from "../../types/questDetail";
import { ContentWrapper, PageContainer } from "./QuestDetailContainer.styles";

const { Content } = Layout;
// styles moved to QuestDetailContainer.styles.ts

const QuestDetailContainer: React.FC = () => {
  const questData = useLoaderData() as QuestDetail;
  const { t } = useTranslation(namespaces.questDetail);
  const [form] = Form.useForm<QuestDetailFormValues>();
  const { handleUpdateQuest } = useUpdateQuest(questData.id);

  return (
    <PageContainer>
      <TitleBarHeader
        title={t("pageTitle")}
        actions={
          <Button type="primary" onClick={() => form.submit()}>
            {t("buttons.update")}
          </Button>
        }
      />
      <Content>
        <ContentWrapper>
          <QuestDetailForm
            form={form}
            questData={questData}
            onSubmit={handleUpdateQuest}
          />
        </ContentWrapper>
      </Content>
    </PageContainer>
  );
};

export default QuestDetailContainer;
