import { Page } from "@playwright/test";
import * as timeGenerator from "../utils/timegenerator";

export class GoogleSearchPage {
  // Declare the locators as readonly properties
  private readonly acceptCookiesButton;
  private readonly searchInput;
  private readonly notNowButton;

  // Constructor to initialize the locators
  constructor(private readonly page: Page) {
    this.acceptCookiesButton = page.locator('button:has-text("I agree")');
    this.searchInput = page.locator("textarea[name='q'], input[name='q']");
    this.notNowButton = page.getByRole("button", { name: "Not now" });
  }

  async navigateToGoogle() {
    await this.page.goto("https://www.google.com/");
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Random delay to simulate loading time
  }

  async acceptCookiesIfVisible() {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
      await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human delay after click
    }
  }

  async performSearch(query: string) {
    await this.searchInput.click();
    for (const char of query) {
      await this.page.keyboard.press(char);
      await this.page.waitForTimeout(timeGenerator.waitKeyStroke()); // Random delay between keystrokes
    }
    await this.page.keyboard.press("Enter");

    // Simulate scrolling down the page after search
    await this.scrollPage();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Random delay after scrolling
  }

  // Dismiss the location popup if the "Not now" button is visible
  async dismissLocationPopupIfVisible() {
    try {
      if (await this.notNowButton.isVisible()) {
        console.log('Clicking "Not now" button.');
        await this.notNowButton.click();
        await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate delay after dismissing pop-up
      }
    } catch (e) {
      console.log('"Not now" button did not appear, continuing.');
    }
  }

  // Helper function to scroll the page in steps
  async scrollPage() {
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight;
      let scrollPosition = 0;
      while (scrollPosition < totalHeight) {
        window.scrollBy(0, 1000); // Scroll by 1000px at a time
        scrollPosition += 1000;
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate user scroll delay
      }
    });
  }
}
