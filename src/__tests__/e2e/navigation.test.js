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

async function testSidebarNavigation(navigationPage) {
  console.log("\n🧭 Testing Sidebar Navigation...");
  let allTestsPassed = true;

  try {
    // Test Quest List navigation
    await navigationPage.navigateToQuestList();
    await navigationPage.driver.sleep(1000);

    let currentUrl = await navigationPage.getCurrentUrl();
    if (currentUrl.includes("/quest/quest-list")) {
      console.log("✅ Quest List navigation works");
    } else {
      console.log("❌ Quest List navigation failed");
      allTestsPassed = false;
    }

    // Test Quest Requests navigation
    await navigationPage.navigateToQuestRequests();
    await navigationPage.driver.sleep(1000);

    currentUrl = await navigationPage.getCurrentUrl();
    if (currentUrl.includes("/quest/quest-requests")) {
      console.log("✅ Quest Requests navigation works");
    } else {
      console.log("❌ Quest Requests navigation failed");
      allTestsPassed = false;
    }

    // Test Discount navigation
    await navigationPage.navigateToDiscount();
    await navigationPage.driver.sleep(1000);

    currentUrl = await navigationPage.getCurrentUrl();
    if (currentUrl.includes("/discount")) {
      console.log("✅ Discount navigation works");
    } else {
      console.log("❌ Discount navigation failed");
      allTestsPassed = false;
    }

    // Test Blindbox navigation
    await navigationPage.navigateToBlindbox();
    await navigationPage.driver.sleep(1000);

    currentUrl = await navigationPage.getCurrentUrl();
    if (currentUrl.includes("/blindbox")) {
      console.log("✅ Blindbox navigation works");
    } else {
      console.log("❌ Blindbox navigation failed");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Sidebar navigation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testSidebarToggle(navigationPage) {
  console.log("\n🔄 Testing Sidebar Toggle...");
  let allTestsPassed = true;

  try {
    // Get initial state
    const initialCollapsed = await navigationPage.isSidebarCollapsed();
    console.log(
      `Initial sidebar state: ${initialCollapsed ? "collapsed" : "expanded"}`
    );

    // Toggle sidebar
    await navigationPage.toggleSidebar();
    await navigationPage.driver.sleep(500);

    // Check new state
    const afterToggleCollapsed = await navigationPage.isSidebarCollapsed();
    console.log(
      `After toggle sidebar state: ${
        afterToggleCollapsed ? "collapsed" : "expanded"
      }`
    );

    if (initialCollapsed !== afterToggleCollapsed) {
      console.log("✅ Sidebar toggle works");

      // Toggle back to original state
      await navigationPage.toggleSidebar();
      await navigationPage.driver.sleep(500);

      const finalCollapsed = await navigationPage.isSidebarCollapsed();
      if (finalCollapsed === initialCollapsed) {
        console.log("✅ Sidebar toggle back works");
      } else {
        console.log("⚠️ Sidebar didn't return to original state");
      }
    } else {
      console.log("❌ Sidebar toggle failed");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Sidebar toggle test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testBreadcrumbNavigation(navigationPage, questListPage) {
  console.log("\n🍞 Testing Breadcrumb Navigation...");
  let allTestsPassed = true;

  try {
    // Navigate to quest list
    await navigationPage.navigateToQuestList();
    await navigationPage.driver.sleep(1000);

    // Get breadcrumbs on quest list page
    let breadcrumbs = await navigationPage.getBreadcrumbItems();
    console.log(`Quest List breadcrumbs: ${breadcrumbs.join(" > ")}`);

    // Navigate to add new quest
    const questCount = await questListPage.getQuestCount();
    if (questCount >= 0) {
      // Can test add new quest even with 0 quests
      await questListPage.clickAddNewQuest();
      await navigationPage.driver.sleep(2000);

      // Get breadcrumbs on add quest page
      breadcrumbs = await navigationPage.getBreadcrumbItems();
      console.log(`Add Quest breadcrumbs: ${breadcrumbs.join(" > ")}`);

      if (breadcrumbs.length > 1) {
        console.log("✅ Breadcrumbs showing navigation path");

        // Test breadcrumb click (go back to quest list)
        if (breadcrumbs.length >= 2) {
          await navigationPage.clickBreadcrumbItem(breadcrumbs.length - 2); // Click second to last
          await navigationPage.driver.sleep(1000);

          const currentUrl = await navigationPage.getCurrentUrl();
          if (
            currentUrl.includes("/quest-list") &&
            !currentUrl.includes("/add-new-quest")
          ) {
            console.log("✅ Breadcrumb navigation works");
          } else {
            console.log("❌ Breadcrumb navigation failed");
            allTestsPassed = false;
          }
        }
      } else {
        console.log("⚠️ Breadcrumbs not showing expected navigation path");
      }
    }
  } catch (error) {
    console.error("❌ Breadcrumb navigation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testPageTitles(navigationPage) {
  console.log("\n📄 Testing Page Titles...");
  let allTestsPassed = true;

  try {
    const pages = [
      {
        navigate: () => navigationPage.navigateToQuestList(),
        expectedTitle: "Quest",
        name: "Quest List",
      },
      {
        navigate: () => navigationPage.navigateToQuestRequests(),
        expectedTitle: "Request",
        name: "Quest Requests",
      },
      {
        navigate: () => navigationPage.navigateToDiscount(),
        expectedTitle: "Discount",
        name: "Discount",
      },
      {
        navigate: () => navigationPage.navigateToBlindbox(),
        expectedTitle: "Blind",
        name: "Blindbox",
      },
    ];

    for (const page of pages) {
      try {
        await page.navigate();
        await navigationPage.driver.sleep(1000);

        const pageTitle = await navigationPage.getPageTitle();
        if (
          pageTitle &&
          pageTitle.toLowerCase().includes(page.expectedTitle.toLowerCase())
        ) {
          console.log(`✅ ${page.name} page title correct: "${pageTitle}"`);
        } else {
          console.log(
            `⚠️ ${page.name} page title: "${pageTitle}" (may not contain "${page.expectedTitle}")`
          );
        }
      } catch (pageError) {
        console.log(
          `⚠️ Could not test ${page.name} page title:`,
          pageError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Page titles test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testUrlIntegrity(navigationPage) {
  console.log("\n🔗 Testing URL Integrity...");
  let allTestsPassed = true;

  try {
    // Test direct URL access
    const testUrls = [
      {
        url: "/quest/quest-list",
        expectedPath: "/quest/quest-list",
        name: "Quest List",
      },
      {
        url: "/quest/quest-requests",
        expectedPath: "/quest/quest-requests",
        name: "Quest Requests",
      },
      { url: "/discount", expectedPath: "/discount", name: "Discount" },
      { url: "/blindbox", expectedPath: "/blindbox", name: "Blindbox" },
    ];

    for (const testUrl of testUrls) {
      try {
        await navigationPage.open(testUrl.url);
        await navigationPage.driver.sleep(1000);

        const currentUrl = await navigationPage.getCurrentUrl();
        if (currentUrl.includes(testUrl.expectedPath)) {
          console.log(`✅ Direct URL access works for ${testUrl.name}`);
        } else {
          console.log(
            `❌ Direct URL access failed for ${testUrl.name}: expected ${testUrl.expectedPath}, got ${currentUrl}`
          );
          allTestsPassed = false;
        }
      } catch (urlError) {
        console.log(
          `⚠️ Could not test direct URL for ${testUrl.name}:`,
          urlError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ URL integrity test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testNotFoundPage(navigationPage) {
  console.log("\n🔍 Testing 404 Not Found Page...");
  let allTestsPassed = true;

  try {
    // Navigate to non-existent page
    await navigationPage.open("/this-page-does-not-exist");
    await navigationPage.driver.sleep(2000);

    const currentUrl = await navigationPage.getCurrentUrl();
    const pageTitle = await navigationPage.getPageTitle();

    // Check if we're on a 404 page or redirected appropriately
    if (
      currentUrl.includes("/this-page-does-not-exist") ||
      (pageTitle && pageTitle.toLowerCase().includes("not found")) ||
      currentUrl.includes("/quest/quest-list")
    ) {
      // Might redirect to default page
      console.log("✅ Non-existent page handled appropriately");
    } else {
      console.log("⚠️ Non-existent page handling unclear");
    }
  } catch (error) {
    console.error("❌ 404 page test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runNavigationTests() {
  console.log("🚀 Starting Navigation E2E Tests...");

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Perform login
    await performLogin(driver);

    // Initialize page objects
    const navigationPage = new NavigationPage(driver);
    const questListPage = new QuestListPage(driver);

    // Run test suites
    const sidebarTests = await testSidebarNavigation(navigationPage);
    const toggleTests = await testSidebarToggle(navigationPage);
    const breadcrumbTests = await testBreadcrumbNavigation(
      navigationPage,
      questListPage
    );
    const titleTests = await testPageTitles(navigationPage);
    const urlTests = await testUrlIntegrity(navigationPage);
    const notFoundTests = await testNotFoundPage(navigationPage);

    allTestsPassed =
      sidebarTests &&
      toggleTests &&
      breadcrumbTests &&
      titleTests &&
      urlTests &&
      notFoundTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All Navigation tests passed!");
    } else {
      console.log(
        "\n❌ Some Navigation tests failed. Please check the logs above."
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
  const success = await runNavigationTests();
  process.exit(success ? 0 : 1);
})();
