import { By } from "selenium-webdriver";
import { BasePage } from "./base.page.js";

export class NavigationPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.selectors = {
      // Sidebar navigation
      sidebar: By.css(".ant-layout-sider"),
      sidebarToggle: By.css(".ant-layout-sider-trigger"),

      // Menu items
      questsMenu: By.css("li[title='Quests'], a[href*='quest']"),
      questListMenuItem: By.css("a[href='/quest/quest-list']"),
      questRequestsMenuItem: By.css("a[href='/quest/quest-requests']"),

      discountMenu: By.css("li[title='Discount'], a[href*='discount']"),
      blindboxMenu: By.css("li[title='Blindbox'], a[href*='blindbox']"),

      // Breadcrumbs
      breadcrumb: By.css(".ant-breadcrumb"),
      breadcrumbItems: By.css(".ant-breadcrumb-item"),
      breadcrumbLinks: By.css(".ant-breadcrumb-link"),

      // User menu (if exists)
      userMenu: By.css(".ant-dropdown-trigger"),
      logoutOption: By.css("li:contains('Logout'), a:contains('Logout')"),

      // Page header
      pageHeader: By.css(".ant-page-header"),
      pageTitle: By.css("h1, .ant-typography-title"),
    };
  }

  async toggleSidebar() {
    await this.click(this.selectors.sidebarToggle);
    await this.driver.sleep(300);
  }

  async isSidebarCollapsed() {
    const sidebar = await this.waitForElement(this.selectors.sidebar);
    const className = await sidebar.getAttribute("class");
    return className.includes("ant-layout-sider-collapsed");
  }

  async navigateToQuestList() {
    await this.click(this.selectors.questListMenuItem);
    await this.waitForUrlContains("/quest/quest-list");
  }

  async navigateToQuestRequests() {
    await this.click(this.selectors.questRequestsMenuItem);
    await this.waitForUrlContains("/quest/quest-requests");
  }

  async navigateToDiscount() {
    await this.click(this.selectors.discountMenu);
    await this.waitForUrlContains("/discount");
  }

  async navigateToBlindbox() {
    await this.click(this.selectors.blindboxMenu);
    await this.waitForUrlContains("/blindbox");
  }

  async getBreadcrumbItems() {
    const items = await this.driver.findElements(
      this.selectors.breadcrumbItems
    );
    const breadcrumbs = [];
    for (const item of items) {
      breadcrumbs.push(await item.getText());
    }
    return breadcrumbs;
  }

  async clickBreadcrumbItem(index) {
    const links = await this.driver.findElements(
      this.selectors.breadcrumbLinks
    );
    if (links[index]) {
      await links[index].click();
      await this.driver.sleep(500);
    }
  }

  async getPageTitle() {
    try {
      return await this.getText(this.selectors.pageTitle);
    } catch {
      return null;
    }
  }

  async logout() {
    if (await this.isElementPresent(this.selectors.userMenu)) {
      await this.click(this.selectors.userMenu);
      await this.driver.sleep(300);
      await this.click(this.selectors.logoutOption);
      await this.waitForUrlContains("/");
    }
  }

  async isUserLoggedIn() {
    // Check if we're on a protected route (not login page)
    const currentUrl = await this.getCurrentUrl();
    return !currentUrl.includes("/login") && !currentUrl.endsWith("/");
  }
}
