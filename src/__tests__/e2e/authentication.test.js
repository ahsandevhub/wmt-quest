import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { LoginPage } from "./pages/login.page.js";
import { NavigationPage } from "./pages/navigation.page.js";

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

async function testLoginWithValidCredentials(driver) {
  console.log("\n🔐 Testing Login with Valid Credentials...");
  let allTestsPassed = true;

  try {
    const loginPage = new LoginPage(driver);
    await loginPage.open();

    // Verify login page loads
    const isOnLoginPage = await loginPage.isOnLoginPage();
    if (isOnLoginPage) {
      console.log("✅ Login page loaded successfully");
    } else {
      console.log("❌ Login page did not load correctly");
      allTestsPassed = false;
    }

    // Perform login
    await loginPage.login(
      TEST_CONFIG.credentials.username,
      TEST_CONFIG.credentials.password
    );

    // Wait for redirect and verify successful login
    await loginPage.driver.sleep(3000);
    const currentUrl = await loginPage.getCurrentUrl();

    if (currentUrl.includes("/quest/quest-list")) {
      console.log("✅ Login successful - redirected to quest list");
    } else {
      console.log("❌ Login failed or incorrect redirect");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Valid login test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testLoginWithInvalidCredentials(driver) {
  console.log("\n🚫 Testing Login with Invalid Credentials...");
  let allTestsPassed = true;

  try {
    const loginPage = new LoginPage(driver);
    await loginPage.open();

    // Test with wrong password
    await loginPage.login(TEST_CONFIG.credentials.username, "wrongpassword123");
    await loginPage.driver.sleep(2000);

    const errorMessage = await loginPage.getErrorMessage();
    if (errorMessage) {
      console.log(
        "✅ Error message displayed for invalid credentials:",
        errorMessage
      );
    } else {
      console.log("⚠️ No error message found for invalid credentials");
    }

    // Verify we're still on login page
    const currentUrl = await loginPage.getCurrentUrl();
    if (currentUrl.includes("/") && !currentUrl.includes("/quest")) {
      console.log("✅ Stayed on login page after invalid credentials");
    } else {
      console.log("❌ Unexpected redirect after invalid credentials");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Invalid login test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testProtectedRouteAccess(driver) {
  console.log("\n🛡️ Testing Protected Route Access...");
  let allTestsPassed = true;

  try {
    // Try to access protected route without authentication
    await driver.get("http://localhost:5173/quest/quest-list");
    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/") && !currentUrl.includes("/quest")) {
      console.log(
        "✅ Protected route redirected to login when not authenticated"
      );
    } else {
      console.log("❌ Protected route accessible without authentication");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Protected route test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testAuthenticatedRouteAccess(driver) {
  console.log("\n✅ Testing Authenticated Route Access...");
  let allTestsPassed = true;

  try {
    // Login first
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login(
      TEST_CONFIG.credentials.username,
      TEST_CONFIG.credentials.password
    );
    await driver.sleep(2000);

    // Try to access various protected routes
    const protectedRoutes = [
      { path: "/quest/quest-list", name: "Quest List" },
      { path: "/quest/quest-requests", name: "Quest Requests" },
      { path: "/discount", name: "Discount" },
      { path: "/blindbox", name: "Blindbox" },
    ];

    for (const route of protectedRoutes) {
      try {
        await driver.get(`http://localhost:5173${route.path}`);
        await driver.sleep(2000);

        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes(route.path)) {
          console.log(`✅ ${route.name} route accessible when authenticated`);
        } else {
          console.log(
            `❌ ${route.name} route not accessible when authenticated`
          );
          allTestsPassed = false;
        }
      } catch (routeError) {
        console.log(
          `⚠️ Could not test ${route.name} route:`,
          routeError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Authenticated route access test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testLoginFormValidation(driver) {
  console.log("\n📝 Testing Login Form Validation...");
  let allTestsPassed = true;

  try {
    const loginPage = new LoginPage(driver);
    await loginPage.open();

    // Test empty form submission
    await loginPage.submitLogin();
    await driver.sleep(1000);

    const emptyFormError = await loginPage.getErrorMessage();
    if (emptyFormError) {
      console.log("✅ Validation error for empty form:", emptyFormError);
    } else {
      console.log("ℹ️ No specific validation message for empty form");
    }

    // Test with only username
    await loginPage.fillUsername("testuser");
    await loginPage.submitLogin();
    await driver.sleep(1000);

    const usernameOnlyError = await loginPage.getErrorMessage();
    if (usernameOnlyError) {
      console.log(
        "✅ Validation error for missing password:",
        usernameOnlyError
      );
    } else {
      console.log("ℹ️ No specific validation message for missing password");
    }

    // Clear form
    await loginPage.clearForm();
  } catch (error) {
    console.error("❌ Login form validation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testSessionPersistence(driver) {
  console.log("\n🔄 Testing Session Persistence...");
  let allTestsPassed = true;

  try {
    // Login
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login(
      TEST_CONFIG.credentials.username,
      TEST_CONFIG.credentials.password
    );
    await driver.sleep(2000);

    // Navigate to different pages
    const navigationPage = new NavigationPage(driver);
    await navigationPage.navigateToQuestRequests();
    await driver.sleep(1000);

    await navigationPage.navigateToQuestList();
    await driver.sleep(1000);

    // Refresh page and check if still authenticated
    await driver.navigate().refresh();
    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/quest")) {
      console.log("✅ Session persisted after page refresh");
    } else {
      console.log("❌ Session did not persist after page refresh");
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("❌ Session persistence test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runAuthenticationTests() {
  console.log("🚀 Starting Authentication E2E Tests...");

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Run test suites
    const protectedRouteTests = await testProtectedRouteAccess(driver);
    const validLoginTests = await testLoginWithValidCredentials(driver);
    const invalidLoginTests = await testLoginWithInvalidCredentials(driver);
    const formValidationTests = await testLoginFormValidation(driver);
    const authenticatedRouteTests = await testAuthenticatedRouteAccess(driver);
    const sessionTests = await testSessionPersistence(driver);

    allTestsPassed =
      protectedRouteTests &&
      validLoginTests &&
      invalidLoginTests &&
      formValidationTests &&
      authenticatedRouteTests &&
      sessionTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All Authentication tests passed!");
    } else {
      console.log(
        "\n❌ Some Authentication tests failed. Please check the logs above."
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
  const success = await runAuthenticationTests();
  process.exit(success ? 0 : 1);
})();
