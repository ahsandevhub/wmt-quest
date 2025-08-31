import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "profile.myProfile": "My Profile",
        "profile.logoutButton": "Logout",
      };
      return map[key] ?? key;
    },
  }),
}));

// Partially mock antd to render a Dropdown we can interact with in tests
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    Dropdown: (props: any) => (
      <div data-testid="dropdown">
        {props.children}
        {props.menu?.items
          ?.filter((it: any) => it && it.key)
          .map((item: any) => (
            <button
              key={item.key}
              onClick={() => props.menu?.onClick?.({ key: item.key })}
            >
              {typeof item.label === "string" ? item.label : String(item.label)}
            </button>
          ))}
      </div>
    ),
  };
});

import ProfileMenu from "../../../../../src/components/common/header/ProfileMenu";

describe("ProfileMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar trigger", () => {
    render(<ProfileMenu onProfile={() => {}} onLogout={() => {}} />);
    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
    // Avatar contains the user icon svg
    expect(dropdown.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onProfile and onLogout when menu items are clicked", () => {
    const onProfile = vi.fn();
    const onLogout = vi.fn();
    render(<ProfileMenu onProfile={onProfile} onLogout={onLogout} />);

    // Buttons rendered from mocked Dropdown
    const profileBtn = screen.getByText("My Profile");
    const logoutBtn = screen.getByText("Logout");

    fireEvent.click(profileBtn);
    expect(onProfile).toHaveBeenCalled();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });
});
