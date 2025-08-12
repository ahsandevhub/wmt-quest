import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../i18n/namespaces";
import { StyledClose, TabsWrapper } from "./QuickTabs.styles";

const QuickTabs: React.FC = () => {
  const { t } = useTranslation(namespaces.quickTabs);

  return (
    <TabsWrapper>
      <Button size="small" type="primary">
        {t("tabs.currentPage")} <StyledClose />
      </Button>
      <Button size="small">{t("tabs.otherPage")}</Button>
    </TabsWrapper>
  );
};

export default QuickTabs;
