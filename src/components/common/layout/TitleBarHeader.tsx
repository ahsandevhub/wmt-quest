import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Grid } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionsContainer,
  BackLink,
  HeaderWrapper,
  StyledTitle,
} from "./TitleBarHeader.styles";

export interface TitleBarHeaderProps {
  /** Text to display as the title */
  title: string;
  /** Optional override for back-button behavior; defaults to navigate(-1) */
  onBack?: () => void;
  /** One or more buttons or other elements to render on the right */
  actions?: React.ReactNode;
}

// styles extracted to TitleBarHeader.styles.ts

export const TitleBarHeader: React.FC<TitleBarHeaderProps> = ({
  title,
  onBack,
  actions,
}) => {
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md; // treat < md as mobile

  const handleBack = React.useCallback(() => {
    if (onBack) return onBack();
    navigate(-1);
  }, [navigate, onBack]);

  return (
    <HeaderWrapper>
      <BackLink>
        <Button
          onClick={handleBack}
          size={isMobile ? "middle" : "large"}
          type="text"
          icon={<ArrowLeftOutlined />}
        />
        <StyledTitle level={4} $isMobile={isMobile}>
          {title}
        </StyledTitle>
      </BackLink>

      {actions && <ActionsContainer>{actions}</ActionsContainer>}
    </HeaderWrapper>
  );
};

export default TitleBarHeader;
