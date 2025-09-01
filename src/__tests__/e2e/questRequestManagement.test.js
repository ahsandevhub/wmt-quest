import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { LoginPage } from "./pages/login.page.js";
import { NavigationPage } from "./pages/navigation.page.js";
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

async function testQuestRequestListBasicFunctionality(questRequestListPage) {
  console.log("\n📋 Testing Quest Request List Basic Functionality...");
  let allTestsPassed = true;

  try {
    // Test quest request list loads
    await questRequestListPage.open();
    const requestCount = await questRequestListPage.getRequestCount();
    console.log(`✅ Quest request list loaded with ${requestCount} requests`);

    // Test total items display
    const totalItems = await questRequestListPage.getTotalItemsCount();
    console.log(`✅ Total items: ${totalItems}`);

    // Test if table is empty vs has data
    const isEmpty = await questRequestListPage.isTableEmpty();
    if (isEmpty) {
      console.log("ℹ️ Quest request table is empty");
    } else {
      console.log("✅ Quest request table has data");
    }
  } catch (error) {
    console.error(
      "❌ Quest request list basic functionality test failed:",
      error.message
    );
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestRequestFilters(questRequestListPage) {
  console.log("\n🔍 Testing Quest Request Filters...");
  let allTestsPassed = true;

  try {
    // Test search functionality
    await questRequestListPage.searchRequests("test");
    await questRequestListPage.driver.sleep(2000);
    const searchResultCount = await questRequestListPage.getRequestCount();
    console.log(`✅ Search returned ${searchResultCount} results`);

    // Test status filter
    await questRequestListPage.resetFilters();
    await questRequestListPage.driver.sleep(1000);
    await questRequestListPage.filterByStatus("Pending");
    await questRequestListPage.driver.sleep(2000);
    console.log("✅ Status filter applied");

    // Test quest type filter
    await questRequestListPage.resetFilters();
    await questRequestListPage.driver.sleep(1000);
    await questRequestListPage.filterByQuestType("Common");
    await questRequestListPage.driver.sleep(2000);
    console.log("✅ Quest type filter applied");

    // Test date range filter
    await questRequestListPage.resetFilters();
    await questRequestListPage.driver.sleep(1000);
    const startDate = "2024-01-01";
    const endDate = "2024-12-31";
    await questRequestListPage.filterByDateRange(startDate, endDate);
    await questRequestListPage.driver.sleep(2000);
    console.log("✅ Date range filter applied");

    // Reset all filters
    await questRequestListPage.resetFilters();
    await questRequestListPage.driver.sleep(1000);
    console.log("✅ All filters reset successfully");
  } catch (error) {
    console.error("❌ Quest request filters test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestRequestPagination(questRequestListPage) {
  console.log("\n📄 Testing Quest Request Pagination...");
  let allTestsPassed = true;

  try {
    // Test next page navigation (if available)
    const canGoNext = await questRequestListPage.goToNextPage();
    if (canGoNext) {
      console.log("✅ Successfully navigated to next page");
      await questRequestListPage.driver.sleep(1000);

      // Go back to first page for consistency
      await questRequestListPage.open();
      await questRequestListPage.driver.sleep(1000);
    } else {
      console.log("ℹ️ Only one page available, pagination test limited");
    }
  } catch (error) {
    console.error("❌ Quest request pagination test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestRequestDetailNavigation(
  questRequestListPage,
  questRequestDetailPage
) {
  console.log("\n🔍 Testing Quest Request Detail Navigation...");
  let allTestsPassed = true;

  try {
    await questRequestListPage.open();
    const requestCount = await questRequestListPage.getRequestCount();

    if (requestCount > 0) {
      // Click on first request
      await questRequestListPage.clickRequestByIndex(0);
      await questRequestListPage.driver.sleep(2000);

      // Verify we're on detail page
      const currentUrl = await questRequestListPage.getCurrentUrl();
      if (
        currentUrl.includes("/quest-requests/") &&
        !currentUrl.endsWith("/quest-requests")
      ) {
        console.log("✅ Quest request detail navigation works");

        // Test detail page loads correctly
        await questRequestDetailPage.waitForPageLoad();
        const requestId = await questRequestDetailPage.getRequestId();
        const status = await questRequestDetailPage.getStatus();

        if (requestId) {
          console.log(
            `✅ Detail page loaded - Request ID: ${requestId}, Status: ${status}`
          );
        }

        // Test back navigation
        await questRequestDetailPage.goBack();
        await questRequestListPage.driver.sleep(1000);
        const backUrl = await questRequestListPage.getCurrentUrl();
        if (
          backUrl.includes("/quest-requests") &&
          !backUrl.includes("/quest-requests/")
        ) {
          console.log("✅ Back navigation works");
        } else {
          console.log("❌ Back navigation failed");
          allTestsPassed = false;
        }
      } else {
        console.log("❌ Quest request detail navigation failed");
        allTestsPassed = false;
      }
    } else {
      console.log("ℹ️ No quest requests available for detail navigation test");
    }
  } catch (error) {
    console.error(
      "❌ Quest request detail navigation test failed:",
      error.message
    );
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestRequestActions(
  questRequestDetailPage,
  questRequestListPage
) {
  console.log("\n⚡ Testing Quest Request Actions...");
  let allTestsPassed = true;

  try {
    await questRequestListPage.open();
    const requestCount = await questRequestListPage.getRequestCount();

    if (requestCount > 0) {
      // Find a pending request to test actions
      await questRequestListPage.filterByStatus("Pending");
      await questRequestListPage.driver.sleep(2000);

      const pendingCount = await questRequestListPage.getRequestCount();

      if (pendingCount > 0) {
        await questRequestListPage.clickRequestByIndex(0);
        await questRequestListPage.driver.sleep(2000);

        // Check if approve/reject buttons are visible
        const canApprove =
          await questRequestDetailPage.isApproveButtonVisible();
        const canReject = await questRequestDetailPage.isRejectButtonVisible();

        if (canApprove && canReject) {
          console.log(
            "✅ Approve/Reject buttons are visible for pending request"
          );

          // Test reject modal (without actually rejecting)
          await questRequestDetailPage.clickReject();
          await questRequestDetailPage.driver.sleep(1000);
          await questRequestDetailPage.enterRejectReason(
            "Test reason - this is a test"
          );
          await questRequestDetailPage.cancelRejection();
          await questRequestDetailPage.driver.sleep(1000);
          console.log("✅ Reject modal functionality works");

          // Test approve modal (without actually approving)
          await questRequestDetailPage.clickApprove();
          await questRequestDetailPage.driver.sleep(1000);
          await questRequestDetailPage.cancelApproval();
          await questRequestDetailPage.driver.sleep(1000);
          console.log("✅ Approve modal functionality works");
        } else {
          console.log(
            "ℹ️ No action buttons visible (request may not be pending)"
          );
        }
      } else {
        console.log("ℹ️ No pending requests found for action testing");
      }
    } else {
      console.log("ℹ️ No quest requests available for action testing");
    }
  } catch (error) {
    console.error("❌ Quest request actions test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runQuestRequestTests() {
  console.log("🚀 Starting Quest Request E2E Tests...");

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Perform login
    await performLogin(driver);

    // Initialize page objects
    const questRequestListPage = new QuestRequestListPage(driver);
    const questRequestDetailPage = new QuestRequestDetailPage(driver);
    const navigationPage = new NavigationPage(driver);

    // Navigate to quest requests
    await navigationPage.navigateToQuestRequests();
    await driver.sleep(1000);

    // Run test suites
    const basicTests = await testQuestRequestListBasicFunctionality(
      questRequestListPage
    );
    const filterTests = await testQuestRequestFilters(questRequestListPage);
    const paginationTests = await testQuestRequestPagination(
      questRequestListPage
    );
    const navigationTests = await testQuestRequestDetailNavigation(
      questRequestListPage,
      questRequestDetailPage
    );
    const actionTests = await testQuestRequestActions(
      questRequestDetailPage,
      questRequestListPage
    );

    allTestsPassed =
      basicTests &&
      filterTests &&
      paginationTests &&
      navigationTests &&
      actionTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All Quest Request tests passed!");
    } else {
      console.log(
        "\n❌ Some Quest Request tests failed. Please check the logs above."
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
  const success = await runQuestRequestTests();
  process.exit(success ? 0 : 1);
})();
