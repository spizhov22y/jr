import { test, expect } from "@playwright/test";

test("Second", async ({ page }) => {
  await page.goto("https://maxweb.studio/");
  const page1Promise = page.waitForEvent("popup");
  await page
    .locator("li")
    .filter({ hasText: "J&RWoodwork(Responsive App)🛒" })
    .getByRole("link")
    .click();
  const page1 = await page1Promise;
  await page1.getByRole("link", { name: "Kitchens", exact: true }).click();
  await page1
    .locator("li")
    .filter({ hasText: "Kitchen 01View Project" })
    .getByRole("link")
    .click();

  // Navigating through slides
  for (let i = 0; i < 12; i++) {
    await page1.getByLabel("Button next slide").first().click();
  }

  await page1.getByRole("link", { name: "All" }).click();
  await page1.getByRole("link", { name: "Wardrobes" }).click();
  await page1.getByRole("link", { name: "View Project" }).click();
  await page1.getByLabel("Button next slide").first().click();

  // Closing the pages explicitly
  await page1.close();
  await page.close();
});
