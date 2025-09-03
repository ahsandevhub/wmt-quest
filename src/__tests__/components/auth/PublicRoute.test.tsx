import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import PublicRoute from "../../../components/auth/PublicRoute";
import { useAuth } from "../../../hooks/useAuth";

vi.mock("../../../hooks/useAuth", () => ({ useAuth: vi.fn() }));
const mockUseAuth = vi.mocked(useAuth);

vi.mock("../../../components/auth/PublicRoute.styles", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-wrapper">{children}</div>
  ),
}));

describe("PublicRoute", () => {
  function renderWithRoutes(authState: any, initialEntries = ["/login"]) {
    mockUseAuth.mockReturnValue(authState);
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<PublicRoute />}>
            {/* Public route */}
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/quest/quest-list" element={<div>Quest List</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("shows loading spinner when initializing", () => {
    renderWithRoutes({ isAuthenticated: false, isInitializing: true });
    expect(screen.getByTestId("loading-wrapper")).toBeInTheDocument();
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it("redirects to quest list if authenticated", () => {
    renderWithRoutes({ isAuthenticated: true, isInitializing: false });
    expect(screen.getByText("Quest List")).toBeInTheDocument();
  });

  it("renders Outlet (login page) if not authenticated", () => {
    renderWithRoutes({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
