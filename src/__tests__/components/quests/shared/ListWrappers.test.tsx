import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  ActionsBar,
  DetailLink,
  EllipsisText,
  PageWrapper,
  PaginationBar,
  TableCard,
} from "../../../../components/quests/shared/ListWrappers";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("ListWrappers", () => {
  describe("PageWrapper", () => {
    it("renders children with flex column layout", () => {
      render(
        <PageWrapper data-testid="page-wrapper">
          <div>Child 1</div>
          <div>Child 2</div>
        </PageWrapper>
      );

      const wrapper = screen.getByTestId("page-wrapper");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle("display: flex");
      expect(wrapper).toHaveStyle("flex-direction: column");
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });
  });

  describe("TableCard", () => {
    it("renders with background and padding styles", () => {
      render(
        <TableCard data-testid="table-card">
          <div>Table content</div>
        </TableCard>
      );

      const card = screen.getByTestId("table-card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveStyle("background: #ffffff");
      expect(card).toHaveStyle("padding: 24px");
      expect(screen.getByText("Table content")).toBeInTheDocument();
    });
  });

  describe("ActionsBar", () => {
    it("renders with flex layout for actions", () => {
      render(
        <ActionsBar data-testid="actions-bar">
          <button>Add</button>
          <button>Filter</button>
        </ActionsBar>
      );

      const bar = screen.getByTestId("actions-bar");
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveStyle("display: flex");
      expect(screen.getByText("Add")).toBeInTheDocument();
      expect(screen.getByText("Filter")).toBeInTheDocument();
    });
  });

  describe("PaginationBar", () => {
    it("renders with right-aligned flex layout", () => {
      render(
        <PaginationBar data-testid="pagination-bar">
          <div>Page info</div>
          <div>Page controls</div>
        </PaginationBar>
      );

      const bar = screen.getByTestId("pagination-bar");
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveStyle("display: flex");
      expect(bar).toHaveStyle("justify-content: flex-end");
      expect(screen.getByText("Page info")).toBeInTheDocument();
      expect(screen.getByText("Page controls")).toBeInTheDocument();
    });
  });

  describe("EllipsisText", () => {
    it("renders text with ellipsis styles", () => {
      render(
        <EllipsisText data-testid="ellipsis-text">
          Very long text that should be truncated with ellipsis
        </EllipsisText>
      );

      const text = screen.getByTestId("ellipsis-text");
      expect(text).toBeInTheDocument();
      expect(text).toHaveStyle("overflow: hidden");
      expect(text).toHaveStyle("text-overflow: ellipsis");
      expect(text).toHaveStyle("white-space: nowrap");
      expect(text).toHaveTextContent(
        "Very long text that should be truncated with ellipsis"
      );
    });

    it("handles short text without issues", () => {
      render(<EllipsisText data-testid="ellipsis-text">Short</EllipsisText>);

      const text = screen.getByTestId("ellipsis-text");
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent("Short");
    });
  });

  describe("DetailLink", () => {
    it("renders as a Link with correct styling", () => {
      renderWithRouter(
        <DetailLink to="/details/123" data-testid="detail-link">
          View Details
        </DetailLink>
      );

      const link = screen.getByTestId("detail-link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/details/123");
      expect(link).toHaveStyle("color: #1890ff");
      expect(link).toHaveTextContent("View Details");
    });

    it("navigates to the correct path", () => {
      renderWithRouter(<DetailLink to="/quest/123">Go to Quest</DetailLink>);

      const link = screen.getByRole("link", { name: "Go to Quest" });
      expect(link).toHaveAttribute("href", "/quest/123");
    });

    it("handles relative paths", () => {
      renderWithRouter(<DetailLink to="../parent">Back to Parent</DetailLink>);

      const link = screen.getByRole("link", { name: "Back to Parent" });
      // React Router resolves relative paths, so it becomes absolute
      expect(link).toHaveAttribute("href", "/parent");
    });

    it("works with query parameters", () => {
      renderWithRouter(
        <DetailLink to="/search?q=test">Search Results</DetailLink>
      );

      const link = screen.getByRole("link", { name: "Search Results" });
      expect(link).toHaveAttribute("href", "/search?q=test");
    });
  });
});
