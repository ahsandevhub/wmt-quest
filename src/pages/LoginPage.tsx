import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import WmtLogo from "../assets/WeMasterTrade-logo.png";
import api from "../lib/api";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/quests", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/auth/login`,
        values
      );

      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      message.success("Login successful!");
      window.location.href = "/quests";
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      message.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border border-white/30 shadow-lg rounded-2xl w-full max-w-md px-6 py-10 sm:p-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <img
              src={WmtLogo}
              alt="WeMasterTrade"
              className="h-8 sm:h-10 transition-all duration-200"
            />
          </a>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
            {errorMessage}
          </div>
        )}

        <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              size="large"
              placeholder="Username or email"
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              className="rounded-lg h-12 font-medium bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
