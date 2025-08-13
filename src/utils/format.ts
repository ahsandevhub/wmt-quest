import dayjs from "dayjs";

export const formatDate = (iso?: string | null, fallback = "-") =>
  iso ? dayjs(iso).format("MM/DD/YYYY HH:mm:ss") : fallback;
