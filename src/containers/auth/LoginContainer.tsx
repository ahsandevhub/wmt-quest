import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { namespaces } from "../../i18n/namespaces";
import type { LoginFormValues } from "../../types/auth";

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, login, isInitializing } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { t } = useTranslation(namespaces.login);

  useEffect(() => {
    if (accessToken && !isInitializing) {
      // Redirect to intended destination or default to quest-list
      const from = location.state?.from?.pathname || "/quest/quest-list";
      navigate(from, { replace: true });
    }
  }, [accessToken, isInitializing, location.state, navigate]);

  const handleSubmit = async ({ username, password }: LoginFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await login(username, password);
      message.success(t("loginSuccess"));
      // Navigation is handled by the useEffect above
    } catch (error: any) {
      const fallback = t("loginFailed");
      const serverMessage =
        error?.response?.data?.message || error?.message || fallback;
      setSubmitError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render login form while checking authentication
  if (isInitializing) {
    return null;
  }

  return (
    <LoginForm
      isSubmitting={isSubmitting}
      errorMessage={submitError}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;
