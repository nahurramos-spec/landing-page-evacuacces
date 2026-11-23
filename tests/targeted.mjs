import { launchBrowser } from "./browser-config.mjs";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { initialState, STORAGE_KEY } from "../js/state.js";
const browser = await launchBrowser();
const context = await browser.newContext();
const page = await context.newPage();
const directory = process.env.EVIDENCE_DIR || "docs/evidencias";
await fs.mkdir(directory, { recursive: true });
const results = [];
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(
    ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
    { key: STORAGE_KEY, state: initialState() },
  );
  await page.goto("http://127.0.0.1:4173/#/ppe");
  await page.reload();
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${directory}/ppe-${width}.png` });
  const analysis = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.equal(
    analysis.violations.length,
    0,
    JSON.stringify(analysis.violations),
  );
  const hash = new URL(page.url()).hash;
  await page.locator(".skip").focus();
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).hash, hash);
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "main-content",
  );
  results.push({
    case: `PPE y salto al contenido por teclado · ${width} px`,
    status: "APROBADA",
    axeViolations: analysis.violations.length,
  });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:4173/#landing");
await page.reload();
assert.equal(
  await page
    .locator(".landing-header")
    .getByRole("link", { name: "Ingresar", exact: true })
    .isVisible(),
  true,
);
await page.screenshot({
  path: `${directory}/landing-390-responsive.png`,
  fullPage: true,
});
const enlarged = initialState();
enlarged.prefs.text = 200;
await page.evaluate(
  ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
  { key: STORAGE_KEY, state: enlarged },
);
await page.reload();
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  true,
);
results.push({
  case: "Landing móvil: acceso a demo visible y texto 200 % sin desbordamiento",
  status: "APROBADA",
});
await browser.close();
await fs.writeFile(
  `${directory}/qa-targeted.json`,
  JSON.stringify({ date: new Date().toISOString(), results }, null, 2),
);
console.log(results);
