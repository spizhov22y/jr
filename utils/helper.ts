import { Page } from "@playwright/test";
import * as timeGenerator from "../utils/timegenerator"; // Import the time generator utility
import { GoogleSearchPage } from "../pages/googleSearch.page"; // Import the GoogleSearchPage class
import { getRandomUserAgentAndViewport } from "../utils/useragents";
import { getRandomLocation } from "../utils/geolocation";

export async function findAndClickLink(
  page: Page,
  linkText: string, // The text to match (partial match)
  expectedBaseUrl: string // The expected base URL (e.g., "jrcustomwoodwork.ca")
): Promise<boolean> {
  let found = false;
  let pageCount = 0; // Page counter
  const maxPageCount = 15; // Max number of pages to check
  const skipLinkKeywords = ["facebook.com", "fb.com", "Facebook"]; // Keywords to avoid

  const googleSearchPage = new GoogleSearchPage(page);

  // Function to normalize URL by removing the protocol (http, https)
  const normalizeUrl = (url: string) => url.replace(/^https?:\/\//, "");

  // Normalize expected base URL
  const normalizedExpectedBaseUrl = normalizeUrl(expectedBaseUrl);

  while (!found && pageCount < maxPageCount) {
    // Check for the "Not now" popup and dismiss it if visible
    await googleSearchPage.dismissLocationPopupIfVisible();

    // Get all links that contain the desired link text
    const links = page.locator(`a:has-text("${linkText}")`);
    const linkCount = await links.count();

    console.log(
      `Found ${linkCount} links matching "${linkText}" on page ${pageCount + 1}`
    );

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute("href");

      if (href) {
        const normalizedHref = normalizeUrl(href); // Normalize the href before comparing
        console.log(`Checking link with href: ${href}`);
        console.log(
          `Expected base URL: ${normalizedExpectedBaseUrl}, Actual href: ${normalizedHref}`
        );

        // Ensure the link starts with the expected base URL and does not contain unwanted keywords like Facebook
        if (
          normalizedHref.startsWith(normalizedExpectedBaseUrl) && // Check that the link starts with the expected base URL
          !skipLinkKeywords.some((keyword) => normalizedHref.includes(keyword)) // Skip Facebook links
        ) {
          console.log(`Valid link found: ${href}`);
          await link.click(); // Click the first valid link
          found = true;
          break; // Exit the loop after clicking a valid link
        } else {
          console.log(
            `Skipping link: ${href} (does not match expected base URL or contains unwanted keywords)`
          );
        }
      }
    }

    if (!found) {
      // Check for "Next" button (desktop) or "More search results" (mobile)
      const nextButton = page.locator("a#pnnext");
      const moreResultsButton = page.locator(
        'a:has-text("More search results")'
      );

      if (await nextButton.isVisible()) {
        // Click the "Next" button and wait for the next page to load
        const delay = timeGenerator.waitNextButton();
        console.log(`Waiting ${delay}ms before clicking "Next"`);
        await page.waitForTimeout(delay);
        await Promise.all([nextButton.click(), page.waitForLoadState("load")]);
        console.log(`Navigated to page ${pageCount + 2}`);
        await scrollPage(page); // Scroll the page after loading new results
      } else if (await moreResultsButton.isVisible()) {
        // Click "More search results" (mobile) and wait for the next page to load
        const delay = timeGenerator.waitNextButton();
        console.log(`Waiting ${delay}ms before clicking "More search results"`);
        await page.waitForTimeout(delay);
        await Promise.all([
          moreResultsButton.click(),
          page.waitForLoadState("load"),
        ]);
        console.log(`More search results loaded on page ${pageCount + 2}`);
        await scrollPage(page);
      } else {
        // No more results or pagination buttons found
        console.log(
          "No more results or pagination buttons available, link not found."
        );
        break;
      }

      pageCount += 1;

      // Stop after checking the first 15 pages
      if (pageCount >= maxPageCount) {
        console.log(`Reached the ${maxPageCount}-page limit, stopping search.`);
        break;
      }
    }
  }

  return found;
}

// // Helper to navigate through slides
// export async function navigateSlides(
//   page: Page,
//   slideButtonLabel: string,
//   maxSlides: number,
//   delayFunction: () => number // Function to generate variable delay between slides
// ): Promise<void> {
//   const nextSlideButton = page.getByLabel(slideButtonLabel).first();

//   // Get the actual number of available slides by checking the visibility of the "next slide" button
//   let availableSlides = 0;

//   // Count how many times the "next" button is available (this gives us the total slides)
//   while (await nextSlideButton.isVisible()) {
//     availableSlides++;
//     await nextSlideButton.click();
//   }

//   // Scroll back to the first slide (if needed)
//   for (let i = 0; i < availableSlides; i++) {
//     await page.keyboard.press("ArrowLeft"); // Assuming arrow keys work to go back
//   }

//   // Generate a random number of slides to navigate, but cap it at the available slides
//   const slidesToNavigate = Math.min(
//     Math.floor(Math.random() * maxSlides) + 1,
//     availableSlides
//   );
//   console.log(
//     `Navigating ${slidesToNavigate} slides out of ${availableSlides}`
//   );

//   // Now, navigate the actual number of slides with variable delay
//   for (let i = 0; i < slidesToNavigate; i++) {
//     if (await nextSlideButton.isVisible()) {
//       await nextSlideButton.click();

//       // Ensure that the slide change has completed before applying a delay
//       await page.waitForLoadState("domcontentloaded"); // Wait for the slide content to be ready

//       // Generate a random delay between 1000ms and 3000ms
//       const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
//       console.log(`Waiting ${delay}ms before clicking the next slide.`);

//       // Introduce the variable delay between slide transitions
//       await page.waitForTimeout(delay);
//     } else {
//       break; // Exit the loop if there are no more slides available
//     }
//   }
// }

// Helper function to generate a random number between min and max (inclusive)
function getRandomStep(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to scroll the page in a specified direction with a human-like delay and random step size
export async function scrollPage(
  page: Page,
  direction: "up" | "down" = "down", // Scroll direction: 'up' or 'down'
  minStep: number = 250, // Default minimum step size
  maxStep: number = 450, // Default maximum step size
  delayBetweenScrolls: number = 500 // Default delay between scrolls
) {
  await page.evaluate(
    async ({ direction, minStep, maxStep, delayBetweenScrolls }) => {
      const totalHeight = document.body.scrollHeight;
      let scrollPosition = window.scrollY;

      // Function to calculate the next step based on direction
      const getNextStep = () => {
        const step =
          Math.floor(Math.random() * (maxStep - minStep + 1)) + minStep;
        return direction === "down" ? step : -step;
      };

      // Scroll until reaching the top or the bottom
      while (
        (direction === "down" && scrollPosition < totalHeight) ||
        (direction === "up" && scrollPosition > 0)
      ) {
        const step = getNextStep();
        window.scrollBy(0, step); // Scroll by the calculated step
        scrollPosition += step;

        // Wait between each scroll to simulate human-like behavior
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenScrolls)
        );
      }
    },
    { direction, minStep, maxStep, delayBetweenScrolls }
  );
}

// Helper to create a new context with random user agent, viewport, and geolocation
export async function createRandomContext(browser) {
  // Get a random user agent and viewport
  const { userAgent, viewport } = getRandomUserAgentAndViewport();

  // Get a random location for geolocation
  const location = getRandomLocation();

  // Create a new browser context with geolocation, random user agent, and random viewport
  return await browser.newContext({
    geolocation: { latitude: location.lat, longitude: location.lon },
    permissions: ["geolocation"], // Ensure geolocation permission is granted
    viewport, // Set the random viewport
    userAgent, // Set the random user agent
  });
}

// // Helper to navigate through slides with dynamic sliding speed and backward navigation
// export async function navigateSlides(
//   page: Page,
//   nextSlideLabel: string, // Label for the "Next" slide button
//   maxSlides: number,
//   reverseProbability: number = 0.3 // Probability of navigating backward (0 to 1)
// ): Promise<void> {
//   // Define min and max delay within the function
//   const minDelay = 3000; // Minimum delay between slides in milliseconds
//   const maxDelay = 5000; // Maximum delay between slides in milliseconds

//   // Locate the "Next" and "Previous" slide buttons
//   const nextSlideButton = page.getByLabel(nextSlideLabel).first();
//   const prevSlideButton = page
//     .locator("button[aria-label='Button prev slide']")
//     .first(); // Updated for "Previous" slide

//   // Get the actual number of available slides by checking the visibility of the "next slide" button
//   let availableSlides = 0;

//   // Count how many times the "next" button is available (this gives us the total slides)
//   while (await nextSlideButton.isVisible()) {
//     availableSlides++;
//     await nextSlideButton.click();
//   }

//   // Scroll back to the first slide
//   for (let i = 0; i < availableSlides; i++) {
//     if (await prevSlideButton.isVisible()) {
//       await prevSlideButton.click();
//     }
//   }

//   // Randomly decide if the navigation will be forward or backward based on the probability
//   const navigateForward = Math.random() > reverseProbability;
//   const slidesToNavigate = Math.min(
//     Math.floor(Math.random() * maxSlides) + 1,
//     availableSlides
//   );

//   console.log(
//     `Navigating ${slidesToNavigate} slides ${
//       navigateForward ? "forward" : "backward"
//     } out of ${availableSlides}`
//   );

//   // Now, navigate the actual number of slides with variable delay
//   for (let i = 0; i < slidesToNavigate; i++) {
//     const button = navigateForward ? nextSlideButton : prevSlideButton;

//     if (await button.isVisible()) {
//       await button.click();

//       // Ensure that the slide change has completed before applying a delay
//       await page.waitForLoadState("domcontentloaded"); // Wait for the slide content to be ready

//       // Generate a random delay between minDelay and maxDelay to simulate different speeds
//       const delay =
//         Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
//       console.log(
//         `Waiting ${delay}ms before clicking the ${
//           navigateForward ? "next" : "previous"
//         } slide.`
//       );

//       // Introduce the variable delay between slide transitions
//       await page.waitForTimeout(delay);
//     } else {
//       console.log(
//         `No more slides to navigate ${
//           navigateForward ? "forward" : "backward"
//         }.`
//       );
//       break; // Exit the loop if there are no more slides available
//     }
//   }
// }
// Helper to navigate through slides with dynamic sliding speed and partial backward navigation
export async function navigateSlides(
  page: Page,
  slideButtonLabel: string,
  delayFunction: () => number // Function to generate variable delay between slides
): Promise<void> {
  const nextSlideButton = page.getByLabel(slideButtonLabel).first();
  const prevSlideButton = page.getByLabel("Button prev slide").first();

  // Get the actual number of available slides by checking the visibility of the "next slide" button
  let availableSlides = 0;

  // Count how many times the "next" button is available (this gives us the total slides)
  while (await nextSlideButton.isVisible()) {
    availableSlides++;
    await nextSlideButton.click();
  }

  // Scroll back to the first slide (if needed)
  for (let i = 0; i < availableSlides; i++) {
    await page.keyboard.press("ArrowLeft");
  }

  // Generate a random number of slides to navigate, capped at the available slides
  const slidesToNavigate = Math.floor(Math.random() * (availableSlides + 1));
  console.log(
    `Navigating ${slidesToNavigate} slides out of ${availableSlides}`
  );

  // Navigate forward through the slides with variable delays
  for (let i = 0; i < slidesToNavigate; i++) {
    if (await nextSlideButton.isVisible()) {
      await nextSlideButton.click();

      // Ensure the slide change has completed before applying a delay
      await page.waitForLoadState("domcontentloaded");

      // Introduce a random delay between slide transitions
      const delay = delayFunction();
      console.log(`Waiting ${delay}ms before clicking the next slide.`);
      await page.waitForTimeout(delay);
    } else {
      break; // Exit the loop if there are no more slides available
    }
  }

  // Decide randomly if we should go back
  const shouldGoBack = Math.random() < 0.5; // 50% chance to go back
  if (shouldGoBack) {
    // Randomly select how far to go back (10% to 100% of forward steps)
    const backStepsPercentage = Math.random() * (1 - 0.1) + 0.1;
    const backSteps = Math.ceil(slidesToNavigate * backStepsPercentage);
    console.log(
      `Navigating back ${backSteps} slides (${Math.round(
        backStepsPercentage * 100
      )}%)`
    );

    // Navigate backward through the slides
    for (let i = 0; i < backSteps; i++) {
      if (await prevSlideButton.isVisible()) {
        await prevSlideButton.click();

        // Ensure the slide change has completed before applying a delay
        await page.waitForLoadState("domcontentloaded");

        // Introduce a random delay between slide transitions
        const delay = delayFunction();
        console.log(`Waiting ${delay}ms before clicking the previous slide.`);
        await page.waitForTimeout(delay);
      } else {
        break; // Exit the loop if there are no more slides available
      }
    }
  }
}

/*
export async function navigateSlides(
  page: Page,
  slideButtonLabel: string,
  delayFunction: () => number // Function to generate variable delay between slides
): Promise<void> {
  const nextSlideButton = page.getByLabel(slideButtonLabel).first();
  const prevSlideButton = page.getByLabel("Button prev slide").first(); // Assuming prev button is labeled this way

  // Get the actual number of available slides by checking the visibility of the "next slide" button
  let availableSlides = 0;

  // Count how many times the "next" button is available (this gives us the total slides)
  while (await nextSlideButton.isVisible()) {
    availableSlides++;
    await nextSlideButton.click();
  }

  // Scroll back to the first slide if randomly chosen to go backward
  if (Math.random() > 0.5) {
    const slidesToGoBack = Math.floor(Math.random() * availableSlides * 0.9) + 1; // Random number between 10% and 100% of available slides
    console.log(`Navigating backward ${slidesToGoBack} slides.`);
    for (let i = 0; i < slidesToGoBack; i++) {
      if (await prevSlideButton.isVisible()) {
        await prevSlideButton.click();

        // Introduce a random delay between slide transitions
        const delay = delayFunction();
        console.log(`Waiting ${delay}ms before clicking the previous slide.`);
        await page.waitForTimeout(delay);
      }
    }
  }

  // Navigate forward through the slides with variable delay
  const slidesToNavigate = Math.min(
    Math.floor(Math.random() * availableSlides) + 1, // Random number of slides to navigate forward
    availableSlides
  );
  console.log(
    `Navigating ${slidesToNavigate} slides forward out of ${availableSlides}`
  );

  for (let i = 0; i < slidesToNavigate; i++) {
    if (await nextSlideButton.isVisible()) {
      await nextSlideButton.click();

      // Ensure that the slide change has completed before applying a delay
      await page.waitForLoadState("domcontentloaded"); // Wait for the slide content to load

      // Generate a random delay using the provided delay function
      const delay = delayFunction();
      console.log(`Waiting ${delay}ms before clicking the next slide.`);
      await page.waitForTimeout(delay);
    } else {
      break; // Exit the loop if no more slides are available
    }
  }
}
*/
