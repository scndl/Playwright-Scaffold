import { expect, Locator, Page } from '@playwright/test';

export class DemoWebShopLoginPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    /**
     * The login link in the header.
     */
    get loginLink(): Locator {
        return this.page.getByRole('link', { name: 'Log in' });
    }

    /**
     * The email input field on the login page.
     */
    get emailInput(): Locator {
        return this.page.getByLabel('Email:');
    }

    /**
     * The password input field on the login page.
     */
    get passwordInput(): Locator {
        return this.page.getByLabel('Password:');
    }

    /**
     * The login submit button.
     */
    get loginButton(): Locator {
        return this.page.getByRole('button', { name: 'Log in' });
    }

    /**
     * The logout link, visible after successful login.
     */
    get logoutLink(): Locator {
        return this.page.getByRole('link', { name: 'Log out' });
    }

    /**
     * The user account email displayed in the header.
     */
    get accountEmail(): Locator {
        return this.page.locator('.account');
    }

    /**
     * The welcome sign in message on the login page.
     */
    get welcomeSignInMessage(): Locator {
        return this.page.getByText('Welcome, Please Sign In!');
    }

    /**
     * The checkout as guest button on the login/checkout page.
     */
    get checkoutAsGuestButton(): Locator {
        return this.page.getByRole('button', { name: 'Checkout as Guest' });
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
     * Performs login with the provided credentials.
     * Waits for the logout link to appear, confirming successful authentication.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<void>}
     */
    async login(email: string, password: string): Promise<void> {
        await this.loginLink.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        await expect(this.logoutLink).toBeVisible();
    }

    /**
     * Performs login and verifies successful authentication by checking the account email display.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<void>}
     */
    async loginAndVerify(email: string, password: string): Promise<void> {
        await this.login(email, password);
        await expect(this.accountEmail).toContainText(email);
    }

    /**
     * Clicks the checkout as guest button.
     * @returns {Promise<void>}
     */
    async checkoutAsGuest(): Promise<void> {
        await this.checkoutAsGuestButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
