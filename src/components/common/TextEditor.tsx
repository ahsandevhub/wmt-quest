import { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { EditorWrapper } from "./TextEditor.styles";

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
    () => ["bold", "italic", "strike", "size", "color", "link", "list"],
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
