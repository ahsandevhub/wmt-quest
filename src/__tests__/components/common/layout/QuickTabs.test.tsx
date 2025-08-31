import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock react-i18next translations used by the component
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "tabs.currentPage": "Current Page",
        "tabs.otherPage": "Other Page",
      };
      return map[key] ?? key;
    },
  }),
}));

import QuickTabs from "../../../../components/common/layout/QuickTabs";

describe("QuickTabs", () => {
  it("renders two buttons with translated labels", () => {
    render(<QuickTabs />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    expect(buttons[0]).toHaveTextContent("Current Page");
    expect(buttons[1]).toHaveTextContent("Other Page");
  });

  it("buttons are clickable without throwing", () => {
    render(<QuickTabs />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    // basic assertion to ensure DOM still contains the buttons
    expect(buttons[0]).toBeInTheDocument();
  });
});
