import styled from "styled-components";

/* ================= Styled (Local Only) ================= */
// NOTE: These styles are intentionally NOT shared with quest-list filters
// because quest request filters have unique layout requirements
// (single-line on very large screens >=1440px and custom button alignment).
export const ToolbarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* allow wrapping if overflow */
  align-items: center;
  gap: 20px 28px; /* row gap / column gap */
  background: #fff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;

  /* large screens: keep items inline (they'll wrap only if truly overflowing) */
  @media (min-width: 1440px) {
    flex-wrap: nowrap;
    overflow-x: auto; /* just in case extremely many fields */
  }

  /* small screens: stack */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    > * {
      width: 100%;
    }
  }
`;

export const FieldWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
  min-width: 0;
  white-space: nowrap;

  span {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    /* Keep label + control on one line like QuestFilters small layout */
    flex-direction: row;
    align-items: center;
    gap: 12px;
    span {
      width: auto;
    }
    ${/* ensure control stretches */ ""}
    & > div {
      flex: 1 1 auto;
    }
  }

  @media (min-width: 1440px) {
    flex: 1 1 0; /* let each block grow to consume width */
    & > div {
      flex: 1 1 auto;
    }
  }
`;

export const ControlWrap = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;

  .ant-input-group-wrapper,
  .ant-input-group,
  .ant-input-affix-wrapper,
  .ant-select,
  .ant-select-selector,
  .ant-picker {
    min-width: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    .ant-input-group-wrapper,
    .ant-input-group,
    .ant-input-affix-wrapper,
    .ant-select,
    .ant-select-selector,
    .ant-picker {
      width: 100%;
    }
  }

  @media (min-width: 1440px) {
    width: 100%;
    .ant-input-group-wrapper,
    .ant-input-group,
    .ant-input-affix-wrapper,
    .ant-select,
    .ant-select-selector,
    .ant-picker {
      width: 100%;
    }
  }
`;

export const ButtonRow = styled.div`
  display: inline-flex;
  gap: 12px;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    > * {
      flex: 1;
    }
  }
`;
