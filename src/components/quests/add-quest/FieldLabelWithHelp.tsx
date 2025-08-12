import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";

type Props = { label: React.ReactNode; help: string };

const FieldLabelWithHelp: React.FC<Props> = ({ label, help }) => (
  <>
    {label}
    <Tooltip title={help}>
      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
    </Tooltip>
  </>
);

export default FieldLabelWithHelp;
