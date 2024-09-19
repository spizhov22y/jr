import { test as base, expect, BrowserContext } from "@playwright/test";
import { userAgents } from "./utils/useragents";

type TestFixtures = {
  context: BrowserContext;
  page: import("@playwright/test").Page;
};

export const test = base.extend<TestFixtures>({
  // Override the context fixture to use a random user agent
  context: async ({ browser }, use, testInfo) => {
    // Select a random user agent
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    // Log the user agent
    console.log(
      `Test "${testInfo.title}" is using User Agent: ${randomUserAgent}`
    );

    // Create a new browser context with the random user agent
    const context = await browser.newContext({
      userAgent: randomUserAgent,
    });

    // Use the context in tests
    await use(context);

    // Clean up
    await context.close();
  },

  // Override the page fixture to use the context with the random user agent
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };
