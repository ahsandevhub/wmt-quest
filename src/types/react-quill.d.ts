declare module "react-quill" {
  import { Component } from "react";

  interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    modules?: object;
    theme?: string;
    readOnly?: boolean;
    preserveWhitespace?: boolean;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    focus: () => void;
    getEditor: () => any;
  }
}
