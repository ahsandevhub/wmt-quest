import dayjs from "dayjs";

/**
 * Format an ISO timestamp into a human readable string.
 * @param iso ISO timestamp string
 * @param fallback Value to show when iso is falsy
 * @param pattern Dayjs format pattern (defaults to list/table style)
 */
export const formatDate = (
  iso?: string | null,
  fallback = "-",
  pattern = "MM/DD/YYYY HH:mm:ss"
) => (iso ? dayjs(iso).format(pattern) : fallback);
