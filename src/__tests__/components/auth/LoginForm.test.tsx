import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "antd";
import { vi } from "vitest";
import LoginForm from "../../../components/auth/LoginForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        logoAlt: "WeMasterTrade Logo",
        signIn: "Sign In",
        requiredUsername: "Username is required",
        requiredPassword: "Password is required",
        usernamePlaceholder: "Enter your username",
        passwordPlaceholder: "Enter your password",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock LoginFields to avoid duplicate field rendering logic
vi.mock("../../../components/auth/LoginFields", () => ({
  __esModule: true,
  default: () => (
    <>
      <Form.Item name="username">
        <input name="username" placeholder="Enter your username" />
      </Form.Item>
      <Form.Item name="password">
        <input
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </Form.Item>
    </>
  ),
}));

describe("LoginForm", () => {
  it("renders logo, fields, and submit button", () => {
    render(<LoginForm isSubmitting={false} onSubmit={vi.fn()} />);
    expect(screen.getByAltText("WeMasterTrade Logo")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("shows error message when errorMessage prop is provided", () => {
    render(
      <LoginForm
        isSubmitting={false}
        errorMessage="Invalid credentials"
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("calls onSubmit with form values when submitted", async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm isSubmitting={false} onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "testpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpass",
      });
    });
  });

  it("shows loading spinner and loading class when isSubmitting is true", () => {
    render(<LoginForm isSubmitting={true} onSubmit={vi.fn()} />);
    const button = screen.getByRole("button", { name: /sign in/i });
    // Check for loading spinner icon
    expect(button.querySelector(".ant-btn-loading-icon")).toBeInTheDocument();
    // Check for loading class
    expect(button.className).toMatch(/ant-btn-loading/);
  });
});
