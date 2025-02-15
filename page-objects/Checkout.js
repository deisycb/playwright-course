import { expect } from "@playwright/test";

export class Checkout { // Define y exporta la clase Checkout.
    constructor(page) { // Constructor de la clase que se ejecuta al crear una instancia de Checkout.
        this.page = page; // Asigna el objeto page a una propiedad de la clase.

        this.basketCards = page.locator('[data-qa="basket-card"]'); // Define un localizador para las tarjetas de productos en la cesta.
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]'); // Define un localizador para los precios de los productos en la cesta.
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]'); // Define un localizador para los botones de eliminar productos en la cesta.
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]'); // Define un localizador para el botón de continuar al proceso de pago.
    }

    removeCheapestProduct = async () => { // Método para eliminar el producto más barato de la cesta.
        await this.basketCards.first().waitFor(); // Espera a que la primera tarjeta de producto esté presente en la página.
        const itemsBeforeRemoval = await this.basketCards.count();
        await this.basketItemPrice.first().waitFor(); // Espera a que el primer precio de producto esté presente en la página.
        const allPriceTexts = await this.basketItemPrice.allInnerTexts(); // Obtiene los textos de todos los precios de los productos en la cesta.
        // [ '499$', '599$', '320$' ] -> [ 499, 599, 320 ]
        const justNumbers = allPriceTexts.map((element) => { // Convierte los textos de precios a números.
            const withoutDollarSign = element.replace("$", ""); // Elimina el signo de dólar del texto del precio.
            return parseInt(withoutDollarSign, 10); // Convierte el texto del precio a un número entero.
        });
        
        const smallestPrice = Math.min(...justNumbers); // Obtiene el precio más bajo de la lista de precios.
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice); // Obtiene el índice del precio más bajo en la lista de precios.
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx); // Obtiene el botón de eliminar correspondiente al producto más barato.
        await specificRemoveButton.waitFor(); // Espera a que el botón de eliminar esté presente en la página.
        await specificRemoveButton.click(); // Hace clic en el botón de eliminar para eliminar el producto más barato.
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1); // Verifica que el número de tarjetas de producto haya disminuido en uno.
    }

    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor();
        await this.continueToCheckoutButton.click();
        await this.page.waitForURL(/\/login/, { timeout: 3000 });
    }
}