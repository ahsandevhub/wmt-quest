import dayjs, { Dayjs } from "dayjs";

export const isFutureOrToday = (value?: Dayjs) =>
  !value || value.isSame(dayjs(), "day") || value.isAfter(dayjs(), "day");

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validatePoint(value: unknown) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "enterPoint";
  if (!Number.isInteger(value)) return "pointInteger";
  if ((value as number) < 1 || (value as number) > 100000) return "pointRange";
  return null;
}
