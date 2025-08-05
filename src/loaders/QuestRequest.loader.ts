import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../lib/api/axiosInstance";

export async function questRequestLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 10);
  const keywords = url.searchParams.get("keywords") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const payload = {
    page,
    limit,
    keywords: keywords || undefined,
    sortFields: [{ fieldName: "createdAt", order: "DESC" }],
    submittedDate: from && to ? { from, to } : undefined,
  };

  const res = await api.post("/api/v1/wmt/point-request/search", payload);

  return {
    data: res.data.data,
    totalItems: res.data.paging.totalItem,
    filters: { page, limit, keywords, from, to },
  };
}
