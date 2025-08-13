import type { Dayjs } from "dayjs";
import { isFutureOrToday, validatePoint } from "./validators";

// Reusable field rule builders to reduce duplication in forms
export function futureDateRule(errorMessage: string) {
  return {
    validator: (_: unknown, value: Dayjs | undefined) =>
      isFutureOrToday(value)
        ? Promise.resolve()
        : Promise.reject(new Error(errorMessage)),
  };
}

export function pointRules(t: (k: string, vars?: any) => string) {
  return [
    { required: true, message: t("validation.enterPoint") },
    {
      validator: (_: unknown, value: number) => {
        const code = validatePoint(value);
        if (!code) return Promise.resolve();
        return Promise.reject(
          new Error(
            code === "pointRange"
              ? t("validation.pointRange", { min: 1, max: 100000 })
              : t(`validation.${code}`)
          )
        );
      },
    },
  ];
}

export function descriptionRules(t: (k: string, vars?: any) => string) {
  return [
    { required: true, message: t("validation.enterDescription") },
    {
      validator: (_: unknown, value: string) => {
        const text = value?.replace(/<[^>]+>/g, "") || "";
        if (!text.trim())
          return Promise.reject(t("validation.enterDescription"));
        if (text.length > 2000)
          return Promise.reject(
            t("validation.descriptionMax", { count: 2000 })
          );
        return Promise.resolve();
      },
    },
  ];
}
