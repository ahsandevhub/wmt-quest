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
          label: t("quest_list"),
          path: "/quest/quest-list",
        },
        {
          key: "welcome-quests",
          label: t("welcome_quests"),
          path: "/quest/welcome",
        },
        {
          key: "quest-requests",
          label: t("quest_requests"),
          path: "/quest/quest-requests",
        },
        { key: "redeem", label: t("redeem"), path: "/quests/redeem" },
        {
          key: "quest-config",
          label: t("quest_config"),
          path: "/quests/configuration",
        },
        {
          key: "tournament-quests",
          label: t("tournament_quests"),
          path: "/quests/tournament",
        },
      ],
    },
    {
      key: "discount",
      icon: <TagOutlined />,
      title: t("discount"),
      items: [
        { key: "discount-main", label: t("discount_main"), path: "/discount" },
        { key: "ap-discount", label: t("ap_discount"), path: "/discount/ap" },
        {
          key: "discount-config",
          label: t("discount_config"),
          path: "/discount/configuration",
        },
      ],
    },
    {
      key: "blindbox",
      icon: <GiftOutlined />,
      title: t("blindbox"),
      items: [
        { key: "box-list", label: t("box_list"), path: "/blindbox" },
        {
          key: "secret-config",
          label: t("secret_config"),
          path: "/blindbox/secret",
        },
        {
          key: "probability",
          label: t("probability"),
          path: "/blindbox/probability",
        },
        { key: "spin-config", label: t("spin_config"), path: "/blindbox/spin" },
        { key: "rewards", label: t("rewards"), path: "/blindbox/rewards" },
      ],
    },
  ];
}
