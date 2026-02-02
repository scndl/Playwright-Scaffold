import { test as base } from '@playwright/test';
import { DemoWebShopHomePage } from '../../pages/demowebshop/home.page';
import { DemoWebShopLoginPage } from '../../pages/demowebshop/login.page';
import { DemoWebShopProductPage } from '../../pages/demowebshop/product.page';
import { DemoWebShopCartPage } from '../../pages/demowebshop/cart.page';
import { DemoWebShopCheckoutPage } from '../../pages/demowebshop/checkout.page';

/**
 * Framework fixtures for page objects.
 * Add new page object types here as you create them.
 */
export type FrameworkFixtures = {
    /** DemoWebShop home page object */
    demoWebShopHomePage: DemoWebShopHomePage;
    /** DemoWebShop login page object */
    demoWebShopLoginPage: DemoWebShopLoginPage;
    /** DemoWebShop product page object */
    demoWebShopProductPage: DemoWebShopProductPage;
    /** DemoWebShop cart page object */
    demoWebShopCartPage: DemoWebShopCartPage;
    /** DemoWebShop checkout page object */
    demoWebShopCheckoutPage: DemoWebShopCheckoutPage;
    resetStorageState: () => Promise<void>;
};

/**
 * Extended test with page object fixtures.
 * Import this in your test files to access page objects.
 *
 * @example
 * ```ts
 * import { test, expect } from '../fixtures/pom/page-object-fixture';
 *
 * test('example test', async ({ appPage }) => {
 *   await appPage.openHomePage();
 *   await expect(appPage.appTitle).toBeVisible();
 * });
 * ```
 */
export const test = base.extend<FrameworkFixtures>({
    demoWebShopHomePage: async ({ page }, use) => {
        await use(new DemoWebShopHomePage(page));
    },

    demoWebShopLoginPage: async ({ page }, use) => {
        await use(new DemoWebShopLoginPage(page));
    },

    demoWebShopProductPage: async ({ page }, use) => {
        await use(new DemoWebShopProductPage(page));
    },

    demoWebShopCartPage: async ({ page }, use) => {
        await use(new DemoWebShopCartPage(page));
    },

    demoWebShopCheckoutPage: async ({ page }, use) => {
        await use(new DemoWebShopCheckoutPage(page));
    },

    resetStorageState: async ({ context }, use) => {
        await use(async () => {
            await context.clearCookies();
            await context.clearPermissions();
        });
    },
});

export { expect } from '@playwright/test';
