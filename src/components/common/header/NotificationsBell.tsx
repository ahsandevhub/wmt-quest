import { BellOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function NotificationsBell() {
  const { t } = useTranslation("header");
  return (
    <Badge>
      <Button
        type="text"
        icon={<BellOutlined />}
        aria-label={t("notifications")}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          height: 32,
          padding: "0 8px",
        }}
      />
    </Badge>
  );
}

export default React.memo(NotificationsBell);
