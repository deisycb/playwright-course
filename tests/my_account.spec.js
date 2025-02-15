import { test } from "@playwright/test";
import { MyAccountPage } from "./../page-objects/MyAccountPage.js";
import { getLoginToken } from "./../api-call/getLoginToken.js";
import { adminDetails } from "./../data/userDetails.js"

test.only("My Account using cookie injection and mocking network request", async ({ page }) =>{
    // make a request to the login endpoint
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)
    console.warn({ loginToken });
    
    // Inject the login token into the browser
    const myAccount = new MyAccountPage(page);
    await myAccount.visit();
    await page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "PLAYWRIGHT ERROR FROM MOCKING"}),
        })
    })
    
    await myAccount.visit();
    await myAccount.waitForPageHeading();
    await myAccount.waitForErrorMessage();
});