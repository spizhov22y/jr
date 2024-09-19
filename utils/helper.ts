import { Page } from "@playwright/test";
import * as timeGenerator from "../utils/timegenerator"; // Import the time generator utility

export async function findAndClickLink(
  page: Page,
  linkName: string
): Promise<boolean> {
  let found = false;
  let pageCount = 0; // Introduce a page counter

  while (!found) {
    const link = page.getByRole("link", { name: linkName });

    // Check if the desired link is visible
    if (await link.isVisible()) {
      await link.click();
      found = true;
    } else {
      // If link is not found, check for the "Next" button
      const nextButton = page.locator("a#pnnext");

      if (await nextButton.isVisible()) {
        // Introduce a delay before clicking "Next" to simulate human-like behavior
        const delay = timeGenerator.waitNextButton(); // Use a random delay for the "Next" button
        console.log(`Waiting ${delay}ms before clicking "Next"`);
        await page.waitForTimeout(delay); // Wait for the generated delay

        // Click "Next" and wait for the next page to load
        await Promise.all([nextButton.click(), page.waitForLoadState("load")]);

        // Scroll the page after loading the new search results page
        await scrollPage(page); // Use the updated scrollPage helper for human-like scrolling

        // Increment the page counter
        pageCount += 1;

        // Stop after checking the first 10 pages
        if (pageCount >= 10) {
          console.log("Reached the 10-page limit, stopping search.");
          break;
        }
      } else {
        console.log("Reached the last page, link not found.");
        break;
      }
    }
  }

  return found;
}

// Helper to navigate through slides
export async function navigateSlides(
  page: Page,
  slideButtonLabel: string,
  numSlides: number,
  delay: number = 1000
): Promise<void> {
  const nextSlideButton = page.getByLabel(slideButtonLabel).first();

  for (let i = 0; i < numSlides; i++) {
    await nextSlideButton.click();
    await page.waitForTimeout(delay); // Wait for the slide to transition
  }
}

// Helper function to scroll the page in steps with a human-like delay
export async function scrollPage(
  page: Page,
  step: number = 100,
  delayBetweenScrolls: number = 500
) {
  await page.evaluate(
    async ({ step, delayBetweenScrolls }) => {
      const totalHeight = document.body.scrollHeight;
      let scrollPosition = 0;
      while (scrollPosition < totalHeight) {
        window.scrollBy(0, step); // Scroll by the specified step (e.g., 1000px)
        scrollPosition += step;

        // Wait between each scroll to simulate human-like behavior
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenScrolls)
        ); // Delay between scrolls
      }
    },
    { step, delayBetweenScrolls }
  );
}
