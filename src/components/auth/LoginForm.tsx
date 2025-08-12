import { Button, Form } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n/namespaces";
import type { LoginFormValues } from "../../types/auth";
import LoginFields from "./LoginFields";
import { Card, ErrorAlert, LogoWrapper, PageWrapper } from "./LoginForm.styles";

interface LoginFormProps {
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: LoginFormValues) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  const { t } = useTranslation(namespaces.login);

  return (
    <PageWrapper>
      <Card aria-label={t("logoAlt")}>
        <LogoWrapper>
          <a href="/" aria-label={t("logoAlt")}>
            <img src="/src/assets/WeMasterTrade-logo.png" alt={t("logoAlt")} />
          </a>
        </LogoWrapper>

        {errorMessage ? (
          <ErrorAlert role="alert">{errorMessage}</ErrorAlert>
        ) : null}

        <Form<LoginFormValues>
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <LoginFields />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              size="large"
              block
            >
              {t("signIn")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default React.memo(LoginForm);
