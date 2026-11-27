import { launchBrowser } from "./browser-config.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
const directory = process.env.EVIDENCE_DIR || "docs/evidencias";
await fs.mkdir(directory, { recursive: true });
const results = [];
const js = (await fs.readdir("js")).filter((x) => x.endsWith(".js"));
for (const name of js) {
  const result = spawnSync(
    process.execPath,
    ["--check", `js/${name}`],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const source = await fs.readFile(`js/${name}`, "utf8");
  for (const m of source.matchAll(/from ['"](.+?)['"]/g))
    await fs.access(path.resolve("js", m[1]));
}
results.push({
  case: "Sintaxis e importaciones de módulos nativos",
  status: "APROBADA",
  modules: js.length,
});
for (const name of await fs.readdir("css")) {
  const source = await fs.readFile(`css/${name}`, "utf8");
  for (const m of source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))
    await fs.access(path.resolve("css", m[1]));
}
results.push({
  case: "Recursos de hojas de estilo presentes",
  status: "APROBADA",
});
const rows = JSON.parse(
  await fs.readFile("docs/figma/criterios-oficiales.json", "utf8"),
);
assert.equal(rows.length, 30);
assert.equal(new Set(rows.map((r) => r.text[0].text)).size, 30);
assert.equal(
  rows.reduce(
    (a, r) => a + r.text.filter((t) => /CA0[123]:/.test(t.text)).length,
    0,
  ),
  90,
);
const trace = await fs.readFile("docs/hu-trazabilidad.md", "utf8");
assert.equal((trace.match(/^\| HU-\d+/gm) || []).length, 30);
results.push({
  case: "Matriz: exactamente 30 HU y 90 criterios oficiales",
  status: "APROBADA",
});
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } }),
  missing = [];
page.on("response", (r) => {
  if (r.status() >= 400) missing.push({ url: r.url(), status: r.status() });
});
await page.goto("http://127.0.0.1:4173/dist/");
await page.locator("h1").waitFor();
await page.getByRole("link", { name: "Iniciar EvacuAccess", exact: true }).first().click();
await page.waitForURL("**/#/recorridos");
assert.equal(await page.locator("iframe").count(), 0);
await page
  .getByRole("button", { name: "02 Discapacidad auditiva", exact: true })
  .click();
await page.waitForURL("**/dist/#/alerta");
await page.locator(".acknowledge").click();
await page.waitForURL("**/#/ruta");
await page.locator('[data-view="ruta"]').waitFor();
assert.equal(
  await page.evaluate(() => document.activeElement !== document.body),
  true,
);
const links = await page
  .locator("a")
  .evaluateAll((as) =>
    as
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && !h.startsWith("#") && !h.startsWith("http")),
  );
for (const href of links) {
  const r = await page.request.get(new URL(href, page.url()).href);
  assert.ok(r.ok(), href);
}
assert.deepEqual(missing, []);
await page.screenshot({ path: `${directory}/subdirectorio-mobile.png` });
results.push({
  case: "Paquete dist bajo subdirectorio: landing → alerta → confirmación; recursos y foco",
  status: "APROBADA",
});
await page.goto("http://127.0.0.1:4173/dist/#/ruta");
await page.getByRole("button", { name: "Menú", exact: true }).click();
await page.keyboard.press("Escape");
assert.equal(
  await page.evaluate(() =>
    document.activeElement.classList.contains("menu-toggle"),
  ),
  true,
);
results.push({
  case: "Escape de menú devuelve foco a su control",
  status: "APROBADA",
});
await browser.close();
await fs.writeFile(
  `${directory}/qa-static.json`,
  JSON.stringify({ date: new Date().toISOString(), results, missing }, null, 2),
);
console.log(results);
