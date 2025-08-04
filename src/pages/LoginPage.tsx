import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import WmtLogo from "../assets/WeMasterTrade-logo.png";
import useAuth from "../auth/useAuth";

interface LoginFormValues {
  username: string;
  password: string;
}

// Styled Components
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

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 14px;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const LoginPage: React.FC = () => {
  const { accessToken, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/quest/quest-list", { replace: true });
    }
  }, [accessToken, navigate]);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await login(values.username, values.password);
      message.success("Login successful!");
      navigate("/quest/quest-list", { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <LogoWrapper>
          <a href="/">
            <img src={WmtLogo} alt="WeMasterTrade" />
          </a>
        </LogoWrapper>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Form<LoginFormValues>
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              size="large"
              placeholder="Username or email"
              prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default LoginPage;
