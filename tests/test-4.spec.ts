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

test("Test-4: Search and Navigate to J&R Custom Woodwork (Cross-Device) with Random Context", async ({
  browser,
}) => {
  // Log the test number at the start
  console.log("Running Test-4: Search and Navigate to J&R Custom Woodwork");
  const context = await createRandomContext(browser);
  const page = await context.newPage();

  const googleSearchPage = new GoogleSearchPage(page);
  const projectPage = new ProjectPage(page);

  // Step 1: Navigate to Maxweb Studio website
  await page.goto("https://maxweb.studio/");

  // Step 2: Scroll down the page in steps with human-like behavior
  await scrollPage(page, "down");

  // Step 3: Scroll back up with human-like behavior
  await scrollPage(page, "up");

  // Step 4: Open J&R Custom Woodwork (Responsive App) in a new tab
  const page1Promise = page.waitForEvent("popup"); // Wait for the popup to open
  await page
    .locator("li")
    .filter({ hasText: "J&RWoodwork(Responsive App)🛒" })
    .getByRole("link")
    .click();
  const page1 = await page1Promise; // Capture the popup in page1

  // Step 5: Switch to the newly opened J&R Custom Woodwork page
  const projectPageNewTab = new ProjectPage(page1); // Initialize ProjectPage for the new tab

  // Continue with previous steps using the new tab (page1)
  await projectPageNewTab.closeHamburgerMenuIfVisible();
  await projectPageNewTab.navigateToProjects();
  await page1.waitForTimeout(timeGenerator.waitSevenToTenTime());

  const numberOfSteps = getRandomStepCount();
  console.log(`Performing ${numberOfSteps} steps through the projects.`);

  for (let i = 0; i < numberOfSteps; i++) {
    const randomKitchenProject = getRandomKitchenProject();
    console.log(`Navigating to project: ${randomKitchenProject}`);
    await projectPageNewTab.openKitchenProject(randomKitchenProject);
    await page1.waitForTimeout(timeGenerator.waitOneToThreeTime());

    // Randomly navigate slides (capped at 12 slides) with variable delay
    await navigateSlides(
      page1,
      "Button next slide",
      timeGenerator.waitOneToThreeTime // Pass the delay function reference
    );

    if (i < numberOfSteps - 1) {
      await projectPageNewTab.navigateToAllProjects();
    }
  }

  // Close hamburger menu if visible before navigating to other pages
  await projectPageNewTab.closeHamburgerMenuIfVisible();

  // Randomly navigate to Home, Contacts, or About
  const randomPage = getRandomNavigationPage();
  console.log(`Navigating to ${randomPage} page`);
  await page1.getByRole("link", { name: randomPage }).click();
  await page1.waitForTimeout(timeGenerator.waitOneToThreeTime());

  // Randomly decide whether to open Facebook
  if (shouldOpenFacebook()) {
    console.log("Opening Facebook page");
    const facebookPopupPromise = page1.waitForEvent("popup");
    await page1.getByLabel("Facebook page").click();
    const facebookPopup = await facebookPopupPromise;

    await page1.waitForTimeout(timeGenerator.waitOneToThreeTime());
    await facebookPopup.close();
  } else {
    console.log("Skipping Facebook interaction");
  }

  await page1.close();
  await context.close();
});
