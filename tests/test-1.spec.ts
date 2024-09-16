import { test, expect } from "@playwright/test";

test("First", async ({ page }) => {
  await page.goto("https://www.google.com/");
  await page.getByLabel("Search", { exact: true }).click();
  await page.getByLabel("Search", { exact: true }).fill("jrcustomwoodwork ca");
  await page.goto(
    "https://www.google.com/search?q=jrcustomwoodwork+ca&sca_esv=bc17f1d65ef343c6&source=hp&ei=DsznZoW4INa90PEP2PvUiAU&iflsig=AL9hbdgAAAAAZufaHnQ9-248CcGnpYOwjoDZArEB1pjK&ved=0ahUKEwiF96KL58aIAxXWHjQIHdg9FVEQ4dUDCA8&uact=5&oq=jrcustomwoodwork+ca&gs_lp=Egdnd3Mtd2l6IhNqcmN1c3RvbXdvb2R3b3JrIGNhMgcQIRigARgKMgcQIRigARgKMgcQIRigARgKSLMqUNEGWNEGcAF4AJABAJgBVaABVaoBATG4AQPIAQD4AQL4AQGYAgKgAmeoAgrCAhAQABgDGOUCGOoCGIwDGI8BwgIQEC4YAxjlAhjqAhiMAxiPAZgDC5IHATKgB_EE&sclient=gws-wiz"
  );
  await page.getByRole("button", { name: "Not now" }).click();
  await page.getByRole("link", { name: "J&R Custom Woodwork // Home" }).click();
  await page.getByRole("link", { name: "Projects" }).click();
  await page
    .locator("li")
    .filter({ hasText: "Kitchen 02View Project" })
    .getByRole("link")
    .click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByRole("link", { name: "All" }).click();
  await page
    .locator("li")
    .filter({ hasText: "Kitchen 03View Project" })
    .getByRole("link")
    .click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByText("All/Kitchens").click();
  await page.getByRole("link", { name: "All" }).click();
  await page
    .locator("li")
    .filter({ hasText: "Kitchen 04View Project" })
    .getByRole("link")
    .click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByLabel("Button next slide").first().click();
  await page.getByRole("link", { name: "About" }).click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByLabel("Developer of the website").click();
  const page1 = await page1Promise;
  await page1.getByText("About", { exact: true }).click();
  await page1.getByText("Projects", { exact: true }).click();
  await page1.getByRole("navigation").getByText("Contacts").click();
  const page2Promise = page1.waitForEvent("popup");
  await page1.getByRole("link", { name: "maxweb.studio" }).click();
  const page2 = await page2Promise;

  // Closing the pages explicitly
  await page2.close();
  await page1.close();
  await page.close();
});
