// src/components/Breadcrumbs.tsx
import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = "/" + pathSegments.slice(0, index + 1).join("/");
    return {
      title: <Link to={url}>{formatSegment(segment)}</Link>,
    };
  });

  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ title: <Link to="/">Home</Link> });
  }

  return <Breadcrumb items={breadcrumbItems} />;
};

export default Breadcrumbs;
