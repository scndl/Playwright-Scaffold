import { expect, Locator, Page } from '@playwright/test';

export class DemoWebShopProductPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    /**
     * The shopping cart link in the header.
     */
    get shoppingCartLink(): Locator {
        return this.page.locator('.header-links').getByRole('link', { name: /Shopping cart/ });
    }

    /**
     * The cart quantity badge showing number of items.
     */
    get cartQuantity(): Locator {
        return this.page.locator('.cart-qty');
    }

    /**
     * Success notification bar that appears after adding items.
     */
    get successNotification(): Locator {
        return this.page.locator('.bar-notification.success');
    }

    /**
     * Close button for the notification bar.
     */
    get closeNotificationButton(): Locator {
        return this.page.locator('.close');
    }

    // ==================== Dynamic Locators ====================

    /**
     * Gets the category link by category name from the main navigation.
     * @param {string} categoryName - The name of the category (e.g., "Books", "Computers").
     * @returns {Locator} The category link locator.
     */
    getCategoryLink(categoryName: string): Locator {
        return this.page.locator('.top-menu').getByRole('link', { name: categoryName, exact: true });
    }

    /**
     * Gets the product title link by product name.
     * @param {string} productName - The name of the product.
     * @returns {Locator} The product title link locator.
     */
    getProductLink(productName: string): Locator {
        return this.page.getByRole('link', { name: productName, exact: true });
    }

    /**
     * Gets the "Add to cart" button for a specific product.
     * @param {string} productName - The name of the product.
     * @returns {Locator} The add to cart button locator.
     */
    getAddToCartButton(productName: string): Locator {
        return this.page
            .locator('.product-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Add to cart' });
    }

    /**
     * Gets the quantity input field on the product detail page.
     * @returns {Locator} The quantity input locator.
     */
    get quantityInput(): Locator {
        return this.page.locator('.qty-input');
    }

    /**
     * Gets the "Add to cart" button on the product detail page.
     * @returns {Locator} The add to cart button on detail page.
     */
    get addToCartButtonDetail(): Locator {
        return this.page.locator('.product-essential').getByRole('button', { name: 'Add to cart' });
    }

    // ==================== Actions ====================

    /**
     * Navigates to a specific product category.
     *
     * @param {string} categoryName - The name of the category to navigate to.
     * @returns {Promise<void>}
     */
    async navigateToCategory(categoryName: string): Promise<void> {
        // Special handling for subcategories
        const subcategoryMappings = {
            'Notebooks': 'Computers',
            'Desktops': 'Computers',
            'Accessories': 'Computers',
            'Camera, photo': 'Electronics',
            'Cell phones': 'Electronics'
        };

        // Try to find the category in the main navigation first
        const mainNavLink = this.page.locator('.top-menu').getByRole('link', { name: categoryName, exact: true });
        
        if (await mainNavLink.count() > 0) {
            await mainNavLink.click();
        } else if (subcategoryMappings[categoryName]) {
            // If it's a subcategory, first navigate to parent category
            const parentCategory = subcategoryMappings[categoryName];
            const parentNavLink = this.page.locator('.top-menu').getByRole('link', { name: parentCategory, exact: true });
            await parentNavLink.click();
            await this.page.waitForLoadState('domcontentloaded');
            
            // Then navigate to the subcategory from the sidebar or page
            // Wait for the page to load, then click the subcategory
            await this.page.waitForSelector('.sub-category-item', { timeout: 5000 });
            const subcategoryLink = this.page.locator('.sub-category-item').getByRole('link', { name: categoryName }).first();
            await subcategoryLink.click();
        } else {
            throw new Error(`Category "${categoryName}" not found in navigation`);
        }
        
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Adds a product to the cart from the category listing page.
     * Waits for success notification to confirm the action.
     *
     * @param {string} productName - The name of the product to add.
     * @returns {Promise<void>}
     */
    async addProductToCartFromListing(productName: string): Promise<void> {
        await this.getAddToCartButton(productName).click();
        await expect(this.successNotification).toBeVisible();
        await this.closeNotificationButton.click();
    }

    /**
     * Navigates to a product detail page, sets quantity, and adds it to cart.
     * Waits for success notification to confirm the action.
     *
     * @param {string} categoryName - The category containing the product.
     * @param {string} productName - The name of the product.
     * @param {number} quantity - The quantity to add to cart.
     * @returns {Promise<void>}
     */
    async addProductToCartWithQuantity(
        categoryName: string,
        productName: string,
        quantity: number
    ): Promise<void> {
        await this.navigateToCategory(categoryName);
        await this.getProductLink(productName).click();

        if (quantity > 1) {
            await this.quantityInput.clear();
            await this.quantityInput.fill(quantity.toString());
        }

        await this.addToCartButtonDetail.click();
        await expect(this.successNotification).toBeVisible();
        await this.closeNotificationButton.click();
    }

    /**
     * Navigates to the shopping cart page.
     * @returns {Promise<void>}
     */
    async goToShoppingCart(): Promise<void> {
        await this.shoppingCartLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
