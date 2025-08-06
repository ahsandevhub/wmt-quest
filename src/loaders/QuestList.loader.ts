import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../lib/api/axiosInstance";

export async function questListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "10");
  const keywords = url.searchParams.get("keywords") || "";
  const status = url.searchParams.get("status") || "";

  const statusFilter =
    status === "true" ? true : status === "false" ? false : undefined;

  const payload = {
    page,
    limit,
    keywords,
    sortFields: [{ fieldName: "createdAt", order: "DESC" }],
    status: statusFilter,
  };

  const res = await api.post(
    `${import.meta.env.VITE_API_BASE}/api/v1/wmt/quest/search`,
    payload
  );

  return {
    quests: res.data.data,
    totalItems: res.data.paging.totalItem,
    filters: {
      page,
      limit,
      keywords,
      status,
    },
  };
}
