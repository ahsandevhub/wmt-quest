import styled from "styled-components";

export const FiltersFormWrapper = styled.div`
  width: 100%;
`;

export const ToolbarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    > * {
      width: 100%;
    }
  }
`;

export const FieldWrap = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  min-width: 0;
  white-space: nowrap;

  span {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ControlWrap = styled.div`
  width: clamp(260px, 34vw, 420px);
  min-width: 0;
  justify-self: start;

  .ant-input-group-wrapper,
  .ant-input-group,
  .ant-input-affix-wrapper,
  .ant-select,
  .ant-select-selector {
    width: 100%;
    min-width: 0;
  }
  .ant-input {
    min-width: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    > * {
      flex: 1;
    }
  }
`;
