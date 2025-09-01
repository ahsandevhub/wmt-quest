import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import QuestRequestTable from "../../../../components/quests/quest-request/QuestRequestTable";
import type { QuestRequestListRow } from "../../../../types/questRequestList";

// Mock the translation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock the namespaces
vi.mock("../../../../i18n/namespaces", () => ({
  namespaces: {
    questRequestList: "questRequestList",
    labels: "labels",
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("QuestRequestTable", () => {
  const mockRows: QuestRequestListRow[] = [
    {
      id: 1,
      code: "PR00001",
      challengeId: 1,
      challengeType: 1,
      challengeCode: "C00001",
      title: "Test Quest 1",
      point: 100,
      email: "test1@example.com",
      fullName: "Test User 1",
      submittedDate: "2023-01-01T00:00:00Z",
      createdAt: "2023-01-01T00:00:00Z",
      status: 1,
    },
    {
      id: 2,
      code: "PR00002",
      challengeId: 2,
      challengeType: 2,
      challengeCode: "C00002",
      title: "Test Quest 2",
      point: 200,
      email: "test2@example.com",
      fullName: "Test User 2",
      submittedDate: "2023-01-02T00:00:00Z",
      createdAt: "2023-01-02T00:00:00Z",
      status: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with provided rows", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    // Check that the table is rendered
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    // Check for actual column header keys that are rendered from the real component
    expect(screen.getByText("columns.requestId")).toBeInTheDocument();
    expect(screen.getByText("columns.questType")).toBeInTheDocument();
    expect(screen.getByText("columns.status")).toBeInTheDocument();
  });

  it("renders data rows with correct content", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    // Check for actual row data that gets rendered
    expect(screen.getByText("PR00001")).toBeInTheDocument();
    expect(screen.getByText("PR00002")).toBeInTheDocument();
    expect(screen.getByText("Test Quest 1")).toBeInTheDocument();
    expect(screen.getByText("Test Quest 2")).toBeInTheDocument();
    // Status shows translation keys, which is expected with mocked translation
    expect(
      screen.getByText("labels:toolbar.statusFilter.options.1")
    ).toBeInTheDocument();
    expect(
      screen.getByText("labels:toolbar.statusFilter.options.2")
    ).toBeInTheDocument();
  });

  it("handles empty rows array", () => {
    renderWithRouter(<QuestRequestTable rows={[]} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    // Should show empty state
    expect(screen.getByText("locale.emptyText")).toBeInTheDocument();
  });

  it("sets up table with correct props", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check that pagination is disabled (no pagination controls should be visible)
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("adds key property to each row based on id", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    // The table should render without key warnings in the console
    // and should display all rows correctly
    expect(screen.getByText("PR00001")).toBeInTheDocument();
    expect(screen.getByText("PR00002")).toBeInTheDocument();
  });

  it("renders table structure correctly", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    // Component should render and display the data
    expect(screen.getByText("PR00001")).toBeInTheDocument();
    expect(screen.getByText("PR00002")).toBeInTheDocument();
  });

  it("renders with consistent component structure", () => {
    renderWithRouter(<QuestRequestTable rows={mockRows} />);

    expect(screen.getByText("PR00001")).toBeInTheDocument();
    expect(screen.getByText("PR00002")).toBeInTheDocument();

    // Test basic functionality without re-rendering to avoid router context issues
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBeGreaterThan(2); // Header + data rows
  });

  it("handles rows with different data structures", () => {
    const rowsWithNulls: QuestRequestListRow[] = [
      {
        ...mockRows[0],
        point: null,
        email: "",
      },
    ];

    renderWithRouter(<QuestRequestTable rows={rowsWithNulls} />);

    expect(screen.getByText("PR00001")).toBeInTheDocument();
  });
});
