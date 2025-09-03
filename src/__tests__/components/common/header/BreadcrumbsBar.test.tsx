import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import BreadcrumbsBar from "../../../../components/common/header/BreadcrumbsBar";

// Mock react-i18next with an inline-return t() implementation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        home: "Home",
      };
      return translations[key] || key;
    },
    i18n: {} as any,
    ready: true,
  }),
}));

// Mock namespaces
vi.mock("../../../../i18n/namespaces", () => ({
  namespaces: {
    header: "header",
  },
}));

// Test wrapper component
function RouterTestWrapper({
  children,
  initialEntries = ["/"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) {
  return (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
}

describe("BreadcrumbsBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Home route rendering", () => {
    test("should render Home breadcrumb for root path", () => {
      render(
        <RouterTestWrapper initialEntries={["/"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  describe("Single level path handling", () => {
    test("should render single segment correctly", () => {
      render(
        <RouterTestWrapper initialEntries={["/dashboard"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    test("should humanize kebab-case segments properly", () => {
      render(
        <RouterTestWrapper initialEntries={["/add-new-quest"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      expect(screen.getByText("Add New Quest")).toBeInTheDocument();
    });
  });

  describe("Multi-level path navigation", () => {
    test("should render full breadcrumb path on desktop", () => {
      render(
        <RouterTestWrapper initialEntries={["/quest/quest-list/add-new-quest"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      expect(screen.getByText("Quest")).toBeInTheDocument();
      expect(screen.getByText("Quest List")).toBeInTheDocument();
      expect(screen.getByText("Add New Quest")).toBeInTheDocument();
    });

    test("should only show last segment on mobile device", () => {
      render(
        <RouterTestWrapper initialEntries={["/quest/quest-list/add-new-quest"]}>
          <BreadcrumbsBar isMobile={true} />
        </RouterTestWrapper>
      );

      expect(screen.queryByText("Quest")).not.toBeInTheDocument();
      expect(screen.queryByText("Quest List")).not.toBeInTheDocument();
      expect(screen.getByText("Add New Quest")).toBeInTheDocument();
    });

    test("should make intermediate segments clickable links on desktop", () => {
      render(
        <RouterTestWrapper initialEntries={["/quest/quest-list/add-new-quest"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      const questLink = screen.getByRole("link", { name: "Quest" });
      const questListLink = screen.getByRole("link", { name: "Quest List" });

      expect(questLink).toHaveAttribute("href", "/quest");
      expect(questListLink).toHaveAttribute("href", "/quest/quest-list");

      const addNewQuestText = screen.getByText("Add New Quest");
      expect(addNewQuestText.closest("a")).toBeNull();
    });
  });

  describe("Edge case handling", () => {
    test("should handle paths with trailing slashes correctly", () => {
      render(
        <RouterTestWrapper initialEntries={["/dashboard/"]}>
          <BreadcrumbsBar isMobile={false} />
        </RouterTestWrapper>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    test("should apply custom className when provided", () => {
      const { container } = render(
        <RouterTestWrapper initialEntries={["/dashboard"]}>
          <BreadcrumbsBar
            isMobile={false}
            className="custom-breadcrumb-class"
          />
        </RouterTestWrapper>
      );

      const breadcrumbElement = container.querySelector(".ant-breadcrumb");
      expect(breadcrumbElement).toHaveClass("custom-breadcrumb-class");
    });
  });
});
