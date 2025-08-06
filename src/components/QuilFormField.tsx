import type Quill from "quill";
import { useRef } from "react";
import TextEditor from "./TextEditor";

export const QuillFormField: React.FC<{
  value?: string;
  onChange?: (html: string) => void;
}> = ({ value = "", onChange }) => {
  const ref = useRef<Quill | null>(null);
  return (
    <TextEditor
      ref={ref}
      defaultValue={value}
      onTextChange={() => {
        const html = ref.current?.root.innerHTML ?? "";
        onChange?.(html);
      }}
    />
  );
};
