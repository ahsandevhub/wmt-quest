import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "notifications" ? "Notifications" : key),
  }),
}));

import NotificationsBell from "../../../../../src/components/common/header/NotificationsBell";

describe("NotificationsBell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a button with aria-label from i18n and shows bell icon", () => {
    render(<NotificationsBell />);

    const btn = screen.getByLabelText("Notifications");
    expect(btn).toBeInTheDocument();
    // should be a button element
    expect(btn.tagName.toLowerCase()).toBe("button");
    // AntD icon should render as an svg inside the button
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });
});
