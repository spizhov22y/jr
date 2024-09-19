import { test, expect } from "../fixtures";
import { GoogleSearchPage } from "../pages/googleSearch.page";
import { ProjectPage } from "../pages/project.page";
import { findAndClickLink, navigateSlides } from "../utils/helper";
import * as timeGenerator from "../utils/timegenerator"; // Import the time generator utility

test("Test-4: Google Search and Navigate to J&R Custom Woodwork", async ({
  page,
}) => {
  const googleSearchPage = new GoogleSearchPage(page);
  const projectPage = new ProjectPage(page);

  // Navigate to Google and accept cookies if prompted
  await googleSearchPage.navigateToGoogle();
  await googleSearchPage.acceptCookiesIfVisible();

  // Perform the search with human-like typing and scrolling behavior
  const searchQuery = "custom woodwork kelowna";
  await googleSearchPage.performSearch(searchQuery); // Handles typing, scrolling, and random delays

  // Use the helper function to find and click the desired link
  const found = await findAndClickLink(page, "J&R Custom Woodwork // Home");

  if (found) {
    // Navigate to the "Kitchens" section
    await projectPage.navigateToProjects();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Open the "Kitchen 01 View Project"
    await projectPage.openKitchenProject("Kitchen 01");
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Navigate through the "Kitchen 01" slides with random delays
    await navigateSlides(
      page,
      "Button next slide",
      2,
      timeGenerator.waitOneToThreeTime()
    );

    // Navigate back to all projects
    await projectPage.navigateToAllProjects();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Open the "Kitchen 02 View Project"
    await projectPage.openKitchenProject("Kitchen 02");
    await page.waitForTimeout(timeGenerator.waitTwoToFiveTime()); // Simulate human-like delay

    // Navigate through the "Kitchen 02" slides with random delays
    await navigateSlides(
      page,
      "Button next slide",
      2,
      timeGenerator.waitOneToThreeTime()
    );

    // Navigate to the "About" page
    await page.getByRole("link", { name: "Contact" }).click();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay

    // Open the Facebook page in a new tab
    const [facebookPopup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByLabel("Facebook page").click(),
    ]);

    // Simulate delay before closing the new tab
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime());

    // Close the Facebook page and the original page
    await facebookPopup.close();
    await page.close();
  } else {
    console.log("Link not found in search results.");
    await page.close();
  }
});
