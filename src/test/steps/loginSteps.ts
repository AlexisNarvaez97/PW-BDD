import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test"
import { pageFixture } from "../../hooks/pageFixture";


Given("User navigates to the application", async function () {
  await pageFixture.page.goto("https://bookcart.azurewebsites.net/")
});

Given("User click on the login link", async function () {
  await pageFixture.page.locator("//span[text()='Login']").click();
});

Given("User enter the username as {string}", async function (username) {
  await pageFixture.page.locator("input[formcontrolname='username']").fill(username);
});

Given("User enter the password as {string}", async function (password) {
  await pageFixture.page.locator("input[formcontrolname='password']").fill(password);
});

When("User click on the login button", async function () {
  await pageFixture.page.locator("//button[@color='primary']").click();
  await pageFixture.page.waitForLoadState();
  await pageFixture.page.waitForTimeout(3000);
});

Then("Login should be success", async function () {
  const text = await pageFixture.page.locator("//button[contains(@class,'mat-focus-indicator mat-menu-trigger')]").textContent();
  console.log("Username: " + text);
});


When("Login should fail", async function () {
  const failureMessage = await pageFixture.page.locator("//mat-error[@role='alert']");
  await expect(failureMessage).toBeVisible();
});
