import { expect, test } from "@playwright/test";

test("landing page is usable without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /materi anda/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /mulai belajar/i })).toBeVisible();
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByRole("link", { name: /masuk/i })).toBeVisible();
  expect(errors).toEqual([]);
});
