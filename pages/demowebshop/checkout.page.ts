import { expect, Locator, Page } from '@playwright/test';

export class DemoWebShopCheckoutPage {
    constructor(private readonly page: Page) {}

    // ==================== Billing Address Locators ====================

    /**
     * The first name input field for billing address.
     */
    get billingFirstNameInput(): Locator {
        return this.page.locator('#BillingNewAddress_FirstName');
    }

    /**
     * The last name input field for billing address.
     */
    get billingLastNameInput(): Locator {
        return this.page.locator('#BillingNewAddress_LastName');
    }

    /**
     * The email input field for billing address.
     */
    get billingEmailInput(): Locator {
        return this.page.locator('#BillingNewAddress_Email');
    }

    /**
     * The company input field for billing address.
     */
    get billingCompanyInput(): Locator {
        return this.page.locator('#BillingNewAddress_Company');
    }

    /**
     * The country dropdown for billing address.
     */
    get billingCountryDropdown(): Locator {
        return this.page.locator('#BillingNewAddress_CountryId');
    }

    /**
     * The city input field for billing address.
     */
    get billingCityInput(): Locator {
        return this.page.locator('#BillingNewAddress_City');
    }

    /**
     * The address line 1 input field for billing address.
     */
    get billingAddress1Input(): Locator {
        return this.page.locator('#BillingNewAddress_Address1');
    }

    /**
     * The zip/postal code input field for billing address.
     */
    get billingZipCodeInput(): Locator {
        return this.page.locator('#BillingNewAddress_ZipPostalCode');
    }

    /**
     * The phone number input field for billing address.
     */
    get billingPhoneInput(): Locator {
        return this.page.locator('#BillingNewAddress_PhoneNumber');
    }

    /**
     * The continue button for billing address section.
     */
    get billingContinueButton(): Locator {
        return this.page.locator('#billing-buttons-container .button-1');
    }

    // ==================== Shipping Address Locators ====================

    /**
     * The continue button for shipping address section.
     */
    get shippingContinueButton(): Locator {
        return this.page.locator('#shipping-buttons-container .button-1');
    }

    // ==================== Shipping Method Locators ====================

    /**
     * Ground shipping method radio button.
     */
    get groundShippingRadio(): Locator {
        return this.page.locator('#shippingoption_0');
    }

    /**
     * The continue button for shipping method section.
     */
    get shippingMethodContinueButton(): Locator {
        return this.page.locator('#shipping-method-buttons-container .button-1');
    }

    // ==================== Payment Method Locators ====================

    /**
     * Cash on delivery payment method radio button.
     */
    get cashOnDeliveryRadio(): Locator {
        return this.page.locator('#paymentmethod_0');
    }

    /**
     * The continue button for payment method section.
     */
    get paymentMethodContinueButton(): Locator {
        return this.page.locator('#payment-method-buttons-container .button-1');
    }

    // ==================== Payment Info Locators ====================

    /**
     * The continue button for payment info section.
     */
    get paymentInfoContinueButton(): Locator {
        return this.page.locator('#payment-info-buttons-container .button-1');
    }

    // ==================== Confirm Order Locators ====================

    /**
     * The confirm order button.
     */
    get confirmOrderButton(): Locator {
        return this.page.getByRole('button', { name: 'Confirm' });
    }

    /**
     * The order success message.
     */
    get orderSuccessMessage(): Locator {
        return this.page.getByText('Your order has been successfully processed!');
    }

    /**
     * The order number displayed after successful order.
     */
    get orderNumber(): Locator {
        return this.page.getByText(/Order number: \d+/);
    }

    /**
     * The product name in the confirmation section.
     */
    getConfirmProductName(productName: string): Locator {
        return this.page.locator('.cart .product-name').filter({ hasText: productName });
    }

    /**
     * The product unit price in the confirmation section.
     */
    get confirmUnitPrice(): Locator {
        return this.page.locator('.product-unit-price');
    }

    /**
     * The product quantity in the confirmation section.
     */
    get confirmQuantity(): Locator {
        return this.page.locator('.product-quantity');
    }

    /**
     * The product subtotal in the confirmation section.
     */
    get confirmSubtotal(): Locator {
        return this.page.locator('.product-subtotal');
    }

    /**
     * The order total in the confirmation section.
     */
    get confirmOrderTotal(): Locator {
        return this.page.locator('.order-total strong');
    }

    // ==================== Actions ====================

    /**
     * Fills in the billing address form with provided details.
     *
     * @param {object} address - The address details object.
     * @param {string} address.firstName - First name.
     * @param {string} address.lastName - Last name.
     * @param {string} address.email - Email address.
     * @param {string} [address.company] - Company name (optional).
     * @param {string} address.country - Country name.
     * @param {string} address.city - City name.
     * @param {string} address.address1 - Address line 1.
     * @param {string} address.zipCode - Zip/postal code.
     * @param {string} address.phoneNumber - Phone number.
     * @returns {Promise<void>}
     */
    async fillBillingAddress(address: {
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        country: string;
        city: string;
        address1: string;
        zipCode: string;
        phoneNumber: string;
    }): Promise<void> {
        await this.billingFirstNameInput.fill(address.firstName);
        await this.billingLastNameInput.fill(address.lastName);
        await this.billingEmailInput.fill(address.email);
        
        if (address.company) {
            await this.billingCompanyInput.fill(address.company);
        }
        
        await this.billingCountryDropdown.selectOption({ label: address.country });
        await this.billingCityInput.fill(address.city);
        await this.billingAddress1Input.fill(address.address1);
        await this.billingZipCodeInput.fill(address.zipCode);
        await this.billingPhoneInput.fill(address.phoneNumber);
        await this.billingContinueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Continues with the same address for shipping.
     * @returns {Promise<void>}
     */
    async continueShippingAddress(): Promise<void> {
        await this.shippingContinueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Selects ground shipping method and continues.
     * @returns {Promise<void>}
     */
    async selectShippingMethod(): Promise<void> {
        await this.groundShippingRadio.check();
        await expect(this.groundShippingRadio).toBeChecked();
        await this.shippingMethodContinueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Selects cash on delivery payment method and continues.
     * @returns {Promise<void>}
     */
    async selectPaymentMethod(): Promise<void> {
        await this.cashOnDeliveryRadio.check();
        await expect(this.cashOnDeliveryRadio).toBeChecked();
        await this.paymentMethodContinueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Continues through payment info section.
     * @returns {Promise<void>}
     */
    async continuePaymentInfo(): Promise<void> {
        await this.paymentInfoContinueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Confirms the order and verifies success.
     * @returns {Promise<string>} The order number.
     */
    async confirmOrder(): Promise<string> {
        await this.confirmOrderButton.click();
        await expect(this.orderSuccessMessage).toBeVisible();
        
        const orderNumberText = await this.orderNumber.textContent();
        const orderNumber = orderNumberText!.match(/\d+/)![0];
        
        return orderNumber;
    }

    /**
     * Completes the entire checkout process.
     *
     * @param {object} address - The shipping/billing address details.
     * @returns {Promise<string>} The order number.
     */
    async completeCheckout(address: {
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        country: string;
        city: string;
        address1: string;
        zipCode: string;
        phoneNumber: string;
    }): Promise<string> {
        await this.fillBillingAddress(address);
        await this.continueShippingAddress();
        await this.selectShippingMethod();
        await this.selectPaymentMethod();
        await this.continuePaymentInfo();
        
        const orderNumber = await this.confirmOrder();
        return orderNumber;
    }

    /**
     * Verifies the order confirmation details.
     *
     * @param {number} expectedTotal - The expected order total.
     * @returns {Promise<void>}
     */
    async verifyOrderConfirmation(expectedTotal: number): Promise<void> {
        const totalText = await this.confirmOrderTotal.textContent();
        const actualTotal = parseFloat(totalText!.replace(/[$,]/g, '').trim());
        
        expect(actualTotal).toBeGreaterThan(0);
    }
}
