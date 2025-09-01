import { By } from "selenium-webdriver";
import { BasePage } from "./base.page.js";

export class QuestRequestDetailPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.selectors = {
      // Page elements
      pageTitle: By.css("h1, .ant-typography-title"),
      backButton: By.css(
        "button[aria-label='Back'], .ant-btn:has(.anticon-arrow-left)"
      ),

      // Request information
      requestIdLabel: By.xpath(
        "//dt[text()='Request ID']/following-sibling::dd | //span[text()='Request ID']/parent::*/following-sibling::*"
      ),
      questIdLabel: By.xpath(
        "//dt[text()='Quest ID']/following-sibling::dd | //span[text()='Quest ID']/parent::*/following-sibling::*"
      ),
      questTitleLabel: By.xpath(
        "//dt[text()='Quest Title']/following-sibling::dd | //span[text()='Quest Title']/parent::*/following-sibling::*"
      ),
      statusTag: By.css(".ant-tag"),

      // User information
      fullNameLabel: By.xpath(
        "//dt[text()='Full Name']/following-sibling::dd | //span[text()='Full Name']/parent::*/following-sibling::*"
      ),
      emailLabel: By.xpath(
        "//dt[text()='Email']/following-sibling::dd | //span[text()='Email']/parent::*/following-sibling::*"
      ),

      // Action buttons (only visible for pending requests)
      approveButton: By.css(
        "button:contains('Approve'), button[class*='approve']"
      ),
      rejectButton: By.css(
        "button:contains('Reject'), button[class*='reject']"
      ),

      // Modals
      approveModal: By.css(".ant-modal"),
      approveModalOkButton: By.css(".ant-modal-footer button.ant-btn-primary"),
      approveModalCancelButton: By.css(
        ".ant-modal-footer button:not(.ant-btn-primary)"
      ),

      rejectModal: By.css(".ant-modal"),
      rejectReasonTextarea: By.css(".ant-modal textarea"),
      rejectModalOkButton: By.css(".ant-modal-footer button.ant-btn-primary"),
      rejectModalCancelButton: By.css(
        ".ant-modal-footer button:not(.ant-btn-primary)"
      ),

      // Success/Error messages
      successMessage: By.css(".ant-message-success"),
      errorMessage: By.css(".ant-message-error"),

      // Loading states
      loadingSpinner: By.css(".ant-spin"),
      buttonLoading: By.css("button .ant-spin"),
    };
  }

  async open(questRequestId) {
    await super.open(`/quest/quest-requests/${questRequestId}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.waitForElement(this.selectors.pageTitle);
    await this.driver.sleep(500);
  }

  async getRequestId() {
    try {
      return await this.getText(this.selectors.requestIdLabel);
    } catch {
      return null;
    }
  }

  async getQuestId() {
    try {
      return await this.getText(this.selectors.questIdLabel);
    } catch {
      return null;
    }
  }

  async getQuestTitle() {
    try {
      return await this.getText(this.selectors.questTitleLabel);
    } catch {
      return null;
    }
  }

  async getStatus() {
    try {
      return await this.getText(this.selectors.statusTag);
    } catch {
      return null;
    }
  }

  async getUserFullName() {
    try {
      return await this.getText(this.selectors.fullNameLabel);
    } catch {
      return null;
    }
  }

  async getUserEmail() {
    try {
      return await this.getText(this.selectors.emailLabel);
    } catch {
      return null;
    }
  }

  async isApproveButtonVisible() {
    return await this.isElementPresent(this.selectors.approveButton);
  }

  async isRejectButtonVisible() {
    return await this.isElementPresent(this.selectors.rejectButton);
  }

  async clickApprove() {
    await this.click(this.selectors.approveButton);
    await this.waitForElement(this.selectors.approveModal);
  }

  async confirmApproval() {
    await this.click(this.selectors.approveModalOkButton);
    await this.waitForModalToClose();
  }

  async cancelApproval() {
    await this.click(this.selectors.approveModalCancelButton);
    await this.waitForModalToClose();
  }

  async clickReject() {
    await this.click(this.selectors.rejectButton);
    await this.waitForElement(this.selectors.rejectModal);
  }

  async enterRejectReason(reason) {
    await this.type(this.selectors.rejectReasonTextarea, reason);
  }

  async confirmRejection() {
    await this.click(this.selectors.rejectModalOkButton);
    await this.waitForModalToClose();
  }

  async cancelRejection() {
    await this.click(this.selectors.rejectModalCancelButton);
    await this.waitForModalToClose();
  }

  async waitForModalToClose() {
    await this.driver.sleep(1000);
    try {
      await this.driver.wait(async () => {
        const modals = await this.driver.findElements(
          this.selectors.approveModal
        );
        return modals.length === 0;
      }, 5000);
    } catch {
      // Modal might already be closed
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

  async isPageLoading() {
    return await this.isElementPresent(this.selectors.loadingSpinner);
  }

  async areButtonsLoading() {
    return await this.isElementPresent(this.selectors.buttonLoading);
  }

  async goBack() {
    await this.click(this.selectors.backButton);
    await this.waitForUrlContains("/quest-requests");
  }
}
