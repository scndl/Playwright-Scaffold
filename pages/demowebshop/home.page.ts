import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the DemoWebShop home page.
 * Contains locators and methods for the homepage.
 */
export class DemoWebShopHomePage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    /**
     * The welcome message on the homepage.
     */
    get welcomeMessage(): Locator {
        return this.page.getByText('Welcome to our store');
    }

    /**
     * The login link in the header.
     */
    get loginLink(): Locator {
        return this.page.getByRole('link', { name: 'Log in' });
    }

    /**
     * The shopping cart link in the header.
     */
    get shoppingCartLink(): Locator {
        return this.page.locator('.header-links').getByRole('link', { name: /Shopping cart/ });
    }

    // ==================== Actions ====================

    /**
     * Navigates to the DemoWebShop homepage.
     * @returns {Promise<void>}
     */
    async open(): Promise<void> {
        await this.page.goto(process.env.DEMO_WEBSHOP_URL!, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Navigates to the shopping cart.
     * @returns {Promise<void>}
     */
    async goToShoppingCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

    /**
     * Navigates to the login page.
     * @returns {Promise<void>}
     */
    async goToLogin(): Promise<void> {
        await this.loginLink.click();
    }
}
