import { isDesktopViewport } from "./../utils/isDesktopViewport.js"

export class Navigation {
    constructor(page) {
        this.page = page;

        this.basketCounter = page.locator('[data-qa="header-basket-count"]');
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' }) // Define un localizador para el contador de la cesta.

        this.mobileBurgerButton = page.locator('[data-qa="burger-button"]')
       /* this.homeLink = page.locator('[data-qa="home-link"]');
        this.productsLink = page.locator('[data-qa="products-link"]');
        this.basketLink = page.locator('[data-qa="basket-link"]');*/
    }
    getBasketCount = async () => { // Método para obtener el número de elementos en la cesta.
        await this.basketCounter.waitFor(); // Espera a que el contador de la cesta esté presente en la página.
        const text = await this.basketCounter.innerText(); // Obtiene el texto del contador de la cesta.
        return parseInt(text, 10); // Convierte el texto a un número entero y lo devuelve.
    }

    goToCheckout = async () => {
        if (!isDesktopViewport(this.page)) {
            await this.mobileBurgerButton.waitFor()
            await this.mobileBurgerButton.click()
        }

        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()
        await this.page.waitForURL("/basket")
    }
 }