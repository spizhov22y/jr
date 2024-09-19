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
    })
  ) {}

  // Navigate to the Projects section
  async navigateToProjects() {
    await this.projectLink.click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay
  }

  // Navigate to the "All Kitchens" section
  async navigateToAllKitchens() {
    await this.allKitchensLink.click();
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

  // Navigate to the "Wardrobes" section
  async navigateToWardrobes() {
    await this.wardrobesLink.click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate human-like delay
  }

  // Open a specific project from the "Wardrobes" section
  async openWardrobesProject() {
    await this.viewProjectLink.click();
    await this.page.waitForTimeout(timeGenerator.waitOneToThreeTime()); // Simulate delay between actions
  }
}
