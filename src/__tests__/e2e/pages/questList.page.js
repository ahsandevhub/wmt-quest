import { By } from "selenium-webdriver";
import { BasePage } from "./base.page.js";

export class QuestListPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = "/quest/quest-list";
    this.selectors = {
      // Filters
      searchInput: By.css(
        "input[placeholder*='Quest ID'], input[placeholder*='title']"
      ),
      statusSelect: By.css("[name='status']"),
      searchButton: By.css("button[type='submit']"),
      resetButton: By.css("button:has(.anticon-sync)"),

      // Table
      questTable: By.css(".ant-table-tbody"),
      questRows: By.css(".ant-table-tbody tr"),
      questTitleLinks: By.css(".ant-table-tbody td a"),

      // Actions
      addNewButton: By.css("button.ant-btn-primary"),

      // Pagination
      pagination: By.css(".ant-pagination"),
      pageNumbers: By.css(".ant-pagination-item"),
      nextPageButton: By.css(".ant-pagination-next"),
      prevPageButton: By.css(".ant-pagination-prev"),
      pageSizeSelect: By.css(".ant-pagination-options-size-changer"),

      // Loading states
      loadingSpinner: By.css(".ant-spin"),

      // Total count
      totalItemsText: By.xpath("//div[contains(text(), 'Total')]"),
    };
  }

  async open() {
    await super.open(this.url);
    await this.waitForTableLoad();
  }

  async waitForTableLoad() {
    await this.waitForElement(this.selectors.questTable);
    // Wait for loading to finish
    await this.driver.sleep(1000);
  }

  async searchQuests(keyword) {
    await this.type(this.selectors.searchInput, keyword);
    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async filterByStatus(status) {
    await this.selectDropdownOption(this.selectors.statusSelect, status);
    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async resetFilters() {
    await this.click(this.selectors.resetButton);
    await this.waitForTableLoad();
  }

  async getQuestCount() {
    const rows = await this.driver.findElements(this.selectors.questRows);
    return rows.length;
  }

  async clickAddNewQuest() {
    await this.click(this.selectors.addNewButton);
    await this.waitForUrlContains("/add-new-quest");
  }

  async clickQuestByIndex(index) {
    const questLinks = await this.driver.findElements(
      this.selectors.questTitleLinks
    );
    if (questLinks[index]) {
      await questLinks[index].click();
      await this.waitForUrlContains("/quest-list/");
    }
  }

  async goToNextPage() {
    const isNextEnabled = await this.isElementPresent(
      By.css(".ant-pagination-next:not(.ant-pagination-disabled)")
    );
    if (isNextEnabled) {
      await this.click(this.selectors.nextPageButton);
      await this.waitForTableLoad();
      return true;
    }
    return false;
  }

  async goToPreviousPage() {
    const isPrevEnabled = await this.isElementPresent(
      By.css(".ant-pagination-prev:not(.ant-pagination-disabled)")
    );
    if (isPrevEnabled) {
      await this.click(this.selectors.prevPageButton);
      await this.waitForTableLoad();
      return true;
    }
    return false;
  }

  async changePageSize(size) {
    await this.click(this.selectors.pageSizeSelect);
    await this.driver.sleep(500);
    const option = await this.waitForElement(
      By.xpath(
        `//div[contains(@class, 'ant-select-item')][@title='${size} / page']`
      )
    );
    await option.click();
    await this.waitForTableLoad();
  }

  async getTotalItemsCount() {
    try {
      const totalText = await this.getText(this.selectors.totalItemsText);
      const match = totalText.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch {
      return 0;
    }
  }

  async isTableEmpty() {
    const emptyRow = await this.isElementPresent(
      By.css(".ant-empty, .ant-table-placeholder")
    );
    return emptyRow;
  }
}
