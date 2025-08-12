import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

type QuestRequestActionsBarProps = {
  addButtonText: string;
  onAddNew: () => void;
};

const QuestRequestActionsBar: React.FC<QuestRequestActionsBarProps> = ({
  addButtonText,
  onAddNew,
}) => (
  <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
    {addButtonText}
  </Button>
);

export default QuestRequestActionsBar;
