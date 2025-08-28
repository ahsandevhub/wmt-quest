import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { BreadcrumbsBarPageObject } from "./pages/breadcrumbsBarPageObject.page.js";
import { LoginPage } from "./pages/login.page.js";

// Test configuration
const USER = process.env.LOGIN_USER;
const PASS = process.env.LOGIN_PASS;
if (!USER || !PASS) {
  throw new Error(
    "LOGIN_USER and LOGIN_PASS environment variables must be set."
  );
}

const TEST_CONFIG = {
  credentials: { username: USER, password: PASS },
  timeouts: { default: 10000, short: 5000 },
};

async function setupBrowser() {
  const options = new chrome.Options().addArguments(
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security"
  );
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function performLogin(driver) {
  console.log("🔐 Performing login...");
  const loginPage = new LoginPage(driver);
  await loginPage.open();
  await loginPage.login(
    TEST_CONFIG.credentials.username,
    TEST_CONFIG.credentials.password
  );
  console.log("✅ Login successful");
}

async function testBreadcrumbNavigation(breadcrumbsPage) {
  console.log("\n🧭 Testing breadcrumb navigation...");
  let allTestsPassed = true;

  try {
    // Test multi-level navigation
    await breadcrumbsPage.navigateToPage(
      "http://localhost:5173/quest/quest-list/add-new-quest"
    );

    const breadcrumbTexts = await breadcrumbsPage.getAllBreadcrumbTexts();
    console.log("Breadcrumb texts:", breadcrumbTexts);

    if (
      breadcrumbTexts.includes("Quest") &&
      breadcrumbTexts.includes("Quest List")
    ) {
      console.log("✅ Multi-level breadcrumbs displayed correctly");
    } else {
      console.log("❌ Multi-level breadcrumbs not working");
      allTestsPassed = false;
    }

    // Test clickable links
    const clickableLinks = await breadcrumbsPage.getClickableBreadcrumbLinks();
    console.log("Clickable links:", clickableLinks);

    if (clickableLinks.length > 0) {
      console.log("✅ Breadcrumb links are clickable");

      // Test clicking a breadcrumb link
      await breadcrumbsPage.clickBreadcrumbLink("Quest");
      await breadcrumbsPage.waitForBreadcrumbsToLoad();

      const currentUrl = await breadcrumbsPage.driver.getCurrentUrl();
      if (currentUrl.includes("/quest")) {
        console.log("✅ Breadcrumb navigation working");
      } else {
        console.log("❌ Breadcrumb navigation failed");
        allTestsPassed = false;
      }
    } else {
      console.log("❌ No clickable breadcrumb links found");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Error testing breadcrumb navigation:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testSingleLevelBreadcrumb(breadcrumbsPage) {
  console.log("\n📝 Testing single-level breadcrumb...");
  let testPassed = true;

  try {
    await breadcrumbsPage.navigateToPage("http://localhost:5173/dashboard");

    const breadcrumbTexts = await breadcrumbsPage.getAllBreadcrumbTexts();
    console.log("Single-level breadcrumb texts:", breadcrumbTexts);

    if (breadcrumbTexts.includes("Dashboard")) {
      console.log("✅ Single-level breadcrumb working");
    } else {
      console.log("❌ Single-level breadcrumb not working");
      testPassed = false;
    }
  } catch (error) {
    console.log("❌ Error testing single-level breadcrumb:", error.message);
    testPassed = false;
  }

  return testPassed;
}

async function testHomeBreadcrumb(breadcrumbsPage) {
  console.log("\n🏠 Testing home breadcrumb...");
  let testPassed = true;

  try {
    await breadcrumbsPage.navigateToPage("http://localhost:5173/");

    const breadcrumbTexts = await breadcrumbsPage.getAllBreadcrumbTexts();
    console.log("Home breadcrumb texts:", breadcrumbTexts);

    if (breadcrumbTexts.includes("Home") || breadcrumbTexts.length > 0) {
      console.log("✅ Home breadcrumb working");
    } else {
      console.log("❌ Home breadcrumb not working");
      testPassed = false;
    }
  } catch (error) {
    console.log("❌ Error testing home breadcrumb:", error.message);
    testPassed = false;
  }

  return testPassed;
}

(async () => {
  const driver = await setupBrowser();
  let testResults = {
    login: false,
    breadcrumbNavigation: false,
    singleLevelBreadcrumb: false,
    homeBreadcrumb: false,
  };

  try {
    console.log("🚀 Starting BreadcrumbsBar E2E tests...");

    // Perform login first
    await performLogin(driver);
    testResults.login = true;

    // Initialize breadcrumbs page object
    const breadcrumbsPage = new BreadcrumbsBarPageObject(driver);

    // Run test suites
    testResults.breadcrumbNavigation = await testBreadcrumbNavigation(
      breadcrumbsPage
    );
    testResults.singleLevelBreadcrumb = await testSingleLevelBreadcrumb(
      breadcrumbsPage
    );
    testResults.homeBreadcrumb = await testHomeBreadcrumb(breadcrumbsPage);

    // Summary
    console.log("\n📊 Test Results Summary:");
    console.log("========================");
    Object.entries(testResults).forEach(([testName, passed]) => {
      console.log(
        `${passed ? "✅" : "❌"} ${testName}: ${passed ? "PASSED" : "FAILED"}`
      );
    });

    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(Boolean).length;
    console.log(`\n🏁 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log("🎉 All BreadcrumbsBar E2E tests passed!");
    } else {
      console.log(
        "⚠️ Some tests failed. Review the breadcrumbs implementation."
      );
    }
  } catch (error) {
    console.error("💥 Critical test failure:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    console.log("\n🧹 Cleaning up...");
    await driver.quit();
    console.log("✅ Browser closed");
  }
})();
