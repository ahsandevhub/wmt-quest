import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../lib/api/axiosInstance";
// import {
//   QuestRequestStatus,
//   type QuestRequestStatusEnum,
// } from "../types/questRequestStatus";
// import { QuestType, type QuestTypeEnum } from "../types/questType";

export async function questRequestListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 10);
  const keywords = url.searchParams.get("keywords") || "";
  // const statusStr = url.searchParams.get("status")      || "";
  // const typeStr   = url.searchParams.get("questType")   || "";
  const from = url.searchParams.get("startDate") || undefined;
  const to = url.searchParams.get("endDate") || undefined;

  // // parse only if valid enum values
  // const parsedStatus = Number(statusStr) as QuestRequestStatusEnum;
  // const status = Object.values(QuestRequestStatus).includes(parsedStatus)
  //   ? parsedStatus
  //   : undefined;
  //
  // const parsedType = Number(typeStr) as QuestTypeEnum;
  // const questType = Object.values(QuestType).includes(parsedType)
  //   ? parsedType
  //   : undefined;

  const payload = {
    page,
    limit,
    keywords,
    // send filters as API expects
    // ...(status   !== undefined && { status }),
    // ...(questType !== undefined && { questType }),
    submittedDate: { from, to },
    sortFields: [{ fieldName: "createdAt", order: "DESC" }],
  };

  const res = await api.post("/api/v1/wmt/point-request/search", payload);

  return {
    questRequests: res.data.data,
    totalItems: res.data.paging.totalItem,
    filters: {
      page,
      limit,
      keywords,
      // status:    statusStr,
      // questType: typeStr,
      startDate: from,
      endDate: to,
    },
  };
}
