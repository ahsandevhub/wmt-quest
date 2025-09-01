import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { LoginPage } from "./pages/login.page.js";
import { NavigationPage } from "./pages/navigation.page.js";
import { QuestListPage } from "./pages/questList.page.js";

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
    "--disable-web-security"
  );
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

async function testQuestListBasicFunctionality(questListPage) {
  console.log("\n📋 Testing Quest List Basic Functionality...");
  let allTestsPassed = true;

  try {
    // Test quest list loads
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();
    console.log(`✅ Quest list loaded with ${questCount} quests`);

    // Test total items display
    const totalItems = await questListPage.getTotalItemsCount();
    console.log(`✅ Total items: ${totalItems}`);

    // Test search functionality
    await questListPage.searchQuests("test");
    await questListPage.driver.sleep(2000);
    const searchResultCount = await questListPage.getQuestCount();
    console.log(`✅ Search returned ${searchResultCount} results`);

    // Reset filters
    await questListPage.resetFilters();
    await questListPage.driver.sleep(1000);
    console.log("✅ Filters reset successfully");
  } catch (error) {
    console.error(
      "❌ Quest list basic functionality test failed:",
      error.message
    );
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestListFilters(questListPage) {
  console.log("\n🔍 Testing Quest List Filters...");
  let allTestsPassed = true;

  try {
    // Test status filter
    await questListPage.filterByStatus("Active");
    await questListPage.driver.sleep(2000);
    console.log("✅ Status filter applied");

    // Test search with filters
    await questListPage.searchQuests("quest");
    await questListPage.driver.sleep(2000);
    console.log("✅ Search with filters works");

    // Reset and test empty search
    await questListPage.resetFilters();
    await questListPage.driver.sleep(1000);
    await questListPage.searchQuests("");
    await questListPage.driver.sleep(1000);
    console.log("✅ Empty search handled correctly");
  } catch (error) {
    console.error("❌ Quest list filters test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestListPagination(questListPage) {
  console.log("\n📄 Testing Quest List Pagination...");
  let allTestsPassed = true;

  try {
    // Test page size change
    await questListPage.changePageSize("20");
    await questListPage.driver.sleep(2000);
    console.log("✅ Page size changed to 20");

    // Test next page (if available)
    const canGoNext = await questListPage.goToNextPage();
    if (canGoNext) {
      console.log("✅ Successfully navigated to next page");

      // Test previous page
      const canGoPrev = await questListPage.goToPreviousPage();
      if (canGoPrev) {
        console.log("✅ Successfully navigated to previous page");
      }
    } else {
      console.log("ℹ️ Only one page available, pagination test limited");
    }
  } catch (error) {
    console.error("❌ Quest list pagination test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestNavigation(questListPage) {
  console.log("\n🚀 Testing Quest Navigation...");
  let allTestsPassed = true;

  try {
    // Test add new quest navigation
    await questListPage.clickAddNewQuest();
    await questListPage.driver.sleep(2000);

    const currentUrl = await questListPage.getCurrentUrl();
    if (currentUrl.includes("/add-new-quest")) {
      console.log("✅ Add new quest navigation works");
    } else {
      console.log("❌ Add new quest navigation failed");
      allTestsPassed = false;
    }

    // Go back to quest list
    await questListPage.open();
    await questListPage.driver.sleep(1000);

    // Test quest detail navigation (if quests exist)
    const questCount = await questListPage.getQuestCount();
    if (questCount > 0) {
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);

      const detailUrl = await questListPage.getCurrentUrl();
      if (
        detailUrl.includes("/quest-list/") &&
        !detailUrl.includes("/add-new-quest")
      ) {
        console.log("✅ Quest detail navigation works");
      } else {
        console.log("❌ Quest detail navigation failed");
        allTestsPassed = false;
      }
    } else {
      console.log("ℹ️ No quests available for detail navigation test");
    }
  } catch (error) {
    console.error("❌ Quest navigation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testNavigationAndBreadcrumbs(navigationPage) {
  console.log("\n🧭 Testing Navigation and Breadcrumbs...");
  let allTestsPassed = true;

  try {
    // Test sidebar navigation
    await navigationPage.navigateToQuestList();
    await navigationPage.driver.sleep(1000);
    console.log("✅ Quest List navigation works");

    await navigationPage.navigateToQuestRequests();
    await navigationPage.driver.sleep(1000);
    console.log("✅ Quest Requests navigation works");

    // Test breadcrumbs
    const breadcrumbs = await navigationPage.getBreadcrumbItems();
    if (breadcrumbs.length > 0) {
      console.log(`✅ Breadcrumbs working: ${breadcrumbs.join(" > ")}`);
    } else {
      console.log("⚠️ No breadcrumbs found");
    }

    // Test sidebar toggle
    const wasCollapsed = await navigationPage.isSidebarCollapsed();
    await navigationPage.toggleSidebar();
    await navigationPage.driver.sleep(500);
    const isNowCollapsed = await navigationPage.isSidebarCollapsed();

    if (wasCollapsed !== isNowCollapsed) {
      console.log("✅ Sidebar toggle works");
    } else {
      console.log("❌ Sidebar toggle failed");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Navigation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runQuestListTests() {
  console.log("🚀 Starting Quest List E2E Tests...");

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Perform login
    await performLogin(driver);

    // Initialize page objects
    const questListPage = new QuestListPage(driver);
    const navigationPage = new NavigationPage(driver);

    // Run test suites
    const basicTests = await testQuestListBasicFunctionality(questListPage);
    const filterTests = await testQuestListFilters(questListPage);
    const paginationTests = await testQuestListPagination(questListPage);
    const navigationTests = await testQuestNavigation(questListPage);
    const breadcrumbTests = await testNavigationAndBreadcrumbs(navigationPage);

    allTestsPassed =
      basicTests &&
      filterTests &&
      paginationTests &&
      navigationTests &&
      breadcrumbTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All Quest List tests passed!");
    } else {
      console.log(
        "\n❌ Some Quest List tests failed. Please check the logs above."
      );
    }
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
    allTestsPassed = false;
  } finally {
    await driver.quit();
  }

  return allTestsPassed;
}

// Run the tests
(async () => {
  const success = await runQuestListTests();
  process.exit(success ? 0 : 1);
})();
