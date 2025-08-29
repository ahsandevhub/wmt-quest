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

  it("shows required validation messages when fields are empty and form is submitted", async () => {
    render(
      <Form>
        <LoginFields />
      </Form>
    );
    // Submit the form
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
    // Wait for validation messages to appear
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });
});
