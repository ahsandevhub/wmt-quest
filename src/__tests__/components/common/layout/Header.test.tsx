import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock useAuth
const mockLogout = vi.fn();
vi.mock("../../../../hooks/useAuth", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        logoutSuccess: "Logout successful!",
      };
      return map[key] ?? key;
    },
  }),
}));

// Mock antd Grid
let mockScreens = { md: true }; // Default to desktop
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    Grid: {
      useBreakpoint: () => mockScreens,
    },
    message: {
      success: vi.fn(),
    },
  };
});

// Mock header components
vi.mock("../../../../components/common/header/ToggleSidebarButton", () => ({
  default: ({
    collapsed,
    onToggle,
  }: {
    collapsed: boolean;
    onToggle: () => void;
  }) => (
    <button data-testid="toggle-sidebar" onClick={onToggle}>
      {collapsed ? "Expand" : "Collapse"}
    </button>
  ),
}));

vi.mock("../../../../components/common/header/LanguageSwitcher", () => ({
  default: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

vi.mock("../../../../components/common/header/NotificationsBell", () => ({
  default: () => <div data-testid="notifications-bell">Notifications</div>,
}));

vi.mock("../../../../components/common/header/ProfileMenu", () => ({
  default: ({
    onProfile,
    onLogout,
  }: {
    onProfile: () => void;
    onLogout: () => void;
  }) => (
    <div data-testid="profile-menu">
      <button onClick={onProfile}>Profile</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}));

// Mock BreadcrumbsBar
vi.mock("../../../../components/common/header/BreadcrumbsBar", () => ({
  default: ({ isMobile }: { isMobile: boolean }) => (
    <div data-testid="breadcrumbs" data-mobile={isMobile}>
      Breadcrumbs
    </div>
  ),
}));

import AppHeader from "../../../../components/common/layout/Header";

describe("AppHeader", () => {
  const defaultProps = {
    collapsed: false,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockScreens = { md: true }; // Reset to desktop
  });

  const renderWithRouter = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <AppHeader {...props} />
      </MemoryRouter>
    );
  };

  it("renders all header components", () => {
    renderWithRouter();

    expect(screen.getByTestId("toggle-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-bell")).toBeInTheDocument();
    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
  });

  it("calls onToggle when toggle button is clicked", () => {
    const onToggle = vi.fn();
    renderWithRouter({ ...defaultProps, onToggle });

    const toggleButton = screen.getByTestId("toggle-sidebar");
    fireEvent.click(toggleButton);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("passes collapsed state correctly to toggle button", () => {
    renderWithRouter({ ...defaultProps, collapsed: true });

    expect(screen.getByText("Expand")).toBeInTheDocument();

    renderWithRouter({ ...defaultProps, collapsed: false });
    expect(screen.getByText("Collapse")).toBeInTheDocument();
  });

  it("shows language switcher and notifications on desktop", () => {
    mockScreens = { md: true };
    renderWithRouter();

    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-bell")).toBeInTheDocument();
  });

  it("hides language switcher and notifications on mobile", () => {
    mockScreens = { md: false };
    renderWithRouter();

    expect(screen.queryByTestId("language-switcher")).not.toBeInTheDocument();
    expect(screen.queryByTestId("notifications-bell")).not.toBeInTheDocument();
    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
  });

  it("passes mobile state to breadcrumbs", () => {
    mockScreens = { md: false };
    renderWithRouter();

    const breadcrumbs = screen.getByTestId("breadcrumbs");
    expect(breadcrumbs).toHaveAttribute("data-mobile", "true");
  });

  it("passes desktop state to breadcrumbs", () => {
    mockScreens = { md: true };
    renderWithRouter();

    const breadcrumbs = screen.getByTestId("breadcrumbs");
    expect(breadcrumbs).toHaveAttribute("data-mobile", "false");
  });

  it("handles profile menu profile action", () => {
    renderWithRouter();

    const profileButton = screen.getByText("Profile");
    fireEvent.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("handles profile menu logout action", async () => {
    const { message } = await import("antd");
    renderWithRouter();

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(message.success).toHaveBeenCalledWith("Logout successful!");
  });

  it("maintains proper component structure", () => {
    renderWithRouter();

    // Check that left group contains toggle and breadcrumbs
    const toggleButton = screen.getByTestId("toggle-sidebar");
    const breadcrumbs = screen.getByTestId("breadcrumbs");

    expect(toggleButton).toBeInTheDocument();
    expect(breadcrumbs).toBeInTheDocument();

    // Check that right group contains profile menu
    const profileMenu = screen.getByTestId("profile-menu");
    expect(profileMenu).toBeInTheDocument();
  });
});
