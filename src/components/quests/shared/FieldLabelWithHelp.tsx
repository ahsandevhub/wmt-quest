import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";

export interface FieldLabelWithHelpProps {
  label: React.ReactNode;
  help?: string | React.ReactNode;
}

const iconStyle: React.CSSProperties = { marginLeft: 4, fontSize: 14 };

const FieldLabelWithHelp: React.FC<FieldLabelWithHelpProps> = ({
  label,
  help,
}) => {
  if (!help) return <>{label}</>;
  return (
    <>
      {label}
      <Tooltip title={help}>
        <QuestionCircleOutlined style={iconStyle} />
      </Tooltip>
    </>
  );
};

export default FieldLabelWithHelp;
