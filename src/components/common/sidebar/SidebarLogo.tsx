import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LogoWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  overflow: hidden;

  img {
    max-height: 26px;
    transition: all 0.2s ease;
  }
`;

type SidebarLogoProps = {
  to?: string;
  src: string;
  alt?: string;
};

function SidebarLogo({
  to = "/",
  src,
  alt = "WeMasterTrade Logo",
}: SidebarLogoProps) {
  return (
    <LogoWrapper>
      <Link to={to}>
        <img src={src} alt={alt} />
      </Link>
    </LogoWrapper>
  );
}

export default React.memo(SidebarLogo);
