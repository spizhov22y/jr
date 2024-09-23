// /pages/project.page.ts

import { Page } from "@playwright/test";
import * as timeGenerator from "../utils/timegenerator";

export class ProjectPage {
  constructor(
    private readonly page: Page,
    // Locators
    private readonly allKitchensLink = page.getByText("All/Kitchens"),
    private readonly allLink = page.getByRole("link", { name: "All" }),
    private readonly projectLink = page.getByRole("link", { name: "Projects" }),
    private readonly wardrobesLink = page.getByRole("link", {
      name: "Wardrobes",
    }),
    private readonly kitchenProjectLink = (projectName: string) =>
      page
        .locator(`li:has-text("${projectName}View Project")`)
        .getByRole("link"),
    private readonly viewProjectLink = page.getByRole("link", {
      name: "View Project",
    }),
    // Hamburger menu locator for mobile view
    private readonly hamburgerMenuButton = page.locator(
      "button._hamburger_15if9_13"
    )
  ) {}

  // Navigate to the Projects section
  async navigateToProjects() {
    await this.projectLink.click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay
  }

  // Navigate to the "All Projects" section
  async navigateToAllProjects() {
    await this.allLink.click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate delay
  }

  // Open a specific Kitchen project by its name
  async openKitchenProject(projectName: string) {
    await this.kitchenProjectLink(projectName).click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime());
  }

  // Close the hamburger menu if it is visible (for mobile views)
  async closeHamburgerMenuIfVisible() {
    if (await this.hamburgerMenuButton.isVisible()) {
      console.log("Hamburger menu detected, closing it.");
      await this.hamburgerMenuButton.click();
      await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay for menu closing
    } else {
      console.log("Hamburger menu not visible.");
    }
  }
}
