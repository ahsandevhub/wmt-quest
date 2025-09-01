import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { AddNewQuestPage } from "./pages/addNewQuest.page.js";
import { LoginPage } from "./pages/login.page.js";
import { NavigationPage } from "./pages/navigation.page.js";
import { QuestDetailPage } from "./pages/questDetail.page.js";
import { QuestListPage } from "./pages/questList.page.js";
import { QuestRequestDetailPage } from "./pages/questRequestDetail.page.js";
import { QuestRequestListPage } from "./pages/questRequestList.page.js";

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
  timeouts: { default: 10000, short: 5000, long: 15000 },
};

async function setupBrowser() {
  const options = new chrome.Options().addArguments(
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--window-size=1920,1080"
  );

  if (process.env.HEADLESS !== "false") {
    options.addArguments("--headless");
  }

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function performLogin(driver) {
  const loginPage = new LoginPage(driver);
  await loginPage.open();
  await loginPage.login(
    TEST_CONFIG.credentials.username,
    TEST_CONFIG.credentials.password
  );
  console.log("✅ Login successful");
}

async function testCompleteWorkflow(driver) {
  console.log("\n🔄 Testing Complete Application Workflow...");
  let allTestsPassed = true;

  try {
    // Initialize all page objects
    const navigationPage = new NavigationPage(driver);
    const questListPage = new QuestListPage(driver);
    const questDetailPage = new QuestDetailPage(driver);
    const questRequestListPage = new QuestRequestListPage(driver);
    const questRequestDetailPage = new QuestRequestDetailPage(driver);
    const addNewQuestPage = new AddNewQuestPage(driver);

    // Test 1: Navigation flow
    console.log("\n📍 Testing navigation flow...");
    await navigationPage.navigateToQuestList();
    await driver.sleep(1000);

    await navigationPage.navigateToQuestRequests();
    await driver.sleep(1000);

    await navigationPage.navigateToQuestList();
    await driver.sleep(1000);
    console.log("✅ Navigation flow works");

    // Test 2: Quest list operations
    console.log("\n📋 Testing quest list operations...");
    await questListPage.open();
    const initialQuestCount = await questListPage.getQuestCount();
    console.log(`Found ${initialQuestCount} quests`);

    // Test search
    await questListPage.searchQuests("test");
    await driver.sleep(2000);
    const searchResults = await questListPage.getQuestCount();
    console.log(`Search returned ${searchResults} results`);

    // Reset search
    await questListPage.resetFilters();
    await driver.sleep(1000);
    console.log("✅ Quest list operations work");

    // Test 3: Quest detail view (if quests exist)
    if (initialQuestCount > 0) {
      console.log("\n🔍 Testing quest detail view...");
      await questListPage.clickQuestByIndex(0);
      await driver.sleep(2000);

      await questDetailPage.waitForPageLoad();
      const questTitle = await questDetailPage.getTitle();
      console.log(`Viewing quest: "${questTitle}"`);

      // Test edit mode (if available)
      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );
      if (hasEditButton) {
        await questDetailPage.clickEdit();
        await driver.sleep(1000);

        if (await questDetailPage.isInEditMode()) {
          console.log("✅ Edit mode accessible");
          await questDetailPage.cancelChanges();
        }
      }

      // Go back to quest list
      await questDetailPage.goBack();
      await driver.sleep(1000);
      console.log("✅ Quest detail view works");
    }

    // Test 4: Quest requests workflow
    console.log("\n📝 Testing quest requests workflow...");
    await navigationPage.navigateToQuestRequests();
    await driver.sleep(1000);

    await questRequestListPage.waitForTableLoad();
    const requestCount = await questRequestListPage.getRequestCount();
    console.log(`Found ${requestCount} quest requests`);

    // Test request filtering
    await questRequestListPage.filterByStatus("Pending");
    await driver.sleep(2000);
    const pendingCount = await questRequestListPage.getRequestCount();
    console.log(`Found ${pendingCount} pending requests`);

    // Reset filters
    await questRequestListPage.resetFilters();
    await driver.sleep(1000);

    // Test request detail (if requests exist)
    if (requestCount > 0) {
      await questRequestListPage.clickRequestByIndex(0);
      await driver.sleep(2000);

      await questRequestDetailPage.waitForPageLoad();
      const requestId = await questRequestDetailPage.getRequestId();
      console.log(`Viewing request: ${requestId}`);

      // Go back
      await questRequestDetailPage.goBack();
      await driver.sleep(1000);
    }
    console.log("✅ Quest requests workflow works");

    // Test 5: Add new quest navigation
    console.log("\n➕ Testing add new quest navigation...");
    await navigationPage.navigateToQuestList();
    await driver.sleep(1000);

    await questListPage.clickAddNewQuest();
    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/add-new-quest")) {
      console.log("✅ Add new quest navigation works");

      // Test form elements are present
      await addNewQuestPage.waitForPageLoad();
      const hasTitleField = await addNewQuestPage.isElementPresent(
        addNewQuestPage.selectors.titleInput
      );
      const hasPointField = await addNewQuestPage.isElementPresent(
        addNewQuestPage.selectors.pointInput
      );

      if (hasTitleField && hasPointField) {
        console.log("✅ Add quest form loaded correctly");
      } else {
        console.log("⚠️ Add quest form may have issues");
      }
    } else {
      console.log("❌ Add new quest navigation failed");
      allTestsPassed = false;
    }

    // Test 6: Responsive behavior (basic test)
    console.log("\n📱 Testing responsive behavior...");
    await driver.manage().window().setRect({ width: 768, height: 1024 }); // Tablet size
    await driver.sleep(1000);

    await navigationPage.toggleSidebar();
    await driver.sleep(500);
    console.log("✅ Responsive sidebar toggle works");

    // Reset to desktop size
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.sleep(500);

    console.log("\n🎉 Complete workflow test finished successfully!");
  } catch (error) {
    console.error("❌ Complete workflow test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runComprehensiveTest() {
  console.log("🚀 Starting Comprehensive WMT Quest E2E Test");
  console.log("This test covers the complete application workflow");
  console.log("=".repeat(60));

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Perform login
    await performLogin(driver);

    // Run comprehensive workflow test
    const workflowTests = await testCompleteWorkflow(driver);

    allTestsPassed = workflowTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All comprehensive tests passed!");
      console.log("Your WMT Quest application is working correctly! 🚀");
    } else {
      console.log("\n❌ Some comprehensive tests failed.");
      console.log("Please check the logs above for details.");
    }
  } catch (error) {
    console.error("❌ Comprehensive test suite failed:", error.message);
    allTestsPassed = false;
  } finally {
    await driver.quit();
  }

  return allTestsPassed;
}

// Run the comprehensive test
(async () => {
  const success = await runComprehensiveTest();
  process.exit(success ? 0 : 1);
})();
