import { GlobalOutlined } from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../i18n/namespaces";

function LanguageSwitcher() {
  const { t, i18n } = useTranslation(namespaces.header);

  const items: MenuProps["items"] = useMemo(
    () => [
      { label: t("language.english"), key: "en" },
      { label: t("language.bengali"), key: "bn" },
    ],
    [t]
  );

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    await i18n.changeLanguage(key);
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

export default LanguageSwitcher;
