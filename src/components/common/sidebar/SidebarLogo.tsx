import React from "react";
import { Link } from "react-router-dom";

import { LogoWrapper } from "./SidebarLogo.styles";

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
