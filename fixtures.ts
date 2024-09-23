import { test as base, expect, BrowserContext } from "@playwright/test";
import {
  userAgents,
  desktopViewports,
  iphoneViewports,
  androidViewports,
  ipadViewports,
  androidTabletViewports,
} from "./utils/useragents"; // Import user agents and viewports
import { getRandomUserAgentAndViewport } from "./utils/useragents";
import { getRandomLocation } from "./utils/geolocation";

type TestFixtures = {
  context: BrowserContext;
  page: import("@playwright/test").Page;
};

export const test = base.extend<TestFixtures>({
  // Override the context fixture to use a random user agent and viewport
  context: async ({ browser }, use, testInfo) => {
    // Generate a random probability between 0.65 and 0.8 for mobile devices
    const mobileProbability = Math.random() * (0.8 - 0.65) + 0.65;

    // Choose whether to use mobile or desktop/laptop based on the random probability
    const isMobile = Math.random() < mobileProbability;

    // Select a random user agent based on the chosen device type
    let randomAgent;
    if (isMobile) {
      randomAgent = userAgents.filter((agent) => agent.deviceType === "mobile")[
        Math.floor(
          Math.random() *
            userAgents.filter((agent) => agent.deviceType === "mobile").length
        )
      ];
    } else {
      randomAgent = userAgents.filter(
        (agent) =>
          agent.deviceType === "desktop" || agent.deviceType === "laptop"
      )[
        Math.floor(
          Math.random() *
            userAgents.filter(
              (agent) =>
                agent.deviceType === "desktop" || agent.deviceType === "laptop"
            ).length
        )
      ];
    }

    // Log the user agent being used
    console.log(
      `Test "${testInfo.title}" is using User Agent: ${randomAgent.userAgent} with Mobile Probability: ${mobileProbability}`
    );

    // Determine the viewport based on the device type
    let viewport;
    if (
      randomAgent.deviceType === "desktop" ||
      randomAgent.deviceType === "laptop"
    ) {
      // Randomly select a viewport from the desktop/laptop viewports
      viewport =
        desktopViewports[Math.floor(Math.random() * desktopViewports.length)];
    } else if (randomAgent.deviceType === "mobile") {
      // Select mobile viewport based on the device (iPhone or Android)
      if (randomAgent.userAgent.includes("iPhone")) {
        viewport =
          iphoneViewports[Math.floor(Math.random() * iphoneViewports.length)];
      } else {
        viewport =
          androidViewports[Math.floor(Math.random() * androidViewports.length)];
      }
    } else if (randomAgent.deviceType === "tablet") {
      // Further distinguish between iPad and Android tablets
      if (randomAgent.tabletType === "ipad") {
        viewport =
          ipadViewports[Math.floor(Math.random() * ipadViewports.length)];
      } else {
        viewport =
          androidTabletViewports[
            Math.floor(Math.random() * androidTabletViewports.length)
          ];
      }
    }

    // Ensure that a viewport was found, if not, throw an error
    if (!viewport) {
      throw new Error(
        `No viewport found for the user agent: ${randomAgent.userAgent}`
      );
    }

    // Log the selected viewport
    console.log(`Using viewport: ${JSON.stringify(viewport)}`);

    // Create a new browser context with the selected user agent and viewport
    const context = await browser.newContext({
      userAgent: randomAgent.userAgent,
      viewport,
    });

    // Use the context in tests
    await use(context);

    // Clean up the context
    await context.close();
  },

  // Override the page fixture to use the context with the random user agent and viewport
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };

// Helper to create a new context with random user agent, viewport, and geolocation
export async function createRandomContext(browser) {
  // Get a random user agent and viewport
  const { userAgent, viewport } = getRandomUserAgentAndViewport();

  // Get a random location for geolocation
  const location = getRandomLocation();

  // Log the selected random values
  console.log(`Selected User Agent: ${userAgent}`);
  console.log(`Selected Viewport: ${JSON.stringify(viewport)}`);
  console.log(
    `Selected Geolocation: ${location.name}, Lat: ${location.lat}, Lon: ${location.lon}`
  );

  // Create a new browser context with geolocation, random user agent, and random viewport
  return await browser.newContext({
    geolocation: { latitude: location.lat, longitude: location.lon },
    permissions: ["geolocation"], // Ensure geolocation permission is granted
    viewport, // Set the random viewport
    userAgent, // Set the random user agent
  });
}
