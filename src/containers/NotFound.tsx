import { HomeOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Wrapper } from "./NotFound.styles";

const { Title, Text } = Typography;

export default function NotFound() {
  const { t } = useTranslation("not_found");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/quest/quest-list", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleGoBack = () => {
    // Only go back if there's history, otherwise go home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <Wrapper>
      <Title level={1} style={{ marginBottom: 16 }}>
        {t("statusCode")}
      </Title>
      <Text style={{ fontSize: 18, marginBottom: 32 }}>{t("message")}</Text>

      <Space>
        <Button type="default" icon={<LeftOutlined />} onClick={handleGoBack}>
          {t("goBack")}
        </Button>
        <Button type="primary" icon={<HomeOutlined />} onClick={handleGoHome}>
          {isAuthenticated ? t("goToQuests") : t("goToLogin")}
        </Button>
      </Space>
    </Wrapper>
  );
}
