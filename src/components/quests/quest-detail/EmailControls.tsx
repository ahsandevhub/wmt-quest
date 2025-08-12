import { Button, Form, Input } from "antd";
import React from "react";
import styled from "styled-components";
import { emailRegex } from "../../../utils/validators";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .ant-input {
    flex: 1;
  }
`;

type Props = {
  t: (key: string, vars?: any) => string;
  onAdd: (email: string) => Promise<boolean>;
  onImport: () => void;
};

const EmailControls: React.FC<Props> = ({ t, onAdd, onImport }) => {
  const [form] = Form.useForm<{ specificEmail?: string }>();

  const handleAddClick = async () => {
    const value = form.getFieldValue("specificEmail")?.trim();
    if (!value) {
      form.setFields([
        { name: "specificEmail", errors: [t("validation.emailRequired")] },
      ]);
      return;
    }
    if (!emailRegex.test(value)) {
      form.setFields([
        { name: "specificEmail", errors: [t("validation.emailInvalid")] },
      ]);
      return;
    }
    const ok = await onAdd(value);
    if (ok) form.resetFields(["specificEmail"]);
  };

  return (
    <Row>
      <Form form={form} style={{ flex: 1 }}>
        <Form.Item name="specificEmail" noStyle>
          <Input
            placeholder={t("form.placeholders.enterEmail")}
            maxLength={100}
          />
        </Form.Item>
      </Form>
      <Button onClick={handleAddClick}>{t("buttons.add")}</Button>
      <Button type="primary" onClick={onImport}>
        {t("buttons.import")}
      </Button>
    </Row>
  );
};

export default EmailControls;
