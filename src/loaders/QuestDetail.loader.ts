import type { LoaderFunctionArgs } from "react-router-dom";
import api from "../services/http";

export async function questDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("Quest ID is required");

  const res = await api.get(`/api/v1/wmt/quest/${id}`);
  return res.data.data;
}
