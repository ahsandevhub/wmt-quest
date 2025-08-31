import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// We'll control breakpoints via this variable in the mocked antd
let mockScreens = { md: true };

// Mock antd Button and Grid.useBreakpoint to make size observable
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    Grid: {
      useBreakpoint: () => mockScreens,
    },
    Button: ({ onClick, size, type, icon }: any) => (
      <button data-size={size} data-type={type} onClick={onClick}>
        {icon ? "icon" : ""}
      </button>
    ),
  };
});

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import TitleBarHeader from "../../../../components/common/layout/TitleBarHeader";

describe("TitleBarHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScreens = { md: true };
  });

  it("renders title and actions", () => {
    render(
      <TitleBarHeader
        title="My Title"
        actions={<div data-testid="act">X</div>}
      />
    );

    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByTestId("act")).toBeInTheDocument();
  });

  it("calls navigate(-1) when back is clicked and no onBack is provided", () => {
    render(<TitleBarHeader title="T" />);

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("calls onBack when provided instead of navigate", () => {
    const onBack = vi.fn();
    render(<TitleBarHeader title="T" onBack={onBack} />);

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(onBack).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("uses large button size on desktop and middle on mobile", () => {
    // Desktop
    mockScreens = { md: true };
    const { rerender } = render(<TitleBarHeader title="T" />);
    const btnDesktop = screen.getByRole("button");
    expect(btnDesktop).toHaveAttribute("data-size", "large");

    // Mobile
    mockScreens = { md: false };
    rerender(<TitleBarHeader title="T" />);
    const btnMobile = screen.getByRole("button");
    expect(btnMobile).toHaveAttribute("data-size", "middle");
  });
});
