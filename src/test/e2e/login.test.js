import { Builder, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { LoginPage } from "./pages/login.page.js"; // Adjust path as needed

(async () => {
  // Set up Chrome browser with additional options
  const options = new chrome.Options().addArguments(
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage"
  );

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  const USER = "peter-bo-3@yopmail.com";
  const PASS = "kbfSMcG71saaC280UCAiDg==";

  try {
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login(USER, PASS);

    // Assert: wait for URL change or a known post-login element
    await driver.wait(until.urlContains("/quest/quest-list"), 10000);

    // Print success message
    console.log("✅ Login successful!");
  } catch (e) {
    console.error("❌ Login test failed:", e.message);
  } finally {
    // Quit the browser
    await driver.quit();
  }
})();
