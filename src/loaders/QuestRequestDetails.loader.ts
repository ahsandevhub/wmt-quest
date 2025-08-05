import type { LoaderFunction } from "react-router-dom";
import api from "../lib/api/axiosInstance";
import type { QuestRequest } from "../types/questRequest";

export const questRequestDetailLoader: LoaderFunction = async ({ params }) => {
  const id = params.questRequestId;
  if (!id) {
    // you can throw a Response to show a 400 in your errorElement
    throw new Response("Missing questRequestId", { status: 400 });
  }

  // match your API response: { success, message, code, data }
  const res = await api.get<{
    success: boolean;
    message: string;
    code: string;
    data: QuestRequest;
  }>(`/api/v1/wmt/point-request/${id}`);

  return res.data.data;
};
