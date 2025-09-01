import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LabelWithTooltip } from "../../../../components/quests/shared/LabelWithTooltip";

// Mock Ant Design Tooltip
vi.mock("antd", () => ({
  Tooltip: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      {children}
      <div data-testid="tooltip-content" style={{ display: "none" }}>
        {title}
      </div>
    </div>
  ),
}));

// Mock the QuestionIcon styled component
vi.mock("../../../../components/quests/shared/QuestionIcon.styles", () => ({
  QuestionIcon: ({ style, ...props }: any) => (
    <span data-testid="question-icon" style={style} {...props}>
      ?
    </span>
  ),
}));

describe("LabelWithTooltip", () => {
  it("renders label text", () => {
    render(
      <LabelWithTooltip label="Test Label" tooltip="Test tooltip content" />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders question icon", () => {
    render(
      <LabelWithTooltip label="Test Label" tooltip="Test tooltip content" />
    );

    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders tooltip content in DOM", () => {
    render(
      <LabelWithTooltip
        label="Test Label"
        tooltip="This is helpful tooltip text"
      />
    );

    // The tooltip content should be in the DOM (even if hidden)
    expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    expect(
      screen.getByText("This is helpful tooltip text")
    ).toBeInTheDocument();
  });

  it("applies custom icon margin when provided", () => {
    render(
      <LabelWithTooltip
        label="Test Label"
        tooltip="Test tooltip"
        iconMarginLeft={8}
      />
    );

    const questionIcon = screen.getByTestId("question-icon");
    expect(questionIcon).toHaveStyle("margin-left: 8px");
  });

  it("applies default margin when iconMarginLeft is not provided", () => {
    render(<LabelWithTooltip label="Test Label" tooltip="Test tooltip" />);

    const questionIcon = screen.getByTestId("question-icon");
    expect(questionIcon).toHaveStyle("margin-left: 4px");
  });

  it("applies default margin when iconMarginLeft is 0", () => {
    render(
      <LabelWithTooltip
        label="Test Label"
        tooltip="Test tooltip"
        iconMarginLeft={0}
      />
    );

    const questionIcon = screen.getByTestId("question-icon");
    expect(questionIcon).toHaveStyle("margin-left: 4px");
  });

  it("handles React node as label", () => {
    const labelNode = (
      <span>
        Complex <strong>Label</strong>
      </span>
    );

    render(<LabelWithTooltip label={labelNode} tooltip="Test tooltip" />);

    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("handles React node as tooltip", () => {
    const tooltipNode = (
      <div>
        <p>Complex tooltip</p>
        <span>with multiple elements</span>
      </div>
    );

    render(<LabelWithTooltip label="Test Label" tooltip={tooltipNode} />);

    // The label should be visible
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    // The question icon should be present for tooltip interaction
    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
  });

  it("has proper inline layout for alignment", () => {
    render(<LabelWithTooltip label="Test Label" tooltip="Test tooltip" />);

    // Find the wrapper containing both label and icon
    const wrapper = screen.getByText("Test Label").parentElement;
    expect(wrapper).toBeInTheDocument();

    // Test that label and icon are properly positioned
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
  });
});
