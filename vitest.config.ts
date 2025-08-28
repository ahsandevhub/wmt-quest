import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
    // Exclude E2E tests from Vitest (they run with Node.js/Selenium)
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.e2e.*"],
  },
});
