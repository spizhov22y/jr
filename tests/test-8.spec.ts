import { test, expect } from "../fixtures";
import { GoogleSearchPage } from "../pages/googleSearch.page";
import { ProjectPage } from "../pages/project1.page";
import { findAndClickLink, navigateSlides, scrollPage } from "../utils/helper";
import * as timeGenerator from "../utils/timegenerator";
import { createRandomContext } from "../fixtures";
import { getRandomKeyword } from "../utils/keywords";

// Function to get a random kitchen project name
const kitchenProjects = [
  "Kitchen 01",
  "Kitchen 02",
  "Kitchen 03",
  "Kitchen 04",
  "Wardrobe 01",
  "Bathroom 01",
  "Fireplace 01",
  "Fireplace 02",
  "Wetbar 01",
  "Wetbar 02",
];

function getRandomKitchenProject() {
  const randomIndex = Math.floor(Math.random() * kitchenProjects.length);
  return kitchenProjects[randomIndex];
}

// Function to randomly choose between Home, Contacts, and About pages
function getRandomNavigationPage() {
  const pages = ["Home", "Contact", "About"];
  const randomIndex = Math.floor(Math.random() * pages.length);
  return pages[randomIndex];
}

// Function to decide if Facebook interaction is needed (randomly skip it)
function shouldOpenFacebook() {
  return Math.random() < 0.5; // 50% chance to open Facebook
}

// Function to generate a random number of steps (between 2 and 7)
function getRandomStepCount() {
  return Math.floor(Math.random() * (7 - 2 + 1)) + 2;
}

test("Test-8: Search and Navigate to J&R Custom Woodwork (Cross-Device) with Random Context", async ({
  browser,
}) => {
  // Log the test number at the start
  console.log("Running Test-8: Search and Navigate to J&R Custom Woodwork");
  const context = await createRandomContext(browser);
  const page = await context.newPage();

  const googleSearchPage = new GoogleSearchPage(page);
  const projectPage = new ProjectPage(page);

  await googleSearchPage.navigateToGoogle();
  await googleSearchPage.acceptCookiesIfVisible();

  const searchText = getRandomKeyword();
  await googleSearchPage.performSearch(searchText);
  await scrollPage(page, "down");

  // Ensure the correct link to J&R Custom Woodwork is clicked
  let found = await findAndClickLink(
    page,
    "J&R Custom Woodwork",
    "jrcustomwoodwork.ca"
  );

  if (found) {
    await scrollPage(page, "up");
    await projectPage.closeHamburgerMenuIfVisible();
    await projectPage.navigateToProjects();
    await page.waitForTimeout(timeGenerator.waitSevenToTenTime());

    const numberOfSteps = getRandomStepCount();
    console.log(`Performing ${numberOfSteps} steps through the projects.`);

    for (let i = 0; i < numberOfSteps; i++) {
      const randomKitchenProject = getRandomKitchenProject();
      console.log(`Navigating to project: ${randomKitchenProject}`);
      await projectPage.openKitchenProject(randomKitchenProject);
      await page.waitForTimeout(timeGenerator.waitOneToThreeTime());

      // Randomly navigate slides (capped at 12 slides) with variable delay
      await navigateSlides(
        page,
        "Button next slide",
        timeGenerator.waitOneToThreeTime // Pass the delay function reference
      );

      if (i < numberOfSteps - 1) {
        await projectPage.navigateToAllProjects();
      }
    }

    // Close hamburger menu if visible before navigating to other pages
    await projectPage.closeHamburgerMenuIfVisible();

    // Randomly navigate to Home, Contacts, or About
    const randomPage = getRandomNavigationPage();
    console.log(`Navigating to ${randomPage} page`);
    await page.getByRole("link", { name: randomPage }).click();
    await page.waitForTimeout(timeGenerator.waitOneToThreeTime());

    // Randomly decide whether to open Facebook
    if (shouldOpenFacebook()) {
      console.log("Opening Facebook page");
      const facebookPopupPromise = page.waitForEvent("popup");
      await page.getByLabel("Facebook page").click();
      const facebookPopup = await facebookPopupPromise;

      await page.waitForTimeout(timeGenerator.waitOneToThreeTime());
      await facebookPopup.close();
    } else {
      console.log("Skipping Facebook interaction");
    }

    await page.close();
  }

  await context.close();
});
