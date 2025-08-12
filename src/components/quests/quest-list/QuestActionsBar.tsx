import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

type QuestActionsBarProps = {
  addButtonText: string;
  onAddNew: () => void;
};

const QuestActionsBar: React.FC<QuestActionsBarProps> = ({
  addButtonText,
  onAddNew,
}) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
      {addButtonText}
    </Button>
  );
};

export default QuestActionsBar;
