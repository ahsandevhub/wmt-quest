import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Keep a mutable currentLanguage and spy on changeLanguage
const changeLanguage = vi.fn();
let currentLanguage = "en";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "language.english": "English",
        "language.bengali": "Bengali",
      };
      return map[key] ?? key;
    },
    i18n: {
      get language() {
        return currentLanguage;
      },
      changeLanguage: changeLanguage,
    },
  }),
}));

// Partially mock antd Dropdown so we can render menu items as real buttons
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    Dropdown: (props: any) => (
      <div data-testid="dropdown">
        {props.children}
        {/* render menu items as buttons that call the provided onClick */}
        {props.menu?.items?.map((item: any) => (
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

import LanguageSwitcher from "../../../../../src/components/common/header/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLanguage = "en";
  });

  it("shows the current language label", () => {
    currentLanguage = "en";
    const { rerender } = render(<LanguageSwitcher />);
    const dropdown = screen.getByTestId("dropdown");
    const triggerSpans = dropdown.querySelectorAll("div span");
    // first span is the icon, second is the language label
    expect(triggerSpans.length).toBeGreaterThan(1);
    expect(triggerSpans[1].textContent).toBe("English");

    // switch to bengali and re-render
    currentLanguage = "bn";
    rerender(<LanguageSwitcher />);
    const triggerSpansBn = screen
      .getByTestId("dropdown")
      .querySelectorAll("div span");
    expect(triggerSpansBn[1].textContent).toBe("Bengali");
  });

  it("calls i18n.changeLanguage when a language is selected", () => {
    render(<LanguageSwitcher />);
    // our mocked Dropdown renders buttons with the labels
    const bengaliBtn = screen.getByText("Bengali");
    fireEvent.click(bengaliBtn);
    expect(changeLanguage).toHaveBeenCalledWith("bn");
  });
});
