import { test, expect } from '@playwright/test';
import { ProductsPage } from '../page-objects/ProductsPage';

test.skip("Product Page Add To Basket", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.visit();

    await expect(productsPage.getAddToBasketButtonText(0)).resolves.toBe("Add to Basket");
    await expect(productsPage.getBasketCount()).resolves.toBe("0");

    await productsPage.addProductToBasket(0);

    await expect(productsPage.getAddToBasketButtonText(0)).resolves.toBe("Remove from Basket");
    await expect(productsPage.getBasketCount()).resolves.toBe("1");

    const checkoutLink = page.getByRole('link', { name: "Checkout" });
    await checkoutLink.waitFor();
    await checkoutLink.click();
    await page.waitForURL("/basket");

    //await page.pause();
});