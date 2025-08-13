import { Button, Form, Grid, Layout } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import TitleBarHeader from "../../components/common/layout/TitleBarHeader";
import AddNewQuestForm, {
  type AddNewQuestFormValues,
} from "../../components/quests/add-quest/AddNewQuestForm";
import { useCreateQuest } from "../../hooks/useCreateQuest.ts";
import { namespaces } from "../../i18n/namespaces.ts";
import { ContentWrapper, PageContainer } from "./AddNewQuestContainer.styles";

const { Content } = Layout;

const AddNewQuestContainer: React.FC = () => {
  const { t } = useTranslation(namespaces.addNewQuest);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [form] = Form.useForm<AddNewQuestFormValues>();
  const { handleCreateQuest } = useCreateQuest();

  return (
    <PageContainer>
      <TitleBarHeader
        title={isMobile ? "" : t("pageTitle")}
        actions={
          <Button type="primary" onClick={() => form.submit()}>
            {t("buttons.add")}
          </Button>
        }
      />
      <Content>
        <ContentWrapper>
          <AddNewQuestForm form={form} onSubmit={handleCreateQuest} />
        </ContentWrapper>
      </Content>
    </PageContainer>
  );
};

export default AddNewQuestContainer;
