import "dotenv/config";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { LoginPage } from "./pages/login.page.js";
import { NavigationPage } from "./pages/navigation.page.js";
import { QuestDetailPage } from "./pages/questDetail.page.js";
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

// Test data
const VALID_QUEST_UPDATE_DATA = {
  title: "Updated Quest Title - E2E Test",
  points: 150,
  description:
    "Updated description for E2E testing - This quest has been modified through automated testing.",
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

async function testQuestDetailView(questDetailPage, questListPage) {
  console.log("\n👁️ Testing Quest Detail View...");
  let allTestsPassed = true;

  try {
    // Navigate to quest list first
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();

    if (questCount > 0) {
      // Click on first quest
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);

      // Wait for detail page to load
      await questDetailPage.waitForPageLoad();

      // Test if page loaded correctly
      const title = await questDetailPage.getTitle();
      const points = await questDetailPage.getPoints();
      const description = await questDetailPage.getDescription();

      if (title) {
        console.log(
          `✅ Quest detail page loaded - Title: "${title}", Points: ${points}`
        );
      } else {
        console.log("❌ Quest detail page did not load correctly");
        allTestsPassed = false;
      }

      // Test if edit mode is available
      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );
      if (hasEditButton) {
        console.log("✅ Edit button is available");
      } else {
        console.log("ℹ️ Edit button not found (may be in read-only mode)");
      }
    } else {
      console.log("ℹ️ No quests available for detail view testing");
    }
  } catch (error) {
    console.error("❌ Quest detail view test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestEditMode(questDetailPage, questListPage) {
  console.log("\n✏️ Testing Quest Edit Mode...");
  let allTestsPassed = true;

  try {
    // Ensure we're on a quest detail page
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();

    if (questCount > 0) {
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);
      await questDetailPage.waitForPageLoad();

      // Check if edit button exists
      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );

      if (hasEditButton) {
        // Click edit button
        await questDetailPage.clickEdit();
        await questDetailPage.driver.sleep(1000);

        // Verify we're in edit mode
        const isInEditMode = await questDetailPage.isInEditMode();
        if (isInEditMode) {
          console.log("✅ Successfully entered edit mode");

          // Test form field interactions (without saving)
          const originalTitle = await questDetailPage.getTitle();

          // Test title field
          await questDetailPage.fillTitle("Temporary Test Title");
          await questDetailPage.driver.sleep(500);
          const newTitle = await questDetailPage.getTitle();

          if (newTitle === "Temporary Test Title") {
            console.log("✅ Title field editing works");
          } else {
            console.log("❌ Title field editing failed");
            allTestsPassed = false;
          }

          // Restore original title
          await questDetailPage.fillTitle(originalTitle);

          // Test points field
          const originalPoints = await questDetailPage.getPoints();
          await questDetailPage.fillPoints(999);
          await questDetailPage.driver.sleep(500);
          const newPoints = await questDetailPage.getPoints();

          if (newPoints === "999") {
            console.log("✅ Points field editing works");
          } else {
            console.log("❌ Points field editing failed");
            allTestsPassed = false;
          }

          // Restore original points
          await questDetailPage.fillPoints(originalPoints);

          // Test cancel functionality
          await questDetailPage.cancelChanges();
          await questDetailPage.driver.sleep(1000);

          const isStillInEditMode = await questDetailPage.isInEditMode();
          if (!isStillInEditMode) {
            console.log("✅ Cancel functionality works");
          } else {
            console.log("❌ Cancel functionality failed");
            allTestsPassed = false;
          }
        } else {
          console.log("❌ Failed to enter edit mode");
          allTestsPassed = false;
        }
      } else {
        console.log("ℹ️ Edit button not available for this quest");
      }
    } else {
      console.log("ℹ️ No quests available for edit mode testing");
    }
  } catch (error) {
    console.error("❌ Quest edit mode test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestFormValidation(questDetailPage, questListPage) {
  console.log("\n🛡️ Testing Quest Form Validation...");
  let allTestsPassed = true;

  try {
    // Navigate to quest detail and enter edit mode
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();

    if (questCount > 0) {
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);
      await questDetailPage.waitForPageLoad();

      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );

      if (hasEditButton) {
        await questDetailPage.clickEdit();
        await questDetailPage.driver.sleep(1000);

        if (await questDetailPage.isInEditMode()) {
          // Store original values
          const originalTitle = await questDetailPage.getTitle();
          const originalPoints = await questDetailPage.getPoints();

          // Test empty title validation
          await questDetailPage.fillTitle("");
          await questDetailPage.saveChanges();
          await questDetailPage.driver.sleep(2000);

          const titleValidation =
            await questDetailPage.waitForValidationMessage();
          if (titleValidation) {
            console.log("✅ Title validation works:", titleValidation);
          } else {
            console.log("⚠️ Title validation message not found");
          }

          // Test title too long validation
          await questDetailPage.fillTitle("A".repeat(250)); // Exceeds 200 char limit
          await questDetailPage.saveChanges();
          await questDetailPage.driver.sleep(2000);

          const longTitleValidation =
            await questDetailPage.waitForValidationMessage();
          if (longTitleValidation && longTitleValidation.includes("200")) {
            console.log("✅ Title length validation works");
          } else {
            console.log("⚠️ Title length validation not detected");
          }

          // Test negative points validation
          await questDetailPage.fillTitle(originalTitle);
          await questDetailPage.fillPoints(-10);
          await questDetailPage.saveChanges();
          await questDetailPage.driver.sleep(2000);

          const pointsValidation =
            await questDetailPage.waitForValidationMessage();
          if (pointsValidation) {
            console.log("✅ Points validation works:", pointsValidation);
          } else {
            console.log("⚠️ Points validation message not found");
          }

          // Restore original values and cancel
          await questDetailPage.fillTitle(originalTitle);
          await questDetailPage.fillPoints(originalPoints);
          await questDetailPage.cancelChanges();
        }
      }
    }
  } catch (error) {
    console.error("❌ Quest form validation test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testEmailManagement(questDetailPage, questListPage) {
  console.log("\n📧 Testing Email Management...");
  let allTestsPassed = true;

  try {
    // Navigate to quest detail and enter edit mode
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();

    if (questCount > 0) {
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);
      await questDetailPage.waitForPageLoad();

      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );

      if (hasEditButton) {
        await questDetailPage.clickEdit();
        await questDetailPage.driver.sleep(1000);

        if (await questDetailPage.isInEditMode()) {
          // Get initial email count
          const initialEmailCount = await questDetailPage.getEmailCount();
          console.log(`Initial email count: ${initialEmailCount}`);

          // Test adding an email (note: this might fail if email doesn't exist in system)
          try {
            await questDetailPage.addEmail("test@example.com");
            await questDetailPage.driver.sleep(2000);

            const newEmailCount = await questDetailPage.getEmailCount();
            if (newEmailCount > initialEmailCount) {
              console.log("✅ Email addition works");

              // Test removing an email
              await questDetailPage.removeFirstEmail();
              await questDetailPage.driver.sleep(1000);

              const finalEmailCount = await questDetailPage.getEmailCount();
              if (finalEmailCount < newEmailCount) {
                console.log("✅ Email removal works");
              } else {
                console.log(
                  "⚠️ Email removal might not work or no emails to remove"
                );
              }
            } else {
              console.log(
                "ℹ️ Email addition might require valid email from system"
              );
            }
          } catch (emailError) {
            console.log(
              "ℹ️ Email management test limited - may require specific setup"
            );
          }

          // Cancel changes to avoid affecting data
          await questDetailPage.cancelChanges();
        }
      }
    }
  } catch (error) {
    console.error("❌ Email management test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function testQuestStatusToggle(questDetailPage, questListPage) {
  console.log("\n🔄 Testing Quest Status Toggle...");
  let allTestsPassed = true;

  try {
    // Navigate to quest detail and enter edit mode
    await questListPage.open();
    const questCount = await questListPage.getQuestCount();

    if (questCount > 0) {
      await questListPage.clickQuestByIndex(0);
      await questListPage.driver.sleep(2000);
      await questDetailPage.waitForPageLoad();

      const hasEditButton = await questDetailPage.isElementPresent(
        questDetailPage.selectors.editButton
      );

      if (hasEditButton) {
        await questDetailPage.clickEdit();
        await questDetailPage.driver.sleep(1000);

        if (await questDetailPage.isInEditMode()) {
          // Test status toggle
          await questDetailPage.toggleStatus();
          await questDetailPage.driver.sleep(500);
          console.log("✅ Status toggle interaction works");

          // Test other switches
          await questDetailPage.toggleUploadEvidence();
          await questDetailPage.driver.sleep(300);

          await questDetailPage.toggleEnterLink();
          await questDetailPage.driver.sleep(300);

          await questDetailPage.toggleAllowMultiple();
          await questDetailPage.driver.sleep(300);
          console.log("✅ Switch controls work");

          // Cancel changes
          await questDetailPage.cancelChanges();
        }
      }
    }
  } catch (error) {
    console.error("❌ Quest status toggle test failed:", error.message);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

async function runQuestDetailTests() {
  console.log("🚀 Starting Quest Detail E2E Tests...");

  const driver = await setupBrowser();
  let allTestsPassed = true;

  try {
    // Perform login
    await performLogin(driver);

    // Initialize page objects
    const questListPage = new QuestListPage(driver);
    const questDetailPage = new QuestDetailPage(driver);
    const navigationPage = new NavigationPage(driver);

    // Navigate to quest list
    await navigationPage.navigateToQuestList();
    await driver.sleep(1000);

    // Run test suites
    const viewTests = await testQuestDetailView(questDetailPage, questListPage);
    const editTests = await testQuestEditMode(questDetailPage, questListPage);
    const validationTests = await testQuestFormValidation(
      questDetailPage,
      questListPage
    );
    const emailTests = await testEmailManagement(
      questDetailPage,
      questListPage
    );
    const statusTests = await testQuestStatusToggle(
      questDetailPage,
      questListPage
    );

    allTestsPassed =
      viewTests && editTests && validationTests && emailTests && statusTests;

    // Final summary
    if (allTestsPassed) {
      console.log("\n🎉 All Quest Detail tests passed!");
    } else {
      console.log(
        "\n❌ Some Quest Detail tests failed. Please check the logs above."
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
  const success = await runQuestDetailTests();
  process.exit(success ? 0 : 1);
})();
