import styled from "styled-components";

export const EditorWrapper = styled.div`
  .ql-toolbar.ql-snow {
    border: 1px solid #d9d9d9;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    background-color: #fafafa;
  }
  .ql-container.ql-snow {
    border: 1px solid #d9d9d9;
    border-radius: 0 0 6px 6px;
    transition: border-color 0.3s, box-shadow 0.3s;
    &:hover {
      border-color: #4096ff;
    }
    &:focus-within {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    }
  }
  .ql-editor {
    min-height: 120px;
    padding: 8px 12px;
  }
`;
