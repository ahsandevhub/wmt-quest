// Shared EmailControls for add-quest and quest-detail
import React from "react";

interface Props {
  t: any;
  onAdd: () => void;
  onImport: () => void;
}

const EmailControls: React.FC<Props> = ({ t, onAdd, onImport }) => (
  <div style={{ display: "flex", gap: 8 }}>
    <button type="button" onClick={onAdd}>
      {t("addEmail")}
    </button>
    <button type="button" onClick={onImport}>
      {t("importEmails")}
    </button>
  </div>
);

export default EmailControls;
