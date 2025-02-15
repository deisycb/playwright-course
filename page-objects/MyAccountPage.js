export class MyAccountPage {
    constructor(page) {
        this.page = page;
        this.pageHeading = page.getByRole('heading', { name: 'My Account' });
        this.errorMessage = page.locator('[data-qa="error-message"]')
        // Define un localizador para el encabezado de la página "My Account".
    }

    visit = async () => {
        await this.page.goto("/my-account");
        await this.page.pause();
    }
    
    waitForPageHeading = async () => {
        await this.pageHeading.waitFor();
    }

    waitForErrorMessage = async () => {
        await this.errorMessage.waitFor()
    }
}