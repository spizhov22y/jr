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
    })
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
}
