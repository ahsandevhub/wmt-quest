import { Button, Input } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { emailRegex } from "../../../utils/validators";

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-areas: "input add import";
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "input input"
      "add   import";

    .control-add button,
    .control-import button {
      width: 100%;
    }
  }

  .control-input {
    grid-area: input;
  }
  .control-add {
    grid-area: add;
  }
  .control-import {
    grid-area: import;
  }
`;

export interface EmailControlsProps {
  t: (key: string, vars?: any) => string;
  onAdd: (email: string) => Promise<boolean>;
  onImport: () => void;
  compact?: boolean; // if true use inline Form variant like detail view
}

const EmailControls: React.FC<EmailControlsProps> = ({
  t,
  onAdd,
  onImport,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAddClick = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(t("validation.emailRequired"));
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setError(t("validation.emailInvalid"));
      return;
    }
    const ok = await onAdd(trimmed);
    if (ok) {
      setValue("");
      setError(undefined);
    }
  };

  return (
    <Row>
      <div className="control-input">
        <Input
          value={value}
          status={error ? "error" : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          maxLength={100}
          placeholder={t("form.placeholders.enterEmail")}
        />
        {error && (
          <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
            {error}
          </div>
        )}
      </div>
      <div className="control-add">
        <Button onClick={handleAddClick}>{t("buttons.add")}</Button>
      </div>
      <div className="control-import">
        <Button type="primary" onClick={onImport}>
          {t("buttons.import")}
        </Button>
      </div>
    </Row>
  );
};

export default React.memo(EmailControls);
