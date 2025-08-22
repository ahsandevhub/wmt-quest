import { By, until } from "selenium-webdriver";

export class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = "http://localhost:5173";
    this.selectors = {
      username: By.name("username"),
      password: By.name("password"),
      submit: By.css("button[type='submit']"),
    };
  }

  async open() {
    await this.driver.get(this.url);
  }

  async login(username, password) {
    const usernameField = await this.driver.wait(
      until.elementLocated(this.selectors.username),
      10000
    );
    const passwordField = await this.driver.findElement(
      this.selectors.password
    );
    await usernameField.sendKeys(username);
    await passwordField.sendKeys(password);
    await this.driver.findElement(this.selectors.submit).click();
  }
}
