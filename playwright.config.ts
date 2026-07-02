import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  timeout: 90_000,
  expect: {
    timeout: 20_000,
  },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      AI_PROVIDER: "mock",
      AI_GENERATION_ENABLED: "false",
      AI_REQUEST_TIMEOUT_MS: "5000",
      AI_RATE_LIMIT_ENABLED: "true",
      AI_RATE_LIMIT_MAX_REQUESTS: "5",
      AI_RATE_LIMIT_WINDOW_MS: "60000",
      OPENAI_API_KEY: "",
      GEMINI_API_KEY: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
