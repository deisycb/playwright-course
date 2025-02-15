import { expect } from '@playwright/test'; // Importa la función expect desde @playwright/test para realizar aserciones en las pruebas.
import { Navigation } from './Navigation'; // Importa la clase Navigation desde el archivo Navigation.js.
import { isDesktopViewport } from "./../utils/isDesktopViewport.js";

export class ProductsPage { // Define y exporta la clase ProductsPage.
    constructor(page) { // Constructor de la clase que se ejecuta al crear una instancia de ProductsPage.
        this.page = page; // Asigna el objeto page a una propiedad de la clase.
        this.addButtons = page.locator('[data-qa="product-button"]'); // Define un localizador para los botones de "Add to Basket".
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]'); // Define un localizador para el menú desplegable de ordenación.
        this.productTitle = page.locator('[data-qa="product-title"]'); // Define un localizador para los títulos de los productos.
    }

    visit = async () => { // Método para visitar la página principal.
        await this.page.goto("/"); // Navega a la URL raíz del sitio.
    }

    addProductToBasket = async (index) => { // Método para añadir un producto a la cesta.
        const specificAddButton = this.addButtons.nth(index); // Obtiene el botón de "Add to Basket" en la posición especificada por index.
        await specificAddButton.waitFor(); // Espera a que el botón específico esté presente en la página.
        await expect(specificAddButton).toHaveText("Add to Basket"); // Verifica que el texto del botón sea "Add to Basket".
        const navigation = new Navigation(this.page); // Crea una instancia de la clase Navigation.
       
        let basketCountBeforeAdding;

        if (isDesktopViewport(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount();
        }
    
        basketCountBeforeAdding = await navigation.getBasketCount(); // Obtiene el número de elementos en la cesta antes de añadir el producto.
        await specificAddButton.click(); // Hace clic en el botón para añadir el producto a la cesta.
        await expect(specificAddButton).toHaveText("Remove from Basket"); // Verifica que el texto del botón haya cambiado a "Remove from Basket".
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount();
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
        }
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor(); // Espera a que el menú desplegable de ordenación esté presente en la página.
        await this.productTitle.first().waitFor(); // Espera a que el primer título de producto esté presente en la página.
        const productTitlesBeforeSorting = await this.productTitle.allInnerTexts(); // Obtiene los títulos de los productos antes de ordenar.
        await this.sortDropdown.selectOption("price-asc"); // Selecciona la opción de ordenar por precio ascendente en el menú desplegable.
        const productTitlesAfterSorting = await this.productTitle.allInnerTexts(); // Obtiene los títulos de los productos después de ordenar.
        expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting); // Verifica que los títulos de los productos hayan cambiado después de ordenar.
    }
}
