import { expect, test } from '../../../fixtures/pom/test-options';
import orderData from '../../../test-data/demowebshop/orderData.json';

test.describe('DemoWebShop - Guest User Shopping Cart Tests @e2e', () => {
    test.beforeEach(
        async ({ page, resetStorageState }) => {
            await resetStorageState();
            await page.goto(process.env.DEMO_WEBSHOP_URL!);
        }
    );

    test(
        'should add products to cart, verify calculations, and complete checkout as guest',
        { tag: ['@smoke', '@regression', '@e2e'] },
        async ({
            page,
            demoWebShopHomePage,
            demoWebShopLoginPage,
            demoWebShopProductPage,
            demoWebShopCartPage,
            demoWebShopCheckoutPage,
        }) => {
            await test.step('GIVEN user is on DemoWebShop as guest', async () => {
                await expect(demoWebShopHomePage.welcomeMessage).toBeVisible();
            });

            await test.step('WHEN user adds multiple products to cart', async () => {
                for (const product of orderData.products) {
                    await demoWebShopProductPage.addProductToCartWithQuantity(
                        product.category,
                        product.name,
                        product.quantity
                    );
                }
            });

            await test.step('AND user navigates to shopping cart', async () => {
                await demoWebShopProductPage.goToShoppingCart();
            });

            await test.step('THEN all products should be visible in cart with correct details', async () => {
                for (const product of orderData.products) {
                    await demoWebShopCartPage.verifyProductInCart(
                        product.name,
                        product.expectedPrice,
                        product.quantity
                    );
                }
            });

            await test.step('AND cart totals should be calculated correctly', async () => {
                const expectedSubtotal = orderData.products.reduce(
                    (sum, product) =>
                        sum + product.expectedPrice * product.quantity,
                    0
                );

                await demoWebShopCartPage.verifyCartTotals(expectedSubtotal);

                const calculatedTotal =
                    await demoWebShopCartPage.calculateTotalFromProducts();
                expect(calculatedTotal).toBe(expectedSubtotal);
            });

            await test.step('WHEN user proceeds to checkout', async () => {
                await demoWebShopCartPage.proceedToCheckout();
            });

            await test.step('AND user selects checkout as guest', async () => {
                await demoWebShopLoginPage.checkoutAsGuest();
            });

            await test.step('WHEN user completes checkout process', async () => {
                await demoWebShopCheckoutPage.fillBillingAddress({
                    firstName: orderData.shippingDetails.firstName,
                    lastName: orderData.shippingDetails.lastName,
                    email: orderData.shippingDetails.email,
                    company: orderData.shippingDetails.company,
                    country: orderData.shippingDetails.country,
                    city: orderData.shippingDetails.city,
                    address1: orderData.shippingDetails.address1,
                    zipCode: orderData.shippingDetails.zipCode,
                    phoneNumber: orderData.shippingDetails.phoneNumber,
                });

                await demoWebShopCheckoutPage.continueShippingAddress();
                await demoWebShopCheckoutPage.selectShippingMethod();
                await demoWebShopCheckoutPage.selectPaymentMethod();
                await demoWebShopCheckoutPage.continuePaymentInfo();
            });

            await test.step('AND user confirms the order', async () => {
                await demoWebShopCheckoutPage.confirmOrderButton.click();
            });

            await test.step('THEN order should be placed successfully', async () => {
                await expect(demoWebShopCheckoutPage.orderSuccessMessage).toBeVisible();
                await expect(demoWebShopCheckoutPage.orderNumber).toBeVisible();

                const orderNumberText = await demoWebShopCheckoutPage.orderNumber.textContent();
                expect(orderNumberText).toMatch(/Order number: \d+/);
            });
        }
    );
});
