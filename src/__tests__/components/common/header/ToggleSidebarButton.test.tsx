import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "actions.expandSidebar": "Expand sidebar",
        "actions.collapseSidebar": "Collapse sidebar",
      };
      return map[key] ?? key;
    },
  }),
}));

import ToggleSidebarButton from "../../../../../src/components/common/header/ToggleSidebarButton";

describe("ToggleSidebarButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows expand aria-label when collapsed is true and calls onToggle", () => {
    const onToggle = vi.fn();
    render(<ToggleSidebarButton collapsed={true} onToggle={onToggle} />);

    const btn = screen.getByLabelText("Expand sidebar");
    expect(btn).toBeInTheDocument();
    expect(btn.querySelector("svg")).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });

  it("shows collapse aria-label when collapsed is false and calls onToggle", () => {
    const onToggle = vi.fn();
    render(<ToggleSidebarButton collapsed={false} onToggle={onToggle} />);

    const btn = screen.getByLabelText("Collapse sidebar");
    expect(btn).toBeInTheDocument();
    expect(btn.querySelector("svg")).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });
});
