import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // 4 worker paralel membuat 4 Chromium rebutan RAM dan memicu timeout
  // goto di mesin berdaya terbatas; 2 worker tetap cepat (< 10 detik) dan stabil.
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Keep WebKit's viewport/touch characteristics but run on the browser
    // binary installed in CI, so the suite needs only `playwright install chromium`.
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
