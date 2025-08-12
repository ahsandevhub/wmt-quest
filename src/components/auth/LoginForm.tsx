import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: LoginFormValues) => void;
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  padding: 40px 24px;

  @media (min-width: 640px) {
    padding: 30px 40px;
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: center;

  img {
    height: 36px;
    transition: all 0.2s ease;
  }
`;

const ErrorAlert = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 14px;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  color: #9ca3af; /* replaces inline style on icons */
`;

const LoginForm: React.FC<LoginFormProps> = ({
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  const { t } = useTranslation("");

  return (
    <PageWrapper>
      <Card aria-label={t("header:appName", "WeMasterTrade")}>
        <LogoWrapper>
          <a href="/" aria-label={t("header:goHome", "Go to homepage")}>
            <img src="/src/assets/WeMasterTrade-logo.png" alt="WeMasterTrade" />
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
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t(
                  "auth:login.usernameRequired",
                  "Please enter your username"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t(
                "auth:login.usernamePlaceholder",
                "Username or email"
              )}
              prefix={
                <IconWrap>
                  <UserOutlined />
                </IconWrap>
              }
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t(
                  "auth:login.passwordRequired",
                  "Please enter your password"
                ),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("auth:login.passwordPlaceholder", "Password")}
              prefix={
                <IconWrap>
                  <LockOutlined />
                </IconWrap>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              size="large"
              block
            >
              {t("auth:login.signIn", "Sign In")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default LoginForm;
