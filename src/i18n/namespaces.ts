export const namespaces = {
  general: "general",
  header: "header",
  sidebar: "sidebar",
  login: "login",
  questList: "questList",
  addNewQuest: "addNewQuest",
  questDetail: "questDetail",
  questRequestList: "questRequestList",
  questRequestDetail: "questRequestDetail",
  notFound: "notFound",
  quickTabs: "quickTabs",
  labels: "labels",
} as const;

export type NamespaceKey = keyof typeof namespaces;
export const allNamespaces: string[] = Object.values(namespaces);
