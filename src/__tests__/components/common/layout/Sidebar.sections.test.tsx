import { describe, expect, it } from "vitest";
import { buildSidebarSections } from "../../../../components/common/layout/Sidebar.sections";

describe("buildSidebarSections", () => {
  it("builds sections and uses translation keys", () => {
    const calls: string[] = [];
    const t = (k: string) => {
      calls.push(k);
      return `translated:${k}`;
    };

    const sections = buildSidebarSections(t);

    // basic structure
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThanOrEqual(3);

    // check first section keys and item presence
    const quests = sections.find((s) => s.key === "quests");
    expect(quests).toBeDefined();
    expect(quests?.items).toBeInstanceOf(Array);
    expect(quests?.items?.some((it) => it.key === "quest-list")).toBe(true);

    // verify labels use our translation results
    const questListItem = quests?.items?.find((it) => it.key === "quest-list");
    expect(questListItem?.label).toBe("translated:questList");
    expect(questListItem?.path).toBe("/quest/quest-list");

    // check another section and item
    const blindbox = sections.find((s) => s.key === "blindbox");
    expect(blindbox).toBeDefined();
    const boxList = blindbox?.items?.find((it) => it.key === "box-list");
    expect(boxList?.label).toBe("translated:boxList");
    expect(boxList?.path).toBe("/blindbox");

    // ensure t was called with a few expected keys
    expect(calls).toContain("quests");
    expect(calls).toContain("questList");
    expect(calls).toContain("redeem");
  });
});
