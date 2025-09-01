import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ActionButtons } from "../../../../../components/quests/quest-request/detail/ActionButtons";

// Mock styled components
vi.mock(
  "../../../../../components/quests/quest-request/detail/ActionButtons.styles",
  () => ({
    ActionsWrap: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="actions-wrap">{children}</div>
    ),
  })
);

describe("ActionButtons", () => {
  const defaultProps = {
    loadingAction: null as null | "approve" | "reject",
    onApprove: vi.fn(),
    onReject: vi.fn(),
    approveLabel: "Approve",
    rejectLabel: "Reject",
    show: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders approve and reject buttons when show is true", () => {
    render(<ActionButtons {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByTestId("actions-wrap")).toBeInTheDocument();
  });

  it("does not render anything when show is false", () => {
    render(<ActionButtons {...defaultProps} show={false} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("actions-wrap")).not.toBeInTheDocument();
  });

  it("calls onApprove when approve button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(defaultProps.onApprove).toHaveBeenCalledTimes(1);
    expect(defaultProps.onReject).not.toHaveBeenCalled();
  });

  it("calls onReject when reject button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(defaultProps.onReject).toHaveBeenCalledTimes(1);
    expect(defaultProps.onApprove).not.toHaveBeenCalled();
  });

  it("shows loading state on approve button when loadingAction is approve", () => {
    render(<ActionButtons {...defaultProps} loadingAction="approve" />);

    const approveButton = screen.getByRole("button", { name: /approve/i });
    const rejectButton = screen.getByRole("button", { name: "Reject" });

    expect(approveButton).toHaveClass("ant-btn-loading");
    expect(rejectButton).not.toHaveClass("ant-btn-loading");
  });

  it("shows loading state on reject button when loadingAction is reject", () => {
    render(<ActionButtons {...defaultProps} loadingAction="reject" />);

    const approveButton = screen.getByRole("button", { name: "Approve" });
    const rejectButton = screen.getByRole("button", { name: /reject/i });

    expect(rejectButton).toHaveClass("ant-btn-loading");
    expect(approveButton).not.toHaveClass("ant-btn-loading");
  });

  it("renders primary type for approve button and default for reject", () => {
    render(<ActionButtons {...defaultProps} />);

    const approveButton = screen.getByRole("button", { name: "Approve" });
    const rejectButton = screen.getByRole("button", { name: "Reject" });

    expect(approveButton).toHaveClass("ant-btn-primary");
    expect(rejectButton).not.toHaveClass("ant-btn-primary");
  });
});
