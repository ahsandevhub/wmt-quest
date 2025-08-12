import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title } = Typography;

export interface TitleBarHeaderProps {
  /** Text to display as the title */
  title: string;
  /** Optional override for back-button behavior; defaults to navigate(-1) */
  onBack?: () => void;
  /** One or more buttons or other elements to render on the right */
  actions?: React.ReactNode;
}

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  margin-bottom: 1.5rem;
`;

const BackLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 0 !important;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleBarHeader: React.FC<TitleBarHeaderProps> = ({
  title,
  onBack,
  actions,
}) => {
  const navigate = useNavigate();

  const handleBack = React.useCallback(() => {
    if (onBack) return onBack();
    navigate(-1);
  }, [navigate, onBack]);

  return (
    <HeaderWrapper>
      <BackLink>
        <Button
          onClick={handleBack}
          size="large"
          type="text"
          icon={<ArrowLeftOutlined />}
        ></Button>
        <StyledTitle level={4}>{title}</StyledTitle>
      </BackLink>

      {actions && <ActionsContainer>{actions}</ActionsContainer>}
    </HeaderWrapper>
  );
};

export default TitleBarHeader;
