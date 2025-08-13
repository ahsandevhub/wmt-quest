import { Tooltip } from "antd";
import React from "react";
import { QuestionIcon } from "./QuestionIcon.styles";

export interface LabelWithTooltipProps {
  label: React.ReactNode;
  tooltip: React.ReactNode;
  iconMarginLeft?: number;
}

// Small reusable label + tooltip pattern to reduce JSX duplication in quest forms
export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  label,
  tooltip,
  iconMarginLeft = 0,
}) => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    {label}
    <Tooltip title={tooltip}>
      <QuestionIcon style={{ marginLeft: iconMarginLeft || 4 }} />
    </Tooltip>
  </span>
);

export default LabelWithTooltip;
