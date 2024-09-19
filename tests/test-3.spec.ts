import { test, expect } from "../fixtures";
import { GoogleSearchPage } from "../pages/googleSearch.page";
import { ProjectPage } from "../pages/project.page";
import { findAndClickLink, navigateSlides } from "../utils/helper";
import * as timeGenerator from "../utils/timegenerator";

test("Test-3: Search and Navigate to J&R Custom Woodwork", async ({ page }) => {
  const googleSearchPage = new GoogleSearchPage(page);
  const projectPage = new ProjectPage(page);

  // Navigate to Google and accept cookies if prompted
  await googleSearchPage.navigateToGoogle();
  await googleSearchPage.acceptCookiesIfVisible();

  // Perform the search, including human-like typing and scrolling behavior
  const searchText = "custom woodwork kelowna";
  await googleSearchPage.performSearch(searchText); // This method already handles the scrolling after the search

  // Use the helper function to find and click the desired link
  const found = await findAndClickLink(page, "J&R Custom Woodwork // Home");

  if (found) {
    // Navigate to the "Kitchens" section
    await projectPage.navigateToProjects();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    await projectPage.openKitchenProject("Kitchen 03");
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Navigate through the "Kitchen 01" project slides
    await navigateSlides(
      page,
      "Button next slide",
      2,
      timeGenerator.waitOneToThreeTime()
    );

    await projectPage.navigateToAllProjects();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    await projectPage.openKitchenProject("Kitchen 01");
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Navigate through the "Kitchen 02" project slides
    await navigateSlides(
      page,
      "Button next slide",
      2,
      timeGenerator.waitOneToThreeTime()
    );

    await page.getByRole("link", { name: "About" }).click();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Open Facebook page in a new tab
    const [facebookPopup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByLabel("Facebook page").click(),
    ]);

    // Simulate delay before closing
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime());

    // Close the Facebook page and the original page
    await facebookPopup.close();
    await page.close();
  } else {
    console.log("Link not found in search results.");
    await page.close();
  }
});
