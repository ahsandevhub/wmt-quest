import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// We'll mock antd to control Grid.useBreakpoint and Drawer rendering
let mockScreens = { md: true };
vi.mock("antd", async () => {
  const antd = await vi.importActual("antd");
  return {
    ...antd,
    Grid: {
      useBreakpoint: () => mockScreens,
    },
    Drawer: ({ children, ...props }: any) => (
      <div data-testid="drawer" data-open={String(props.open)}>
        {children}
      </div>
    ),
  };
});

// Mock translations (Sidebar uses namespaces.sidebar but only passes t into buildSidebarSections)
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Mock router location
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/current/path" }),
  };
});

// Mock SidebarLogo and SidebarMenu
vi.mock("../../../../components/common/sidebar/SidebarLogo", () => ({
  default: ({ to, src }: any) => (
    <div data-testid="sidebar-logo" data-to={to} data-src={src} />
  ),
}));

vi.mock("../../../../components/common/sidebar/SidebarMenu", () => ({
  __esModule: true,
  default: ({ currentPath, onItemClick }: any) => (
    <div
      data-testid="sidebar-menu"
      data-currentpath={currentPath}
      data-onitemclick={onItemClick ? "yes" : "no"}
    />
  ),
}));

// Mock assets so we can assert which one is chosen (ES module default)
vi.mock("../../../../assets/WeMasterTrade-icon.png", () => ({
  default: "icon.png",
}));
vi.mock("../../../../assets/WeMasterTrade-logo.png", () => ({
  default: "logo.png",
}));

import Sidebar from "../../../../components/common/layout/Sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScreens = { md: true };
  });

  it("renders Sider (non-mobile) and selects correct logo for collapsed state", () => {
    // Desktop, collapsed = false -> should use logo.png
    const { rerender } = render(
      <Sidebar collapsed={false} onToggle={() => {}} />
    );

    expect(screen.queryByTestId("drawer")).toBeNull();
    const logo = screen.getByTestId("sidebar-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("data-src", "logo.png");

    const menu = screen.getByTestId("sidebar-menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("data-onitemclick", "no");

    // Re-render with collapsed = true -> should use icon.png
    rerender(<Sidebar collapsed={true} onToggle={() => {}} />);
    const logo2 = screen.getAllByTestId("sidebar-logo")[0];
    expect(logo2).toHaveAttribute("data-src", "icon.png");
  });

  it("renders Drawer on mobile and opens/closes correctly, SidebarMenu receives onItemClick", () => {
    mockScreens = { md: false };

    const onToggle = vi.fn();
    render(<Sidebar collapsed={true} onToggle={onToggle} />);

    const drawer = screen.getByTestId("drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-open", "true");

    const menu = screen.getByTestId("sidebar-menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("data-onitemclick", "yes");
  });
});
