import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import SidebarLogo from "../../../../components/common/sidebar/SidebarLogo";

describe("SidebarLogo", () => {
  it("renders a link to / by default with provided src and default alt", () => {
    render(
      <MemoryRouter>
        <SidebarLogo src="/some-image.png" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/");

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/some-image.png");
    expect(img.alt).toBe("WeMasterTrade Logo");
  });

  it("accepts a custom 'to' prop and custom alt text", () => {
    render(
      <MemoryRouter>
        <SidebarLogo src="/logo.svg" to="/home" alt="Custom Alt" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/home");

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("/logo.svg");
    expect(img.alt).toBe("Custom Alt");
  });
});
