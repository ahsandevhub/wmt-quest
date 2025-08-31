import { By, until } from "selenium-webdriver";

export class BreadcrumbsBarPageObject {
  constructor(driver) {
    this.driver = driver;
  }

  // Selectors
  get selectors() {
    return {
      breadcrumbContainer: By.css(".ant-breadcrumb"),
      breadcrumbItems: By.css(
        ".ant-breadcrumb-link, .ant-breadcrumb-separator + span"
      ),
      breadcrumbLinks: By.css(".ant-breadcrumb-link a"),
      lastBreadcrumbItem: By.css(".ant-breadcrumb li:last-child span"),
    };
  }

  // Navigation methods
  async navigateToPage(url) {
    await this.driver.get(url);
    await this.waitForBreadcrumbsToLoad();
  }

  async waitForBreadcrumbsToLoad() {
    await this.driver.wait(
      until.elementLocated(this.selectors.breadcrumbContainer),
      5000
    );
  }

  // Breadcrumb interaction methods
  async getAllBreadcrumbTexts() {
    const items = await this.driver.findElements(
      this.selectors.breadcrumbItems
    );
    const texts = [];

    for (const item of items) {
      const text = await item.getText();
      if (text.trim() && text !== ">") {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  async getClickableBreadcrumbLinks() {
    const links = await this.driver.findElements(
      this.selectors.breadcrumbLinks
    );
    const linkData = [];

    for (const link of links) {
      const text = await link.getText();
      const href = await link.getAttribute("href");
      linkData.push({ text: text.trim(), href });
    }

    return linkData;
  }

  async clickBreadcrumbLink(linkText) {
    const links = await this.driver.findElements(
      this.selectors.breadcrumbLinks
    );

    for (const link of links) {
      const text = await link.getText();
      if (text.trim() === linkText) {
        await link.click();
        return;
      }
    }

    throw new Error(`Breadcrumb link with text "${linkText}" not found`);
  }

  async getLastBreadcrumbText() {
    const lastItem = await this.driver.findElement(
      this.selectors.lastBreadcrumbItem
    );
    return (await lastItem.getText()).trim();
  }

  async isBreadcrumbPresent() {
    try {
      await this.driver.findElement(this.selectors.breadcrumbContainer);
      return true;
    } catch {
      return false;
    }
  }

  async getBreadcrumbContainerClass() {
    const container = await this.driver.findElement(
      this.selectors.breadcrumbContainer
    );
    return await container.getAttribute("class");
  }
}
