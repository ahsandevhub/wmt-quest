# WMT Quest E2E Testing Guide

This directory contains comprehensive end-to-end (E2E) tests for the WMT Quest application using Selenium WebDriver.

## 🎯 Test Coverage

Our E2E test suite covers the following areas:

### 🔐 Authentication Tests (`authentication.test.js`)

- ✅ Login with valid credentials
- ❌ Login with invalid credentials
- 🛡️ Protected route access control
- 🔄 Session persistence
- 📝 Form validation

### 🧭 Navigation Tests (`navigation.test.js`)

- 📱 Sidebar navigation
- 🔄 Sidebar toggle functionality
- 🍞 Breadcrumb navigation
- 📄 Page titles
- 🔗 URL integrity
- 🔍 404 error handling

### 📋 Quest List Tests (`questList.test.js`)

- 📊 Quest list loading and display
- 🔍 Search and filtering
- 📄 Pagination functionality
- 🚀 Navigation to quest details
- ➕ Add new quest navigation

### ✏️ Quest Detail Tests (`questDetail.test.js`)

- 👁️ Quest detail view
- ✏️ Edit mode functionality
- 🛡️ Form validation
- 📧 Email management
- 🔄 Status toggle controls

### 📝 Quest Request Management Tests (`questRequestManagement.test.js`)

- 📋 Request list functionality
- 🔍 Advanced filtering (status, type, date range)
- 📄 Pagination
- 👁️ Request detail view
- ✅ Approve/reject workflow

### ➕ Add New Quest Tests (`addNewQuest.test.js`)

- 📝 Quest creation form
- 🛡️ Field validation
- 📧 Email list management
- ✅ Form submission

### 🍞 Breadcrumb Tests (`breadcrumbsBar.test.js`)

- 🧭 Multi-level navigation
- 🔗 Breadcrumb links

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (version 14 or higher)
2. **Chrome browser** installed
3. **Development server** running (`npm run dev`)

### Setup

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Create environment file** (`.env` in project root):

   ```env
   LOGIN_USER=your_username
   LOGIN_PASS=your_password
   TEST_SERVER_URL=http://localhost:5173  # Optional, defaults to this
   HEADLESS=true  # Set to false to see browser actions
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🧪 Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test Suite

```bash
# Authentication tests only
node src/__tests__/e2e/authentication.test.js

# Quest list tests only
node src/__tests__/e2e/questList.test.js

# Quest detail tests only
node src/__tests__/e2e/questDetail.test.js

# Navigation tests only
node src/__tests__/e2e/navigation.test.js

# Quest request management tests only
node src/__tests__/e2e/questRequestManagement.test.js
```

### Debug Mode (Visible Browser)

```bash
HEADLESS=false npm run test:e2e
```

### Help

```bash
npm run test:e2e -- --help
```

## 📁 File Structure

```
src/__tests__/e2e/
├── pages/                     # Page Object Model files
│   ├── base.page.js          # Base page with common functionality
│   ├── login.page.js         # Login page interactions
│   ├── questList.page.js     # Quest list page interactions
│   ├── questDetail.page.js   # Quest detail page interactions
│   ├── questRequestList.page.js     # Quest request list interactions
│   ├── questRequestDetail.page.js   # Quest request detail interactions
│   ├── addNewQuest.page.js   # Add quest form interactions
│   ├── navigation.page.js    # Navigation and breadcrumb interactions
│   └── breadcrumbsBar.page.js # Breadcrumb specific interactions
├── authentication.test.js    # Authentication flow tests
├── navigation.test.js        # Navigation and UI tests
├── questList.test.js         # Quest list functionality tests
├── questDetail.test.js       # Quest detail and editing tests
├── questRequestManagement.test.js # Quest request workflow tests
├── addNewQuest.test.js      # Quest creation tests (existing)
├── breadcrumbsBar.test.js   # Breadcrumb tests (existing)
├── login.test.js            # Basic login tests (existing)
├── testRunner.js            # Test suite runner
└── README.md                # This file
```

## 🏗️ Architecture

### Page Object Model (POM)

We use the Page Object Model pattern to organize our tests:

- **`BasePage`**: Common functionality shared by all pages
- **Specific Page Objects**: Each page has its own class with selectors and methods
- **Test Files**: Focus on test logic, delegating UI interactions to page objects

### Test Structure

Each test file follows this pattern:

1. **Setup**: Browser initialization and login
2. **Test Suites**: Grouped related test scenarios
3. **Cleanup**: Browser cleanup and result reporting

## 🛠️ Customization

### Adding New Tests

1. **Create new test file**:

   ```javascript
   import "dotenv/config";
   import { Builder } from "selenium-webdriver";
   import chrome from "selenium-webdriver/chrome.js";
   // Import your page objects

   async function runYourTests() {
     // Your test implementation
   }

   (async () => {
     const success = await runYourTests();
     process.exit(success ? 0 : 1);
   })();
   ```

2. **Add to test runner** (in `testRunner.js`):
   ```javascript
   const TEST_SUITES = [
     // ... existing tests
     {
       name: "Your New Tests",
       file: "yourNew.test.js",
       description: "Description of what your tests cover",
       timeout: 120000,
     },
   ];
   ```

### Creating New Page Objects

1. **Extend BasePage**:

   ```javascript
   import { By } from "selenium-webdriver";
   import { BasePage } from "./base.page.js";

   export class YourPage extends BasePage {
     constructor(driver) {
       super(driver);
       this.selectors = {
         // Define your selectors
       };
     }

     // Add your page-specific methods
   }
   ```

### Environment Configuration

You can customize test behavior with environment variables:

- **`HEADLESS`**: Set to `false` to run tests with visible browser
- **`TEST_SERVER_URL`**: Change the server URL for testing
- **`LOGIN_USER`** & **`LOGIN_PASS`**: Credentials for authentication tests

## 📊 Test Results

The test runner provides detailed results:

- ✅ **Pass/Fail status** for each test suite
- ⏱️ **Execution time** for each suite
- 📊 **Summary statistics**
- 🔍 **Detailed error logs** for failures

## 🐛 Troubleshooting

### Common Issues

1. **Server not running**:

   ```bash
   npm run dev
   ```

2. **Missing environment variables**:

   - Check your `.env` file
   - Ensure `LOGIN_USER` and `LOGIN_PASS` are set

3. **Chrome driver issues**:

   - Update Chrome browser
   - Clear browser cache
   - Try running with `HEADLESS=false`

4. **Timeout errors**:

   - Increase timeouts in test configuration
   - Check network connectivity
   - Verify server performance

5. **Element not found**:
   - UI might have changed - update selectors
   - Add appropriate waits
   - Check if elements are dynamically loaded

### Debug Tips

1. **Run with visible browser**:

   ```bash
   HEADLESS=false npm run test:e2e
   ```

2. **Add debug logs** in your tests:

   ```javascript
   console.log("Debug: Current URL:", await driver.getCurrentUrl());
   await driver.sleep(5000); // Pause to inspect state
   ```

3. **Take screenshots** on failures:
   ```javascript
   await driver.takeScreenshot().then((data) => {
     require("fs").writeFileSync("error.png", data, "base64");
   });
   ```

## 🎯 Best Practices

1. **Wait Strategies**: Use explicit waits instead of fixed sleeps
2. **Error Handling**: Wrap test logic in try-catch blocks
3. **Clean State**: Ensure tests don't depend on each other
4. **Readable Tests**: Use descriptive test names and comments
5. **Page Objects**: Keep UI logic separate from test logic
6. **Environment**: Use environment variables for configuration

## 🚀 Continuous Integration

For CI/CD integration, add this to your pipeline:

```yaml
- name: Run E2E Tests
  run: |
    npm run dev &
    sleep 10  # Wait for server to start
    npm run test:e2e
  env:
    LOGIN_USER: ${{ secrets.LOGIN_USER }}
    LOGIN_PASS: ${{ secrets.LOGIN_PASS }}
    HEADLESS: true
```

---

Happy Testing! 🎉
