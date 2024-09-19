import { test, expect } from "../fixtures";
import { ProjectPage } from "../pages/project.page";
import { navigateSlides } from "../utils/helper";
import * as timeGenerator from "../utils/timegenerator";

test("Test-2: Maxweb Studio and J&R Woodwork Navigation", async ({ page }) => {
  // Navigate to Maxweb Studio website
  await page.goto("https://maxweb.studio/");

  // Open J&R Custom Woodwork (Responsive App) in a new tab
  const page1Promise = page.waitForEvent("popup"); // Create a popup promise for the new window
  await page
    .locator("li")
    .filter({ hasText: "J&RWoodwork(Responsive App)🛒" })
    .getByRole("link")
    .click();
  const page1 = await page1Promise; // The popup is now stored in page1

  // We need to create a ProjectPage instance for page1 (not for the original page)
  const projectPage = new ProjectPage(page1); // Switch to the newly opened page (page1)

  // Navigate to kitchen projects within the popup
  await projectPage.navigateToProjects(); // Navigate to Projects page inside page1

  // Navigate to Kitchens and open "Kitchen 01"
  await projectPage.openKitchenProject("Kitchen 01");

  // Navigate through 12 slides in "Kitchen 01" with random delays
  await navigateSlides(
    page1,
    "Button next slide",
    12,
    timeGenerator.waitOneToThreeTime()
  );

  // Navigate to "Wardrobes" section
  await projectPage.navigateToAllProjects(); // Return to all projects
  await projectPage.navigateToWardrobes(); // Go to Wardrobes

  // Open "Wardrobes" project and navigate through its slides
  await projectPage.openWardrobesProject();
  await navigateSlides(
    page1,
    "Button next slide",
    1,
    timeGenerator.waitOneToThreeTime()
  );

  // Close the pop-up page and the original page
  await page1.close(); // Close the popup page (J&R Custom Woodwork)
  await page.close(); // Close the original Maxweb Studio page
});
