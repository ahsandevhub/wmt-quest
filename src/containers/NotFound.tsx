import { LeftOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title, Text } = Typography;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #ffffff;
  text-align: center;
  padding: 0 24px;
  border-radius: 8px;
  border: 1px solid #0000000f;
`;

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
