import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import { useAuth } from "../../../hooks/useAuth";
vi.mock("../../../hooks/useAuth", () => ({ useAuth: vi.fn() }));
const mockUseAuth = vi.mocked(useAuth);

// Mock LoadingWrapper
vi.mock("../../../components/auth/ProtectedRoute.styles", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-wrapper">{children}</div>
  ),
}));

describe("ProtectedRoute", () => {
  function renderWithRoutes(authState: any, initialEntries = ["/protected"]) {
    mockUseAuth.mockReturnValue(authState);
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* Protected route */}
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("shows loading spinner when initializing", () => {
    renderWithRoutes({ isAuthenticated: false, isInitializing: true });
    expect(screen.getByTestId("loading-wrapper")).toBeInTheDocument();
    // Check for AntD spinner by aria-busy or spinner class
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it("redirects to login if not authenticated", () => {
    renderWithRoutes({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders Outlet (protected content) if authenticated", () => {
    renderWithRoutes({ isAuthenticated: true, isInitializing: false });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
