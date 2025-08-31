import { Button, Form, Image } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
          <Link to="/" aria-label={t("logoAlt")}>
            <Image
              src="/src/assets/WeMasterTrade-logo.png"
              alt={t("logoAlt")}
              preview={false}
              width={180}
            />
          </Link>
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

export default LoginForm;
