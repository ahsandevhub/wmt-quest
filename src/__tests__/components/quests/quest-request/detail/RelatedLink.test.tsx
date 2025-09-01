import { render, screen } from "@testing-library/react";
import { RelatedLink } from "../../../../../components/quests/quest-request/detail/RelatedLink";

describe("RelatedLink", () => {
  it("renders a dash when url is null", () => {
    render(<RelatedLink url={null} />);

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a dash when url is empty string", () => {
    render(<RelatedLink url="" />);

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a link when url is provided", () => {
    const testUrl = "https://example.com";
    render(<RelatedLink url={testUrl} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", testUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent(testUrl);
  });

  it("renders link with correct styling classes", () => {
    render(<RelatedLink url="https://test.com" />);

    const link = screen.getByRole("link");
    // The styled component will have generated class names, but we can check for inline styles
    expect(link).toHaveStyle("color: #1890ff");
    expect(link).toHaveStyle("text-decoration: underline");
  });

  it("handles various URL formats", () => {
    const testCases = [
      "https://www.example.com",
      "http://test.org",
      "https://subdomain.example.com/path?query=value",
    ];

    testCases.forEach((url) => {
      const { unmount } = render(<RelatedLink url={url} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", url);
      expect(link).toHaveTextContent(url);

      unmount();
    });
  });
});
