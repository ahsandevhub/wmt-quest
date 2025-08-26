import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

const PlaceholderPage: React.FC<{ title: string; description?: string }> = ({
  title,
  description = "Page coming soon...",
}) => {
  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>{title}</Title>
      <p>{description}</p>
    </div>
  );
};

export default PlaceholderPage;
