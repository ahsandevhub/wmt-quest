import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n/namespaces";
import { IconWrap } from "./LoginForm.styles";

const LoginFields = () => {
  const { t } = useTranslation(namespaces.login);

  return (
    <>
      <Form.Item
        name="username"
        rules={[{ required: true, message: t("requiredUsername") }]}
      >
        <Input
          size="large"
          name="username"
          placeholder={t("usernamePlaceholder")}
          prefix={
            <IconWrap>
              <UserOutlined />
            </IconWrap>
          }
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: t("requiredPassword") }]}
      >
        <Input.Password
          size="large"
          name="password"
          placeholder={t("passwordPlaceholder")}
          prefix={
            <IconWrap>
              <LockOutlined />
            </IconWrap>
          }
        />
      </Form.Item>
    </>
  );
};

export default LoginFields;
