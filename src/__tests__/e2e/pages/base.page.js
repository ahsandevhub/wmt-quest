import { By, until } from "selenium-webdriver";

/**
 * Base Page Object class with common functionality
 */
export class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.baseUrl = "http://localhost:5173";
    this.defaultTimeout = 10000;
  }

  async open(path = "") {
    await this.driver.get(`${this.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.driver.wait(
      until.elementLocated(By.css("body")),
      this.defaultTimeout
    );
  }

  async waitForElement(selector, timeout = this.defaultTimeout) {
    return await this.driver.wait(until.elementLocated(selector), timeout);
  }

  async waitForElementVisible(selector, timeout = this.defaultTimeout) {
    const element = await this.waitForElement(selector, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async waitForElementClickable(selector, timeout = this.defaultTimeout) {
    const element = await this.waitForElement(selector, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  async isElementPresent(selector) {
    try {
      await this.driver.findElement(selector);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getText(selector) {
    const element = await this.waitForElement(selector);
    return await element.getText();
  }

  async click(selector) {
    const element = await this.waitForElementClickable(selector);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      element
    );
    await this.driver.sleep(200);
    await element.click();
  }

  async type(selector, text) {
    const element = await this.waitForElement(selector);
    await element.clear();
    await element.sendKeys(text);
  }

  async selectDropdownOption(selector, optionText) {
    await this.click(selector);
    await this.driver.sleep(500);
    const option = await this.waitForElement(
      By.xpath(
        `//div[contains(@class, 'ant-select-item')]//div[contains(text(), '${optionText}')]`
      )
    );
    await option.click();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async waitForUrlContains(urlPart, timeout = this.defaultTimeout) {
    await this.driver.wait(until.urlContains(urlPart), timeout);
  }

  async waitForTextInElement(selector, text, timeout = this.defaultTimeout) {
    await this.driver.wait(
      until.elementTextContains(await this.waitForElement(selector), text),
      timeout
    );
  }

  async scrollToElement(selector) {
    const element = await this.waitForElement(selector);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      element
    );
    await this.driver.sleep(200);
  }

  async sleep(ms) {
    await this.driver.sleep(ms);
  }
}
