import { GlobalOutlined } from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { t, i18n } = useTranslation("header");

  const items: MenuProps["items"] = useMemo(
    () => [
      { label: t("language.english"), key: "en" },
      { label: t("language.bengali"), key: "bn" },
    ],
    [t]
  );

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    await i18n.changeLanguage(key);
    // using t after language change still shows the old value in this tick, but toast is fine
  };

  return (
    <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <GlobalOutlined />
        <span>
          {i18n.language === "en"
            ? t("language.english")
            : t("language.bengali")}
        </span>
      </div>
    </Dropdown>
  );
}

export default React.memo(LanguageSwitcher);
