import { GiftOutlined, TagOutlined, TrophyOutlined } from "@ant-design/icons";
import type { NavSection } from "../sidebar/SidebarMenu";

export function buildSidebarSections(t: (k: string) => string): NavSection[] {
  return [
    {
      key: "quests",
      icon: <TrophyOutlined />,
      title: t("quests"),
      items: [
        {
          key: "quest-list",
          label: t("questList"),
          path: "/quest/quest-list",
        },
        {
          key: "welcome-quests",
          label: t("welcomeQuests"),
          path: "/quest/welcome",
        },
        {
          key: "quest-requests",
          label: t("questRequests"),
          path: "/quest/quest-requests",
        },
        { key: "redeem", label: t("redeem"), path: "/quest/redeem" },
        {
          key: "quest-config",
          label: t("questConfig"),
          path: "/quest/configuration",
        },
        {
          key: "tournament-quests",
          label: t("tournamentQuests"),
          path: "/quest/tournament",
        },
      ],
    },
    {
      key: "discount",
      icon: <TagOutlined />,
      title: t("discount"),
      items: [
        { key: "discount-main", label: t("discountMain"), path: "/discount" },
        { key: "ap-discount", label: t("apDiscount"), path: "/discount/ap" },
        {
          key: "discount-config",
          label: t("discountConfig"),
          path: "/discount/configuration",
        },
      ],
    },
    {
      key: "blindbox",
      icon: <GiftOutlined />,
      title: t("blindbox"),
      items: [
        { key: "box-list", label: t("boxList"), path: "/blindbox" },
        {
          key: "secret-config",
          label: t("secretConfig"),
          path: "/blindbox/secret",
        },
        {
          key: "probability",
          label: t("probability"),
          path: "/blindbox/probability",
        },
        { key: "spin-config", label: t("spinConfig"), path: "/blindbox/spin" },
        { key: "rewards", label: t("rewards"), path: "/blindbox/rewards" },
      ],
    },
  ];
}
