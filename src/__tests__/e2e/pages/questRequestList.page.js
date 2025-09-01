import { By } from "selenium-webdriver";
import { BasePage } from "./base.page.js";

export class QuestRequestListPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = "/quest/quest-requests";
    this.selectors = {
      // Filters
      searchInput: By.css(
        "input[placeholder*='Request ID'], input[placeholder*='Quest ID'], input[placeholder*='Email']"
      ),
      statusSelect: By.css("form .ant-select:nth-child(1)"),
      questTypeSelect: By.css("form .ant-select:nth-child(2)"),
      dateRangePicker: By.css(".ant-picker-range"),
      dateRangeStartInput: By.css(".ant-picker-range input:first-child"),
      dateRangeEndInput: By.css(".ant-picker-range input:last-child"),
      searchButton: By.css("button[type='submit']"),
      resetButton: By.css("button:has(.anticon-sync)"),

      // Table
      requestTable: By.css(".ant-table-tbody"),
      requestRows: By.css(".ant-table-tbody tr"),
      requestLinks: By.css(".ant-table-tbody td a"),
      statusTags: By.css(".ant-tag"),

      // Actions
      addNewButton: By.css("button.ant-btn-primary"),

      // Pagination
      pagination: By.css(".ant-pagination"),
      pageNumbers: By.css(".ant-pagination-item"),
      nextPageButton: By.css(".ant-pagination-next"),
      prevPageButton: By.css(".ant-pagination-prev"),
      pageSizeSelect: By.css(".ant-pagination-options-size-changer"),

      // Total count
      totalItemsText: By.xpath("//div[contains(text(), 'Total')]"),
    };
  }

  async open() {
    await super.open(this.url);
    await this.waitForTableLoad();
  }

  async waitForTableLoad() {
    await this.waitForElement(this.selectors.requestTable);
    await this.driver.sleep(1000);
  }

  async searchRequests(keyword) {
    await this.type(this.selectors.searchInput, keyword);
    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async filterByStatus(status) {
    await this.selectDropdownOption(this.selectors.statusSelect, status);
    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async filterByQuestType(questType) {
    await this.selectDropdownOption(this.selectors.questTypeSelect, questType);
    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async filterByDateRange(startDate, endDate) {
    // Click date range picker
    await this.click(this.selectors.dateRangePicker);
    await this.driver.sleep(500);

    // Input start date
    await this.type(this.selectors.dateRangeStartInput, startDate);
    await this.driver.sleep(300);

    // Input end date
    await this.type(this.selectors.dateRangeEndInput, endDate);
    await this.driver.sleep(300);

    // Press Enter or click outside to confirm
    await this.driver.executeScript("document.body.click()");
    await this.driver.sleep(500);

    await this.click(this.selectors.searchButton);
    await this.waitForTableLoad();
  }

  async resetFilters() {
    await this.click(this.selectors.resetButton);
    await this.waitForTableLoad();
  }

  async getRequestCount() {
    const rows = await this.driver.findElements(this.selectors.requestRows);
    return rows.length;
  }

  async clickRequestByIndex(index) {
    const requestLinks = await this.driver.findElements(
      this.selectors.requestLinks
    );
    if (requestLinks[index]) {
      await requestLinks[index].click();
      await this.waitForUrlContains("/quest-requests/");
    }
  }

  async getStatusTags() {
    const tags = await this.driver.findElements(this.selectors.statusTags);
    const statusTexts = [];
    for (const tag of tags) {
      statusTexts.push(await tag.getText());
    }
    return statusTexts;
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
