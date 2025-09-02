import { render, screen } from "@testing-library/react";
import { Form } from "antd";
import { vi } from "vitest";
import LoginFields from "../../../components/auth/LoginFields";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        requiredUsername: "Username is required",
        requiredPassword: "Password is required",
        usernamePlaceholder: "Enter your username",
        passwordPlaceholder: "Enter your password",
      };
      return translations[key] || key;
    },
  }),
}));

describe("LoginFields", () => {
  it("renders username and password fields with correct placeholders and icons", () => {
    render(
      <Form>
        <LoginFields />
      </Form>
    );
    // Username field
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    // Password field
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    // Icons
    expect(document.querySelector(".anticon-user")).toBeInTheDocument();
    expect(document.querySelector(".anticon-lock")).toBeInTheDocument();
  });
});
