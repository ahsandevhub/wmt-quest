import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-quill-new to a lightweight textarea that forwards props and simulates onChange
vi.mock("react-quill-new", () => ({
  __esModule: true,
  default: (props: any) => {
    const {
      value,
      defaultValue,
      readOnly,
      placeholder,
      modules,
      formats,
      onChange,
    } = props;
    return (
      <textarea
        data-testid="quill"
        data-value={value}
        data-defaultvalue={defaultValue}
        data-readonly={String(!!readOnly)}
        data-placeholder={placeholder}
        data-modules={JSON.stringify(modules)}
        data-formats={JSON.stringify(formats)}
        onChange={(e) => {
          // Simulate Quill onChange signature: (content, delta, source)
          const content = e.target.value;
          const delta = { ops: [] };
          onChange?.(content, delta, "user");
        }}
      />
    );
  },
}));

import TextEditor from "../../../components/common/TextEditor";

describe("TextEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes value and formats/modules to ReactQuill mock", () => {
    render(<TextEditor value="<p>hello</p>" className="my-editor" />);

    const quill = screen.getByTestId("quill");
    expect(quill).toHaveAttribute("data-value", "<p>hello</p>");

    // modules and formats are passed as JSON strings; ensure they exist
    const modules = JSON.parse(quill.getAttribute("data-modules") || "{}");
    expect(modules).toHaveProperty("toolbar");

    const formats = JSON.parse(quill.getAttribute("data-formats") || "[]");
    expect(Array.isArray(formats)).toBe(true);
  });

  it("uses defaultValue when value is not provided", () => {
    render(<TextEditor defaultValue="<p>init</p>" />);

    const quill = screen.getByTestId("quill");
    expect(quill).toHaveAttribute("data-defaultvalue", "<p>init</p>");
  });

  it("forwards readOnly and placeholder props", () => {
    render(<TextEditor readOnly placeholder="Type here" />);

    const quill = screen.getByTestId("quill");
    expect(quill).toHaveAttribute("data-readonly", "true");
    expect(quill).toHaveAttribute("data-placeholder", "Type here");
  });

  it("calls onChange with content, delta and source when editor changes", () => {
    const handleChange = vi.fn();
    render(<TextEditor onChange={handleChange} />);

    const quill = screen.getByTestId("quill");
    fireEvent.change(quill, { target: { value: "<p>new</p>" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const [content, delta, source] = handleChange.mock.calls[0];
    expect(content).toBe("<p>new</p>");
    expect(delta).toBeDefined();
    expect(source).toBe("user");
  });
});
