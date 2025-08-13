import { Grid } from "antd";
import { useMemo } from "react";
import { QUEST_FORM_LABEL_COL_WIDTH } from "../constants/form";

// Provides consistent responsive layout props for AntD Form across quest forms
export function useResponsiveFormLayout() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  return useMemo(
    () =>
      isMobile
        ? { layout: "vertical" as const, colon: true }
        : {
            layout: "horizontal" as const,
            colon: true,
            labelCol: { flex: `0 0 ${QUEST_FORM_LABEL_COL_WIDTH}px` },
            wrapperCol: { flex: "1 1 0%" },
          },
    [isMobile]
  );
}
