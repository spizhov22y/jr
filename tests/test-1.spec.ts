import { test, expect } from "../fixtures";
import { GoogleSearchPage } from "../pages/googleSearch.page";
import { ProjectPage } from "../pages/project.page";
import { DeveloperPage } from "../pages/developer.page";
import { findAndClickLink, navigateSlides } from "../utils/helper";
import * as timeGenerator from "../utils/timegenerator";

test("Test-1: Google Search and Navigate to J&R Custom Woodwork", async ({
  page,
}) => {
  const googleSearchPage = new GoogleSearchPage(page);
  const projectPage = new ProjectPage(page);

  // Navigate to Google and accept cookies
  await googleSearchPage.navigateToGoogle();
  await googleSearchPage.acceptCookiesIfVisible();

  // Perform the search with human-like behavior
  await googleSearchPage.performSearch("jrcustomwoodwork ca");

  // Use the helper function to find and click the link on the search results
  const found = await findAndClickLink(page, "J&R Custom Woodwork // Home");

  if (found) {
    // Navigate through kitchen projects
    await projectPage.navigateToProjects(); // Navigate to Projects page
    await projectPage.openKitchenProject("Kitchen 01"); // Open Kitchen 02
    // Click slides 3 times
    await navigateSlides(
      page,
      "Button next slide",
      3,
      timeGenerator.waitOneToThreeTime()
    );

    await projectPage.navigateToAllProjects(); // Navigate to Projects page
    await projectPage.openKitchenProject("Kitchen 04");
    await navigateSlides(
      page,
      "Button next slide",
      2,
      timeGenerator.waitOneToThreeTime()
    );

    await projectPage.navigateToAllProjects(); // Navigate to Projects page
    await projectPage.openKitchenProject("Kitchen 03");
    await navigateSlides(
      page,
      "Button next slide",
      3,
      timeGenerator.waitOneToThreeTime()
    );

    // Developer-related actions
    const developerPopupPromise = page.waitForEvent("popup"); // Create the promise for the developer popup
    await page.getByLabel("Developer of the website").click(); // Click to open the developer website
    const developerPopup = await developerPopupPromise; // Resolve the popup promise when it opens

    const developerPage = new DeveloperPage(developerPopup);
    await developerPage.navigateToAbout(); // Navigate to About
    await developerPage.navigateToProjects(); // Navigate to Projects
    await developerPage.navigateToContacts(); // Navigate to Contacts

    // Open maxweb.studio in a new popup
    const maxwebStudioPopupPromise = developerPopup.waitForEvent("popup"); // Create the promise for the maxweb.studio popup
    await developerPage.openMaxWebStudio(); // Click the link to open maxweb.studio
    const maxwebStudioPopup = await maxwebStudioPopupPromise; // Resolve the popup promise when it opens

    // Close the popups
    await maxwebStudioPopup.close(); // Close the maxweb.studio popup
    await developerPopup.close(); // Close the developer popup
    await page.close(); // Close the original page
  } else {
    console.log("Link not found in search results.");
    await page.close();
  }
});
