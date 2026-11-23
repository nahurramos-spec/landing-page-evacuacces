import { launchBrowser } from "./browser-config.mjs";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const qa = JSON.parse(
  await fs.readFile("docs/evidencias/qa-browser.json", "utf8"),
);
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } }),
  metrics = [];
await page.goto(base);
for (const width of [1440, 390]) {
  const items = qa.visual.filter((x) => x.width === width);
  for (let offset = 0; offset < items.length; offset += 4) {
    const chunk = items.slice(offset, offset + 4),
      html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>Comparación EvacuAccess</title><style>body{font:16px Arial;margin:20px;background:#ddd;color:#111}h1{font-size:24px}h2{font-size:18px;margin:16px 0 6px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}img{width:100%;height:auto;display:block}figure{margin:0}figcaption{padding:8px;background:#fff}main{max-width:${width === 390 ? "790" : "1160"}px;margin:auto}</style><main><h1>Figma / Implementación · ${width} px</h1>${chunk.map((x) => `<h2>${x.view}</h2><div class="pair"><figure><figcaption>Referencia original</figcaption><img src="${base}/${x.reference}"></figure><figure><figcaption>Implementación funcional</figcaption><img src="${base}/${x.path}"></figure></div>`).join("")}</main></html>`;
    await page.setContent(html);
    await page
      .locator("img")
      .evaluateAll((imgs) => Promise.all(imgs.map((i) => i.decode())));
    await page.screenshot({
      path: `docs/evidencias/comparacion-${width}-${offset / 4 + 1}.png`,
      fullPage: true,
    });
  }
  for (const item of items) {
    const metric = await page.evaluate(
      async ({ item, base }) => {
        const load = async (src) => {
          const i = new Image();
          i.src = src;
          await i.decode();
          return i;
        };
        const a = await load(base + "/" + item.reference),
          b = await load(base + "/" + item.path);
        const canvas = document.createElement("canvas");
        canvas.width = a.naturalWidth;
        canvas.height = a.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
        const p = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(b, 0, 0, canvas.width, canvas.height);
        const q = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let sum = 0,
          changed = 0;
        for (let i = 0; i < p.length; i += 4) {
          let diff = 0;
          for (let c = 0; c < 3; c++) {
            const d = Math.abs(p[i + c] - q[i + c]);
            sum += d;
            diff = Math.max(diff, d);
          }
          if (diff > 30) changed++;
        }
        return {
          view: item.view,
          width: item.width,
          referenceSize: [a.naturalWidth, a.naturalHeight],
          implementationSize: [b.naturalWidth, b.naturalHeight],
          meanAbsoluteChannelError:
            Math.round((sum / ((p.length / 4) * 3)) * 100) / 100,
          pixelsOver30: changed,
          pixelCount: p.length / 4,
        };
      },
      { item, base },
    );
    metrics.push(metric);
  }
}
await fs.writeFile(
  "docs/evidencias/comparacion-pixeles.json",
  JSON.stringify(
    {
      method:
        "Error absoluto medio RGB (0–255) y cantidad de píxeles con diferencia máxima de canal >30. Implementación escalada a la referencia. No es un porcentaje de fidelidad; los estados, controles y contenido funcional adicional también producen diferencias.",
      metrics,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  `${[1440, 390].reduce((n, w) => n + Math.ceil(qa.visual.filter((v) => v.width === w).length / 4), 0)} láminas comparativas y ${metrics.length} mediciones de diferencia guardadas.`,
);
