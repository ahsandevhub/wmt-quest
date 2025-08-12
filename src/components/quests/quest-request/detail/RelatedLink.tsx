import React from "react";
import styled from "styled-components";

const StyledLink = styled.a`
  color: #1890ff;
  text-decoration: underline;
`;

export const RelatedLink: React.FC<{ url: string | null }> = ({ url }) => {
  if (!url) return <span>-</span>;
  return (
    <StyledLink href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </StyledLink>
  );
};
