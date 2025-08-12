import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "bn"],
    debug: false,
    ns: [
      "sidebar",
      "header",
      "quest_list",
      "add_new_quest",
      "quest_detail",
      "quest_request_list",
      "quest_request_detail",
      "not_found",
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    backend: {
      loadPath: "/src/i18n/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
  });

export default i18n;
