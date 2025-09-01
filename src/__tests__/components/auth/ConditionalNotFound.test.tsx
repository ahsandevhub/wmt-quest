import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConditionalNotFound from "../../../components/auth/ConditionalNotFound";

// Mock useAuth
import * as useAuthModule from "../../../hooks/useAuth";
vi.mock("../../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = useAuthModule.useAuth as unknown as Mock;

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        statusCode: "404 Not Found",
        message: "The page you are looking for does not exist",
        goBack: "Go Back",
        goToQuests: "Go to Quests",
        goToLogin: "Go to Login",
      };
      return translations[key] || key;
    }),
  })),
}));

// Mock layout components to avoid complex rendering
vi.mock("../../../components/common/layout/Header", () => ({
  default: () => <div data-testid="app-header">Header</div>,
}));

vi.mock("../../../components/common/layout/Sidebar", () => ({
  default: ({ collapsed }: { collapsed: boolean }) => (
    <div data-testid="sidebar" data-collapsed={collapsed}>
      Sidebar
    </div>
  ),
}));

vi.mock("../../../containers/NotFound", () => ({
  default: () => (
    <div data-testid="not-found">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist</p>
      <button>Go Back</button>
    </div>
  ),
}));

// Mock LoadingWrapper used by ConditionalNotFound
vi.mock("../../../components/auth/ProtectedRoute.styles", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-wrapper">{children}</div>
  ),
}));

describe("ConditionalNotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner while initializing", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitializing: true,
    });
    render(
      <MemoryRouter>
        <ConditionalNotFound />
      </MemoryRouter>
    );
    // Expect the loading spinner wrapper and AntD spinner
    expect(screen.getByTestId("loading-wrapper")).toBeInTheDocument();
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it("redirects to login if not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
    });
    render(
      <MemoryRouter initialEntries={["/some/bad/route"]}>
        <ConditionalNotFound />
      </MemoryRouter>
    );
    // Navigate renders nothing, so no 404 content should be present
    expect(screen.queryByTestId("not-found")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-wrapper")).not.toBeInTheDocument();
  });

  it("renders 404 layout if authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitializing: false,
    });
    render(
      <MemoryRouter initialEntries={["/some/bad/route"]}>
        <ConditionalNotFound />
      </MemoryRouter>
    );
    // Should render NotFound component content
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not exist")
    ).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    // Ensure no spinner
    expect(screen.queryByTestId("loading-wrapper")).not.toBeInTheDocument();
  });
});
