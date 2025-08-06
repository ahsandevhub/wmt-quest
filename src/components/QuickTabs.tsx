import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const TabsWrapper = styled.div`
  background: #ffffff;
  padding: 10px 24px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #0000000f;

  /* phones */
  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

const StyledClose = styled(CloseOutlined)`
  font-size: 12px;
`;

const QuickTabs: React.FC = () => {
  const { t } = useTranslation("quick_tabs");

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
