import { Breadcrumb } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { namespaces } from "../../../i18n/namespaces";

type Props = { isMobile: boolean; className?: string };

function BreadcrumbsBar({ isMobile, className }: Props) {
  const { t } = useTranslation(namespaces.header);
  const location = useLocation();

  const items = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return [{ title: t("home"), key: "home" }];

    const humanize = (segment: string) =>
      segment
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Mobile: only show last segment (current page)
    if (isMobile) {
      return [
        {
          title: humanize(pathSegments[pathSegments.length - 1]) || t("home"),
          key: pathSegments[pathSegments.length - 1] || "home",
        },
      ];
    }

    // Desktop: show full path; link all but last
    let cumulative = "";
    return pathSegments.map((segment, idx) => {
      cumulative += `/${segment}`;
      const title = humanize(segment) || t("home");
      return {
        key: cumulative,
        title:
          idx < pathSegments.length - 1 ? (
            <Link to={cumulative}>{title}</Link>
          ) : (
            title
          ),
      };
    });
  }, [isMobile, location.pathname, t]);

  return <Breadcrumb className={className} items={items} />;
}

export default BreadcrumbsBar;
