import { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";

export type TextEditorOnChange = (
  html: string,
  delta: any,
  source: "user" | "api" | "silent"
) => void;

export interface TextEditorProps {
  value?: string; // controlled HTML
  defaultValue?: string; // uncontrolled initial HTML
  readOnly?: boolean;
  placeholder?: string;
  onChange?: TextEditorOnChange; // returns HTML for saving
  className?: string;
}

const EditorWrapper = styled.div`
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

export default function TextEditor({
  value,
  defaultValue,
  readOnly = false,
  placeholder = "Enter your text here…",
  onChange,
  className,
}: TextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "strike"],
        [{ size: [] }],
        [{ color: [] }],
        ["link"],
        [{ list: "bullet" }],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "bold",
      "italic",
      "strike",
      "size",
      "color",
      "link",
      "list",
      "bullet",
    ],
    []
  );

  return (
    <EditorWrapper className={className}>
      <ReactQuill
        theme="snow"
        readOnly={readOnly}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        value={value}
        defaultValue={defaultValue}
        onChange={(content, delta, source) =>
          onChange?.(content, delta, source)
        }
      />
    </EditorWrapper>
  );
}
