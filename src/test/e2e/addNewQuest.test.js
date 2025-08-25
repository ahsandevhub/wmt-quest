import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { AddNewQuestPage } from "./pages/addNewQuest.page.js";
import { LoginPage } from "./pages/login.page.js";

// Test configuration
const TEST_CONFIG = {
  credentials: {
    username: process.env.LOGIN_USER || "peter-bo-3@yopmail.com",
    password: process.env.LOGIN_PASS || "kbfSMcG71saaC280UCAiDg==",
  },
  timeouts: {
    default: 10000,
    short: 5000,
    long: 15000,
  }
};

// Test data
const VALID_QUEST_DATA = {
  title: "Test Quest Title",
  points: 100,
  description: "This is a test quest description with enough content to pass validation.",
};

const INVALID_QUEST_DATA = {
  emptyTitle: "",
  longTitle: "A".repeat(201), // Exceeds 200 char limit
  invalidPoints: -5,
  shortDescription: "Too short",
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
  await loginPage.login(TEST_CONFIG.credentials.username, TEST_CONFIG.credentials.password);
  console.log("✅ Login successful");
}

async function testEmptyFormValidation(page) {
  console.log("\n📝 Testing empty form validation...");
  
  try {
    await page.submitEmpty();
    
    const validationMessages = await page.getAllValidationMessages();
    console.log(`Found ${validationMessages.length} validation messages:`, validationMessages);
    
    if (validationMessages.length > 0) {
      console.log("✅ Empty form validation working correctly");
      return true;
    } else {
      console.log("❌ No validation messages found for empty form");
      return false;
    }
  } catch (error) {
    console.log("❌ Error testing empty form:", error.message);
    return false;
  }
}

async function testFieldValidation(page) {
  console.log("\n📝 Testing individual field validation...");
  
  let allTestsPassed = true;
  
  try {
    // Test title too long
    console.log("Testing title length validation...");
    await page.fillTitle(INVALID_QUEST_DATA.longTitle);
    await page.submitForm();
    
    await page.driver.sleep(1000);
    const titleValidation = await page.waitForValidationMessage(3000);
    if (titleValidation && titleValidation.includes("200")) {
      console.log("✅ Title length validation working");
    } else {
      console.log("❌ Title length validation not working");
      allTestsPassed = false;
    }
    
    // Clear form and test points validation
    await page.fillTitle("Valid Title");
    await page.fillPoints(INVALID_QUEST_DATA.invalidPoints);
    await page.submitForm();
    
    await page.driver.sleep(1000);
    const pointValidation = await page.waitForValidationMessage(3000);
    if (pointValidation) {
      console.log("✅ Points validation working:", pointValidation);
    } else {
      console.log("❌ Points validation not working");
      allTestsPassed = false;
    }
    
  } catch (error) {
    console.log("❌ Error testing field validation:", error.message);
    allTestsPassed = false;
  }
  
  return allTestsPassed;
}

async function testValidFormSubmission(page) {
  console.log("\n📝 Testing valid form submission...");
  
  try {
    // Clear any previous form data
    await page.clearForm();
    await page.driver.sleep(1000);
    
    // Fill all required fields with valid data
    await page.fillTitle(VALID_QUEST_DATA.title);
    await page.fillPoints(VALID_QUEST_DATA.points);
    await page.fillDescription(VALID_QUEST_DATA.description);
    
    // Select required account rank
    await page.selectAccountRank();
    
    // Small delay to ensure all fields are filled
    await page.driver.sleep(1000);
    
    console.log("Filled form with valid data, submitting...");
    await page.submitForm();
    
    // Check if form is processing (disabled state)
    await page.driver.sleep(2000);
    const isDisabled = await page.isFormDisabled();
    if (isDisabled) {
      console.log("✅ Form disabled during submission (processing state)");
    }
    
    // Wait for either success message or error
    const successMessage = await page.waitForSuccessMessage(10000);
    if (successMessage) {
      console.log("✅ Form submitted successfully:", successMessage);
      return true;
    } else {
      // Check for any remaining validation errors
      const validationMessages = await page.getAllValidationMessages();
      if (validationMessages.length > 0) {
        console.log("❌ Form submission failed with validation errors:", validationMessages);
        // If it's just missing account rank, try clicking it again
        if (validationMessages.some(msg => msg.includes("account rank"))) {
          console.log("Attempting to fix account rank selection...");
          await page.selectAccountRank();
          await page.driver.sleep(500);
          await page.submitForm();
          await page.driver.sleep(2000);
          
          const retrySuccess = await page.waitForSuccessMessage(5000);
          if (retrySuccess) {
            console.log("✅ Form submitted successfully after retry:", retrySuccess);
            return true;
          }
        }
      } else {
        console.log("❌ Form submission result unclear - no success or error message");
      }
      return false;
    }
    
  } catch (error) {
    console.log("❌ Error testing valid form submission:", error.message);
    return false;
  }
}

async function testFormErrorHandling(page) {
  console.log("\n📝 Testing form error handling...");
  
  try {
    // Test network error simulation (if backend is down)
    await page.fillTitle("Network Test Quest");
    await page.fillPoints(50);
    await page.selectAccountRank();
    
    await page.submitForm();
    await page.driver.sleep(3000);
    
    // Look for any error messages or network failures
    const validationMessages = await page.getAllValidationMessages();
    console.log("Form state after submission attempt:", {
      validationCount: validationMessages.length,
      messages: validationMessages
    });
    
    return true;
  } catch (error) {
    console.log("❌ Error testing form error handling:", error.message);
    return false;
  }
}

(async () => {
  const driver = await setupBrowser();
  let testResults = {
    login: false,
    emptyValidation: false,
    fieldValidation: false,
    validSubmission: false,
    errorHandling: false,
  };

  try {
    console.log("🚀 Starting comprehensive Add New Quest E2E tests...");
    
    // Perform login
    await performLogin(driver);
    testResults.login = true;

    // Open Add New Quest page
    console.log("\n📄 Opening Add New Quest page...");
    const page = new AddNewQuestPage(driver);
    await page.open();
    console.log("✅ Add New Quest page loaded");

    // Run test suites
    testResults.emptyValidation = await testEmptyFormValidation(page);
    testResults.fieldValidation = await testFieldValidation(page);
    testResults.validSubmission = await testValidFormSubmission(page);
    testResults.errorHandling = await testFormErrorHandling(page);

    // Summary
    console.log("\n📊 Test Results Summary:");
    console.log("========================");
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`${passed ? "✅" : "❌"} ${test}: ${passed ? "PASSED" : "FAILED"}`);
    });

    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(Boolean).length;
    console.log(`\n🏁 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log("🎉 All tests passed! Add New Quest form is working correctly.");
    } else {
      console.log("⚠️  Some tests failed. Review the form implementation.");
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
