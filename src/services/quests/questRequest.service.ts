import api from "../http";

export async function approveQuestRequest(id: number) {
  return api.post(`/api/v1/wmt/point-request/${id}/approved`);
}

export async function rejectQuestRequest(id: number, rejectedReason: string) {
  return api.post(`/api/v1/wmt/point-request/${id}/rejected`, {
    rejectedReason: rejectedReason.trim(),
  });
}
