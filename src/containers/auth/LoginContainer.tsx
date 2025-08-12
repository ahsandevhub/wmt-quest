import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm, {
  type LoginFormValues,
} from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (accessToken) {
      navigate("/quest/quest-list", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleSubmit = async ({ username, password }: LoginFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await login(username, password);
      message.success("Login successful!");
      navigate("/quest/quest-list", { replace: true });
    } catch (error: any) {
      const fallback = "Login failed. Please try again.";
      const serverMessage =
        error?.response?.data?.message || error?.message || fallback;
      setSubmitError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginForm
      isSubmitting={isSubmitting}
      errorMessage={submitError}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;
