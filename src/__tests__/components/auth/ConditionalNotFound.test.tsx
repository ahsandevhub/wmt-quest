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

describe("ConditionalNotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing while initializing", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitializing: true,
    });
    const { container } = render(
      <MemoryRouter>
        <ConditionalNotFound />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
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
    // RTL doesn't follow redirects, but Navigate renders nothing
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
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
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
