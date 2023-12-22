import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  BeforeStep,
  AfterStep,
  Status,
} from "@cucumber/cucumber";
import { pageFixture } from "./pageFixture";
import {
  chromium,
  Page,
  Browser,
  expect,
  BrowserContext,
} from "@playwright/test";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/utils/logger";

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  getEnv();
  browser = await invokeBrowser();
});

Before(async function ({ pickle }) {
  const scenarioName = pickle.name + pickle.id;
  context = await browser.newContext({
    recordVideo: {
      dir: "test-results/videos",
    },
  });
  const page = await browser.newPage();
  pageFixture.page = page;
  pageFixture.logger = createLogger(options(scenarioName));
});

/*
AfterStep(async function ({ pickle, result }) {
    const img = await pageFixture.page.screenshot( { path: `./test-result/screenshots/${pickle.name}.png`, type: "png"})
    await this.attach(img, "image/png")
})
*/

After(async function ({ pickle, result }) {
  // screenshot
  let videoPath: string;
  let img: Buffer;

  if (result?.status == Status.FAILED) {
    img = await pageFixture.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}.png`,
      type: "png",
    });
    videoPath = await pageFixture.page.video().path();
  }

  await pageFixture.page.close();
  await context.close();

  if (result?.status == Status.FAILED) {
    await this.attach(img, "image/png");
    await this.attach(fs.readFileSyc(videoPath), "video/webm");
  }
});

AfterAll(async function () {
  await browser.close();
  // pageFixture.logger.close();
});
