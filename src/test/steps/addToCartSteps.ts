import { Given, When, Then, setDefaultTimeout  } from "@cucumber/cucumber";

import { Page, expect } from "@playwright/test";

setDefaultTimeout(60 * 1000 * 2)

let page: Page;

Given('user search for a {string}', async function (book) {
    await page.locator("//input[@type='search']").fill(book);
    await page.locator("//mat-option[@role='option']//span[1]").click();
});

When('user add the book to the cart', async function () {
    await page.locator("//button[@color='primary']").click();
});
Then('the cart badge should get updated', async function () {
    const badgeCount = await page.locator("#mat-badge-content-0").textContent();
    expect(Number(badgeCount?.length)).toBeGreaterThan(0);
});