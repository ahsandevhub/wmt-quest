import { Breadcrumb } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { namespaces } from "../../../i18n/namespaces";

type Props = { isMobile: boolean; className?: string };

function BreadcrumbsBar({ isMobile, className }: Props) {
  const { t } = useTranslation(namespaces.header);
  const location = useLocation();

  const items = useMemo(() => {
    const segs = location.pathname.split("/").filter(Boolean);
    const format = (seg: string) =>
      seg
        .split("-")
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

    const crumbs: { title: string }[] = [];
    if (!isMobile) {
      crumbs.push({ title: segs[0] ? format(segs[0]) : t("home") });
    }
    const tail = isMobile
      ? format(segs[segs.length - 1] ?? "")
      : format(segs[1] ?? segs[0] ?? "");
    crumbs.push({ title: tail || t("home") });

    return crumbs;
  }, [isMobile, location.pathname, t]);

  return <Breadcrumb className={className} items={items} />;
}

export default React.memo(BreadcrumbsBar);
