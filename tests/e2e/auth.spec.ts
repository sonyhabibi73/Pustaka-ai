import { expect, test } from "@playwright/test";

test("sign-in page renders the Google hand-off without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: /masuk untuk mulai belajar/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /lanjutkan dengan google/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /pelajari/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the workspace sends unauthenticated visitors to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
});
