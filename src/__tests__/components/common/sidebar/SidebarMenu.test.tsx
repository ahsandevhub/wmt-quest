import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

// Mock the styled menu so we can inspect props and render labels
vi.mock("../../../../components/common/sidebar/SidebarMenu.styles", () => ({
  StyledMenu: (props: any) => {
    const {
      items = [],
      selectedKeys = [],
      defaultOpenKeys = [],
      onClick,
    } = props;
    return (
      <div
        data-testid="styled-menu"
        data-selectedkeys={(selectedKeys || []).join(",")}
        data-defaultopenkeys={(defaultOpenKeys || []).join(",")}
        data-onclick={onClick ? "yes" : "no"}
      >
        {Array.isArray(items)
          ? items.map((it: any) => (
              <div key={it.key} data-key={it.key}>
                {/* section label */}
                <div data-testid={`section-${it.key}`}>{it.label}</div>
                {/* children (menu items) */}
                {Array.isArray(it.children)
                  ? it.children.map((child: any) => (
                      <div key={child.key} data-testid={`item-${child.key}`}>
                        {child.label}
                      </div>
                    ))
                  : null}
              </div>
            ))
          : null}
      </div>
    );
  },
}));

import SidebarMenu from "../../../../components/common/sidebar/SidebarMenu";

const sections = [
  {
    key: "quests",
    icon: <span>Q</span>,
    title: "Quests",
    items: [
      { key: "quest-list", label: "Quest List", path: "/quest/quest-list" },
      { key: "quest-req", label: "Quest Req", path: "/quest/quest-req" },
    ],
  },
  {
    key: "blindbox",
    icon: <span>B</span>,
    title: "Blindbox",
    items: [{ key: "box-list", label: "Box List", path: "/blindbox" }],
  },
];

describe("SidebarMenu", () => {
  it("renders items and passes defaultOpenKeys", () => {
    render(
      <MemoryRouter>
        <SidebarMenu sections={sections} currentPath="/" />
      </MemoryRouter>
    );

    // Items should be rendered (labels inside Link -> anchor)
    expect(screen.getByText("Quest List")).toBeInTheDocument();
    expect(screen.getByText("Box List")).toBeInTheDocument();

    const menu = screen.getByTestId("styled-menu");
    // defaultOpenKeys should include section keys
    expect(menu.getAttribute("data-defaultopenkeys")).toContain("quests");
    expect(menu.getAttribute("data-defaultopenkeys")).toContain("blindbox");
  });

  it("selects item when currentPath matches exactly", () => {
    render(
      <MemoryRouter>
        <SidebarMenu sections={sections} currentPath="/quest/quest-list" />
      </MemoryRouter>
    );

    const menu = screen.getByTestId("styled-menu");
    expect(menu.getAttribute("data-selectedkeys")).toBe("quest-list");
  });

  it("selects item when currentPath is nested under item path", () => {
    render(
      <MemoryRouter>
        <SidebarMenu sections={sections} currentPath="/quest/quest-list/123" />
      </MemoryRouter>
    );

    const menu = screen.getByTestId("styled-menu");
    expect(menu.getAttribute("data-selectedkeys")).toBe("quest-list");
  });

  it("passes onItemClick through to StyledMenu onClick prop", () => {
    const onItemClick = vi.fn();
    render(
      <MemoryRouter>
        <SidebarMenu
          sections={sections}
          currentPath="/"
          onItemClick={onItemClick}
        />
      </MemoryRouter>
    );

    const menu = screen.getByTestId("styled-menu");
    expect(menu.getAttribute("data-onclick")).toBe("yes");
  });
});
