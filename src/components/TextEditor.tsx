// src/components/TextEditor.tsx
import type { Delta } from "quill";
import Sources from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

export interface TextEditorProps {
  /** Initial HTML content */
  defaultValue?: string;
  /** Called on each text change */
  onChange?: (html: string, delta: Delta, source: Sources, editor: any) => void;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  placeholder?: string;
}

const EditorWrapper = styled.div`
  .ql-container {
    height: 200px;
    max-height: 300px;
    width: 100%;
    box-sizing: border-box;
  }

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

const TextEditor = forwardRef<any, TextEditorProps>(
  (
    {
      defaultValue = "",
      onChange,
      readOnly = false,
      placeholder = "Enter your text here...",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || container.firstChild) return;
      const editorDiv = document.createElement("div");
      container.appendChild(editorDiv);

      import("quill").then(({ default: Quill }) => {
        const quill = new Quill(editorDiv, {
          theme: "snow",
          readOnly,
          placeholder,
          modules: {
            toolbar: [
              ["bold", "italic", "strike"],
              [{ size: [] }],
              [{ color: [] }],
              ["link"],
              [{ list: "bullet" }],
            ],
          },
        });

        quillRef.current = quill;
        if (ref) {
          if (typeof ref === "function") ref(quill);
          else ref.current = quill;
        }

        quill.clipboard.dangerouslyPasteHTML(defaultValue);
        quill.on(
          "text-change",
          (delta: Delta, oldDelta: Delta, source: Sources) => {
            onChange?.(quill.root.innerHTML, delta, source, quill);
          }
        );
      });

      return () => {
        quillRef.current = null;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    }, []);

    useLayoutEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    useEffect(() => {
      const quill = quillRef.current;
      if (quill && quill.root.innerHTML !== defaultValue) {
        quill.clipboard.dangerouslyPasteHTML(defaultValue);
      }
    }, [defaultValue]);

    return <EditorWrapper ref={containerRef} />;
  }
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
