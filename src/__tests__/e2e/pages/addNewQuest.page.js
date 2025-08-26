import { By, until } from "selenium-webdriver";

export class AddNewQuestPage {
  constructor(driver) {
    this.driver = driver;
    this.url = "http://localhost:5173/quest/quest-list/add-new-quest";
    this.selectors = {
      // Form fields
      titleInput: By.css("input[placeholder*='title'], input[name='title']"),
      pointInput: By.css("input[role='spinbutton']"),
      descriptionEditor: By.css(".ql-editor"),
      statusSwitch: By.css("[name='status'] + .ant-switch"),
      platformSelect: By.css("[name='platform']"),
      // Updated selector for AntD Checkbox.Group
      accountRankCheckboxes: By.css(
        ".ant-checkbox-group .ant-checkbox-wrapper"
      ),
      datePicker: By.css(".ant-picker-input input"),

      // Buttons
      headerPrimaryButton: By.css("button.ant-btn-primary"),

      // Validation messages
      validationMessage: By.css(".ant-form-item-explain"),
      errorMessages: By.css(".ant-form-item-explain-error"),
      hasErrorItems: By.css(".ant-form-item-has-error"),

      // Success indicators
      successMessage: By.css(".ant-message-success"),
    };
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(
      until.urlContains("/quest/quest-list/add-new-quest"),
      10000
    );
    // Wait for form to load
    await this.driver.wait(
      until.elementLocated(this.selectors.titleInput),
      5000
    );
  }

  async clearForm() {
    try {
      // Clear title
      const titleField = await this.driver.findElement(
        this.selectors.titleInput
      );
      await titleField.clear();

      // Clear points (reset to default)
      const pointField = await this.driver.findElement(
        this.selectors.pointInput
      );
      await pointField.clear();
      await pointField.sendKeys("1");

      // Clear description
      const editor = await this.driver.findElement(
        this.selectors.descriptionEditor
      );
      await editor.clear();

      // Small delay to let form reset
      await this.driver.sleep(500);
    } catch (error) {
      console.log("Warning: Could not clear all form fields:", error.message);
    }
  }

  async fillTitle(title) {
    const titleField = await this.driver.findElement(this.selectors.titleInput);
    await titleField.clear();
    await titleField.sendKeys(title);
  }

  async fillPoints(points) {
    const pointField = await this.driver.findElement(this.selectors.pointInput);
    await pointField.clear();
    await pointField.sendKeys(points.toString());
  }

  async fillDescription(description) {
    const editor = await this.driver.findElement(
      this.selectors.descriptionEditor
    );
    await editor.clear();
    await editor.sendKeys(description);
  }

  async selectAccountRank() {
    const checkboxes = await this.driver.findElements(
      this.selectors.accountRankCheckboxes
    );
    if (checkboxes.length > 0) {
      const checkbox = checkboxes[0];
      // Click the label to toggle the checkbox (AntD best practice)
      await this.driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        checkbox
      );
      await this.driver.sleep(200);
      await checkbox.click();
      await this.driver.sleep(200);
    } else {
      throw new Error("No account rank checkboxes found");
    }
  }

  async selectPlatform() {
    // Try to select the first available platform if the field exists
    try {
      const platformSelect = await this.driver.findElement(
        this.selectors.platformSelect
      );
      await platformSelect.click();
      await this.driver.sleep(200);
      // Select the first dropdown option
      const firstOption = await this.driver.findElement(
        By.css(".ant-select-dropdown .ant-select-item-option")
      );
      await firstOption.click();
      await this.driver.sleep(200);
    } catch (e) {
      // Platform may not be required or present
    }
  }

  async selectDate() {
    // Try to select today if the field exists
    try {
      const dateInput = await this.driver.findElement(
        this.selectors.datePicker
      );
      await dateInput.click();
      await this.driver.sleep(200);
      // Click today button if available
      const todayBtn = await this.driver.findElement(
        By.css(".ant-picker-today-btn")
      );
      await todayBtn.click();
      await this.driver.sleep(200);
    } catch (e) {
      // Date may not be required or present
    }
  }

  async toggleStatus() {
    const statusSwitch = await this.driver.findElement(
      this.selectors.statusSwitch
    );
    await statusSwitch.click();
  }

  async submitForm() {
    const btn = await this.driver.wait(
      until.elementLocated(this.selectors.headerPrimaryButton),
      5000
    );
    await btn.click();
  }

  async submitEmpty() {
    await this.submitForm();
  }

  async waitForValidationMessage(timeout = 5000) {
    try {
      const selectors = [
        By.css(".ant-form-item-explain-error"),
        By.css(".ant-form-item-explain"),
        By.css(".ant-form-item-has-error .ant-form-item-explain"),
        By.css(".ant-form-item-with-help .ant-form-item-explain"),
      ];

      for (const selector of selectors) {
        try {
          const el = await this.driver.wait(
            until.elementLocated(selector),
            timeout / selectors.length
          );
          const text = await el.getText();
          if (text && text.trim().length > 0) {
            return text;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async getAllValidationMessages() {
    try {
      await this.driver.sleep(1000); // Wait for validation to appear
      const elements = await this.driver.findElements(
        this.selectors.validationMessage
      );
      const messages = [];
      for (const el of elements) {
        const text = await el.getText();
        if (text && text.trim().length > 0) {
          messages.push(text);
        }
      }
      return messages;
    } catch (e) {
      return [];
    }
  }

  async waitForSuccessMessage(timeout = 5000) {
    try {
      const el = await this.driver.wait(
        until.elementLocated(this.selectors.successMessage),
        timeout
      );
      return await el.getText();
    } catch (e) {
      return null;
    }
  }

  async isFormDisabled() {
    try {
      const form = await this.driver.findElement(By.css("form"));
      const disabled = await form.getAttribute("disabled");
      return disabled === "true" || disabled === "";
    } catch (e) {
      return false;
    }
  }
}
