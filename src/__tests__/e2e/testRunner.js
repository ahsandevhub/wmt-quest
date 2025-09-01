import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Import test modules
import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_CONFIG = {
  browser: {
    headless: process.env.HEADLESS !== "false",
    timeout: 30000,
  },
  server: {
    url: process.env.TEST_SERVER_URL || "http://localhost:5173",
    checkTimeout: 10000,
  },
};

// Test suite definitions
const TEST_SUITES = [
  {
    name: "Authentication Tests",
    file: "authentication.test.js",
    description:
      "Tests login, logout, protected routes, and session management",
    timeout: 120000, // 2 minutes
  },
  {
    name: "Navigation Tests",
    file: "navigation.test.js",
    description: "Tests sidebar navigation, breadcrumbs, and URL routing",
    timeout: 120000,
  },
  {
    name: "Quest List Tests",
    file: "questList.test.js",
    description: "Tests quest list functionality, filtering, and pagination",
    timeout: 150000, // 2.5 minutes
  },
  {
    name: "Quest Detail Tests",
    file: "questDetail.test.js",
    description: "Tests quest detail view, editing, and form validation",
    timeout: 180000, // 3 minutes
  },
  {
    name: "Quest Request Management Tests",
    file: "questRequestManagement.test.js",
    description:
      "Tests quest request listing, filtering, and approval workflow",
    timeout: 150000,
  },
  {
    name: "Add New Quest Tests",
    file: "addNewQuest.test.js",
    description: "Tests quest creation form and validation",
    timeout: 180000,
  },
  {
    name: "Breadcrumbs Tests",
    file: "breadcrumbsBar.test.js",
    description: "Tests breadcrumb navigation functionality",
    timeout: 120000,
  },
  {
    name: "Comprehensive Workflow Test",
    file: "comprehensive.test.js",
    description: "Tests complete application workflow end-to-end",
    timeout: 300000, // 5 minutes
  },
];

async function checkServerAvailability() {
  console.log(
    `🔍 Checking if server is running at ${TEST_CONFIG.server.url}...`
  );

  try {
    const response = await fetch(TEST_CONFIG.server.url);
    if (response.ok || response.status === 200) {
      console.log("✅ Server is running and accessible");
      return true;
    }
  } catch (error) {
    console.error("❌ Server is not accessible:", error.message);
    console.log("\n💡 Make sure to start the development server:");
    console.log("   npm run dev");
    console.log("\n💡 Or set a different server URL:");
    console.log("   TEST_SERVER_URL=http://your-server:port npm run test:e2e");
    return false;
  }

  return false;
}

async function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...");

  const requiredVars = ["LOGIN_USER", "LOGIN_PASS"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingVars.join(", ")
    );
    console.log("\n💡 Create a .env file with:");
    console.log("   LOGIN_USER=your_username");
    console.log("   LOGIN_PASS=your_password");
    return false;
  }

  console.log("✅ Environment variables configured");
  return true;
}

async function setupBrowser() {
  const options = new chrome.Options();

  if (TEST_CONFIG.browser.headless) {
    options.addArguments("--headless");
  }

  options.addArguments(
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--window-size=1920,1080"
  );

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function runTestSuite(testSuite) {
  console.log(`\n🧪 Running ${testSuite.name}...`);
  console.log(`📝 ${testSuite.description}`);

  const testPath = join(__dirname, testSuite.file);

  try {
    // Use dynamic import to run the test
    const testModule = await import(testPath);

    // If the test file exports a main function, call it
    if (typeof testModule.default === "function") {
      const result = await testModule.default();
      return result;
    } else {
      // Otherwise, execute the file directly
      execSync(`node "${testPath}"`, {
        stdio: "inherit",
        timeout: testSuite.timeout,
        env: { ...process.env },
      });
      return true;
    }
  } catch (error) {
    console.error(`❌ ${testSuite.name} failed:`, error.message);
    return false;
  }
}

async function runAllTests() {
  console.log("🚀 Starting WMT Quest E2E Test Suite");
  console.log("=".repeat(50));

  // Pre-flight checks
  const serverReady = await checkServerAvailability();
  if (!serverReady) {
    process.exit(1);
  }

  const envReady = await checkEnvironmentVariables();
  if (!envReady) {
    process.exit(1);
  }

  // Test browser setup
  console.log("🔍 Testing browser setup...");
  let testDriver;
  try {
    testDriver = await setupBrowser();
    await testDriver.get(TEST_CONFIG.server.url);
    await testDriver.quit();
    console.log("✅ Browser setup successful");
  } catch (error) {
    console.error("❌ Browser setup failed:", error.message);
    if (testDriver) {
      await testDriver.quit();
    }
    process.exit(1);
  }

  // Run test suites
  const results = [];
  const startTime = Date.now();

  for (const testSuite of TEST_SUITES) {
    const suiteStartTime = Date.now();
    const success = await runTestSuite(testSuite);
    const suiteEndTime = Date.now();
    const duration = ((suiteEndTime - suiteStartTime) / 1000).toFixed(2);

    results.push({
      name: testSuite.name,
      success,
      duration: `${duration}s`,
    });

    if (success) {
      console.log(`✅ ${testSuite.name} completed in ${duration}s`);
    } else {
      console.log(`❌ ${testSuite.name} failed after ${duration}s`);
    }
  }

  // Print summary
  const endTime = Date.now();
  const totalDuration = ((endTime - startTime) / 1000).toFixed(2);
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));

  results.forEach((result) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${result.name} (${result.duration})`);
  });

  console.log("\n" + "-".repeat(50));
  console.log(
    `Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`
  );
  console.log(`Total Duration: ${totalDuration}s`);

  if (failed > 0) {
    console.log("\n❌ Some tests failed. Check the logs above for details.");
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed!");
    process.exit(0);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log("WMT Quest E2E Test Runner");
  console.log("\nUsage:");
  console.log("  npm run test:e2e              # Run all tests");
  console.log("  npm run test:e2e -- --help    # Show this help");
  console.log("\nEnvironment Variables:");
  console.log("  LOGIN_USER     # Username for authentication tests");
  console.log("  LOGIN_PASS     # Password for authentication tests");
  console.log("  HEADLESS       # Set to 'false' to run with visible browser");
  console.log(
    "  TEST_SERVER_URL # Server URL (default: http://localhost:5173)"
  );
  console.log("\nAvailable Test Suites:");
  TEST_SUITES.forEach((suite) => {
    console.log(`  • ${suite.name}: ${suite.description}`);
  });
  process.exit(0);
}

// Run tests
runAllTests().catch((error) => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});
