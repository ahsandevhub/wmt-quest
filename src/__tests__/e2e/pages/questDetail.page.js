import { By } from "selenium-webdriver";
import { BasePage } from "./base.page.js";

export class QuestDetailPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.selectors = {
      // Page elements
      pageTitle: By.css("h1, .ant-typography-title"),
      backButton: By.css(
        "button[aria-label='Back'], .ant-btn:has(.anticon-arrow-left)"
      ),
      editButton: By.css("button:contains('Edit'), button.ant-btn-primary"),
      saveButton: By.css("button:contains('Save'), button[type='submit']"),
      cancelButton: By.css("button:contains('Cancel')"),

      // Form fields
      statusSwitch: By.css("[name='status'] + .ant-switch"),
      titleInput: By.css("input[name='title']"),
      expiryDatePicker: By.css("[name='expiryDate'] .ant-picker-input input"),
      platformSelect: By.css("[name='platform']"),
      pointInput: By.css("input[role='spinbutton']"),
      accountRankCheckboxes: By.css(
        "[name='accountRank'] .ant-checkbox-wrapper"
      ),
      uploadEvidenceSwitch: By.css(
        "[name='requiredUploadEvidence'] + .ant-switch"
      ),
      enterLinkSwitch: By.css("[name='requiredEnterLink'] + .ant-switch"),
      allowMultipleSwitch: By.css("[name='allowSubmitMultiple'] + .ant-switch"),
      descriptionEditor: By.css(".ql-editor"),

      // Email management
      emailSearchInput: By.css(
        "input[placeholder*='email'], input[placeholder*='Email']"
      ),
      addEmailButton: By.css("button:contains('Add')"),
      importEmailsButton: By.css("button:contains('Import')"),
      emailTable: By.css(".ant-table-tbody"),
      emailRows: By.css(".ant-table-tbody tr"),
      removeEmailButtons: By.css(
        "button:contains('Remove'), .ant-btn-dangerous"
      ),

      // Validation messages
      validationMessage: By.css(".ant-form-item-explain"),
      errorMessages: By.css(".ant-form-item-explain-error"),

      // Success/Error messages
      successMessage: By.css(".ant-message-success"),
      errorMessage: By.css(".ant-message-error"),

      // Loading states
      loadingSpinner: By.css(".ant-spin"),
      saveButtonLoading: By.css("button[type='submit'] .ant-spin"),
    };
  }

  async open(questId) {
    await super.open(`/quest/quest-list/${questId}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.waitForElement(this.selectors.pageTitle);
    await this.driver.sleep(500);
  }

  async clickEdit() {
    await this.click(this.selectors.editButton);
    await this.driver.sleep(500);
  }

  async isInEditMode() {
    return await this.isElementPresent(this.selectors.saveButton);
  }

  async fillTitle(title) {
    await this.type(this.selectors.titleInput, title);
  }

  async getTitle() {
    const titleInput = await this.waitForElement(this.selectors.titleInput);
    return await titleInput.getAttribute("value");
  }

  async fillPoints(points) {
    await this.type(this.selectors.pointInput, points.toString());
  }

  async getPoints() {
    const pointInput = await this.waitForElement(this.selectors.pointInput);
    return await pointInput.getAttribute("value");
  }

  async fillDescription(description) {
    const editor = await this.waitForElement(this.selectors.descriptionEditor);
    await editor.clear();
    await editor.sendKeys(description);
  }

  async getDescription() {
    return await this.getText(this.selectors.descriptionEditor);
  }

  async toggleStatus() {
    await this.click(this.selectors.statusSwitch);
  }

  async selectPlatform(platform) {
    await this.selectDropdownOption(this.selectors.platformSelect, platform);
  }

  async selectAccountRank(index = 0) {
    const checkboxes = await this.driver.findElements(
      this.selectors.accountRankCheckboxes
    );
    if (checkboxes[index]) {
      await checkboxes[index].click();
    }
  }

  async toggleUploadEvidence() {
    await this.click(this.selectors.uploadEvidenceSwitch);
  }

  async toggleEnterLink() {
    await this.click(this.selectors.enterLinkSwitch);
  }

  async toggleAllowMultiple() {
    await this.click(this.selectors.allowMultipleSwitch);
  }

  async setExpiryDate(date) {
    await this.type(this.selectors.expiryDatePicker, date);
  }

  async addEmail(email) {
    await this.type(this.selectors.emailSearchInput, email);
    await this.click(this.selectors.addEmailButton);
    await this.driver.sleep(1000);
  }

  async getEmailCount() {
    const rows = await this.driver.findElements(this.selectors.emailRows);
    return rows.length;
  }

  async removeFirstEmail() {
    const removeButtons = await this.driver.findElements(
      this.selectors.removeEmailButtons
    );
    if (removeButtons.length > 0) {
      await removeButtons[0].click();
      await this.driver.sleep(500);
    }
  }

  async saveChanges() {
    await this.click(this.selectors.saveButton);
    await this.driver.sleep(1000);
  }

  async cancelChanges() {
    await this.click(this.selectors.cancelButton);
    await this.driver.sleep(500);
  }

  async waitForValidationMessage() {
    try {
      await this.waitForElement(this.selectors.validationMessage, 3000);
      return await this.getText(this.selectors.validationMessage);
    } catch {
      return null;
    }
  }

  async getAllValidationMessages() {
    try {
      const elements = await this.driver.findElements(
        this.selectors.errorMessages
      );
      const messages = [];
      for (const element of elements) {
        messages.push(await element.getText());
      }
      return messages;
    } catch {
      return [];
    }
  }

  async waitForSuccessMessage() {
    try {
      await this.waitForElement(this.selectors.successMessage, 5000);
      return await this.getText(this.selectors.successMessage);
    } catch {
      return null;
    }
  }

  async waitForErrorMessage() {
    try {
      await this.waitForElement(this.selectors.errorMessage, 5000);
      return await this.getText(this.selectors.errorMessage);
    } catch {
      return null;
    }
  }

  async isSaveButtonLoading() {
    return await this.isElementPresent(this.selectors.saveButtonLoading);
  }

  async goBack() {
    await this.click(this.selectors.backButton);
    await this.waitForUrlContains("/quest-list");
  }
}
