export const namespaces = {
  general: "general",
  header: "header",
  sidebar: "sidebar",
  login: "login",
  questList: "quest_list",
  addNewQuest: "add_new_quest",
  questDetail: "quest_detail",
  questRequestList: "quest_request_list",
  questRequestDetail: "quest_request_detail",
  notFound: "not_found",
  quickTabs: "quick_tabs",
  labels: "labels",
} as const;

export type NamespaceKey = keyof typeof namespaces;
export const allNamespaces: string[] = Object.values(namespaces);
