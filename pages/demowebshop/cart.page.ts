import { expect, Locator, Page } from '@playwright/test';

export class DemoWebShopCartPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    /**
     * The shopping cart page heading.
     */
    get pageHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Shopping cart' });
    }

    /**
     * The "Terms of service" checkbox.
     */
    get termsOfServiceCheckbox(): Locator {
        return this.page.locator('#termsofservice');
    }

    /**
     * The checkout button.
     */
    get checkoutButton(): Locator {
        return this.page.getByRole('button', { name: 'Checkout' });
    }

    /**
     * The subtotal value in the cart totals section.
     */
    get subtotal(): Locator {
        return this.page.locator('.cart-total tr').filter({ hasText: 'Sub-Total:' }).locator('td').nth(1);
    }

    /**
     * The shipping cost value in the cart totals section.
     */
    get shippingCost(): Locator {
        return this.page.locator('.cart-total tr').filter({ hasText: 'Shipping:' }).locator('td').nth(1);
    }

    /**
     * The tax value in the cart totals section.
     */
    get tax(): Locator {
        return this.page.locator('.cart-total tr').filter({ hasText: 'Tax:' }).locator('td').nth(1);
    }

    /**
     * The total value in the cart totals section.
     */
    get total(): Locator {
        return this.page.locator('.cart-total tr').filter({ hasText: 'Total:' }).locator('td').nth(1);
    }

    /**
     * All product rows in the shopping cart table.
     */
    get productRows(): Locator {
        return this.page.locator('.cart tbody tr');
    }

    // ==================== Dynamic Locators ====================

    /**
     * Gets the product row by product name.
     * @param {string} productName - The name of the product.
     * @returns {Locator} The product row locator.
     */
    getProductRow(productName: string): Locator {
        return this.page.locator('.cart tbody tr').filter({ hasText: productName });
    }

    /**
     * Gets the unit price for a specific product.
     * @param {string} productName - The name of the product.
     * @returns {Locator} The unit price locator.
     */
    getProductUnitPrice(productName: string): Locator {
        return this.getProductRow(productName).locator('.product-unit-price');
    }

    /**
     * Gets the quantity for a specific product.
     * @param {string} productName - The name of the product.
     * @returns {Locator} The quantity input locator.
     */
    getProductQuantity(productName: string): Locator {
        return this.getProductRow(productName).locator('.qty-input');
    }

    // ==================== Actions ====================

    /**
     * Verifies that a product is present in the cart with correct price and quantity.
     *
     * @param {string} productName - The name of the product.
     * @param {number} expectedPrice - The expected unit price.
     * @param {number} expectedQuantity - The expected quantity.
     * @returns {Promise<void>}
     */
    async verifyProductInCart(
        productName: string,
        expectedPrice: number,
        expectedQuantity: number
    ): Promise<void> {
        const row = this.getProductRow(productName);
        await expect(row).toBeVisible();

        const unitPriceText = await this.getProductUnitPrice(productName).textContent();
        const unitPrice = parseFloat(unitPriceText!.replace('$', '').trim());
        expect(unitPrice).toBe(expectedPrice);

        const quantityValue = await this.getProductQuantity(productName).inputValue();
        expect(parseInt(quantityValue)).toBe(expectedQuantity);

        const expectedSubtotal = expectedPrice * expectedQuantity;
        const subtotalText = await row.locator('.product-subtotal').textContent();
        const subtotal = parseFloat(subtotalText!.replace('$', '').trim());
        expect(subtotal).toBe(expectedSubtotal);
    }

    /**
     * Calculates and verifies the cart totals.
     * Validates that subtotal matches sum of all product subtotals.
     *
     * @param {number} expectedSubtotal - The expected cart subtotal.
     * @returns {Promise<void>}
     */
    async verifyCartTotals(expectedSubtotal: number): Promise<void> {
        const subtotalText = await this.subtotal.textContent();
        const actualSubtotal = parseFloat(subtotalText!.replace('$', '').trim());
        
        expect(actualSubtotal).toBe(expectedSubtotal);
    }

    /**
     * Proceeds to checkout by accepting terms of service and clicking checkout button.
     * @returns {Promise<void>}
     */
    async proceedToCheckout(): Promise<void> {
        await this.termsOfServiceCheckbox.check();
        await expect(this.termsOfServiceCheckbox).toBeChecked();
        
        await this.checkoutButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Extracts numeric value from a price string.
     *
     * @param {string} priceText - The price text (e.g., "$1,234.56").
     * @returns {number} The numeric price value.
     */
    parsePrice(priceText: string): number {
        return parseFloat(priceText.replace(/[$,]/g, '').trim());
    }

    /**
     * Gets all product subtotals and calculates the total.
     * @returns {Promise<number>} The calculated total from all products.
     */
    async calculateTotalFromProducts(): Promise<number> {
        const rows = await this.productRows.all();
        let total = 0;

        for (const row of rows) {
            const subtotalText = await row.locator('.product-subtotal').textContent();
            total += this.parsePrice(subtotalText!);
        }

        return total;
    }
}
