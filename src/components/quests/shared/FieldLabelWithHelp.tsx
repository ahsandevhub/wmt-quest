// Shared FieldLabelWithHelp for add-quest and quest-detail
import React from "react";

interface Props {
  label: React.ReactNode;
  help?: React.ReactNode;
}

const FieldLabelWithHelp: React.FC<Props> = ({ label, help }) => (
  <span>
    {label}
    {help && <span style={{ marginLeft: 4 }}>{help}</span>}
  </span>
);

export default FieldLabelWithHelp;
