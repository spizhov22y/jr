import { Page } from "@playwright/test";

export class DeveloperPage {
  constructor(
    private readonly page: Page,
    // Locators
    private readonly aboutLink = page.getByText("About", { exact: true }),
    private readonly projectsLink = page.getByText("Projects", { exact: true }),
    private readonly contactsLink = page
      .getByRole("navigation")
      .getByText("Contacts"),
    private readonly maxWebStudioLink = page.getByRole("link", {
      name: "maxweb.studio",
    }),
    // Hamburger menu locator for mobile view
    private readonly developerHamburgerMenuButton = page.locator(
      "button._navButton_4r0jz_51"
    )
  ) {}

  async navigateToAbout() {
    await this.aboutLink.click();
  }

  async navigateToProjects() {
    await this.projectsLink.click();
  }

  async navigateToContacts() {
    await this.contactsLink.click();
  }

  async openMaxWebStudio() {
    const page2Promise = this.page.waitForEvent("popup");
    await this.maxWebStudioLink.click();
    return page2Promise;
  }

  // Close the hamburger menu if it is visible (for mobile views)
  async closeHamburgerMenuIfVisible() {
    if (await this.developerHamburgerMenuButton.isVisible()) {
      await this.developerHamburgerMenuButton.click();
      await this.page.waitForTimeout(1000); // Optional delay for a smoother close interaction
    }
  }
}
