// src/components/TextEditor.tsx
import {
  Delta,
  default as Quill,
  default as RangeStatic,
  default as Sources,
} from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

export interface TextEditorProps {
  readOnly?: boolean;
  defaultValue?: Delta | { ops: any[] } | string;
  placeholder?: string;
  onTextChange?: (delta: Delta, oldDelta: Delta, source: Sources) => void;
  onSelectionChange?: (
    range: RangeStatic | null,
    oldRange: RangeStatic | null,
    source: Sources
  ) => void;
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

const TextEditor = forwardRef<Quill | undefined, TextEditorProps>(
  (
    {
      readOnly = false,
      defaultValue,
      placeholder = "Enter your text here…",
      onTextChange,
      onSelectionChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // keep callbacks up-to-date
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    // toggle readonly dynamically
    useEffect(() => {
      const quill = (ref as React.MutableRefObject<Quill | undefined>).current;
      quill?.enable(!readOnly);
    }, [readOnly, ref]);

    // initialize Quill once
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorDiv = document.createElement("div");
      container.appendChild(editorDiv);

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

      // expose via ref
      (ref as React.MutableRefObject<Quill | undefined>).current = quill;

      // set initial content
      if (defaultValueRef.current) {
        if (typeof defaultValueRef.current === "string") {
          quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current);
        } else if ((defaultValueRef.current as any).ops) {
          quill.setContents(defaultValueRef.current as Delta);
        }
      }

      // disabled autofocus
      quill.blur();

      // wire up events
      quill.on(
        Quill.events.TEXT_CHANGE,
        (delta: Delta, oldDelta: Delta, source: Sources) => {
          onTextChangeRef.current?.(delta, oldDelta, source);
        }
      );

      quill.on(
        Quill.events.SELECTION_CHANGE,
        (
          range: RangeStatic | null,
          oldRange: RangeStatic | null,
          source: Sources
        ) => {
          onSelectionChangeRef.current?.(range, oldRange, source);
        }
      );

      return () => {
        // cleanup
        container.innerHTML = "";
        (ref as React.MutableRefObject<Quill | undefined>).current = undefined;
      };
    }, [ref, placeholder, readOnly]);

    return <EditorWrapper ref={containerRef} />;
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
