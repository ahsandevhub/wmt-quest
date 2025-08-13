import { LeftOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./NotFound.styles";

const { Title, Text } = Typography;

export default function NotFound() {
  const { t } = useTranslation("not_found");
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title level={1} style={{ marginBottom: 16 }}>
        {t("statusCode")}
      </Title>
      <Text style={{ fontSize: 18, marginBottom: 32 }}>{t("message")}</Text>
      <Button
        type="primary"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
      >
        {t("goBack")}
      </Button>
    </Wrapper>
  );
}
