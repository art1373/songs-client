import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await expect(page.getByText(/Music/i)).toBeVisible();
});

test("adding a song", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.getByRole("textbox", { name: "Song Name" }).fill("Test Song");
  await page.getByRole("textbox", { name: "Artist Name" }).fill("Test Artist");
  await page.getByRole("button", { name: "Add Song" }).click();

  await page.waitForTimeout(4000); // Wait for the song to be added
  await expect(page.getByRole("heading", { name: "Test Song" })).toBeVisible();
});
