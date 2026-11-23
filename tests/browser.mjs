import { launchBrowser } from "./browser-config.mjs";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { initialState, transition, STORAGE_KEY } from "../js/state.js";
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const browser = await launchBrowser();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  acceptDownloads: true,
});
const page = await context.newPage(),
  results = [],
  errors = [],
  failedResources = [];
page.setDefaultTimeout(6000);
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) failedResources.push(r.url());
});
await fs.mkdir("docs/evidencias", { recursive: true });
async function reveal(locator) {
  await locator.waitFor({ state: "attached" });
  const panels = await locator.evaluate((node) => {
    const ids = [];
    for (let parent = node.parentElement; parent; parent = parent.parentElement)
      if (parent.tagName === "DETAILS") ids.unshift(parent.dataset.panel);
    return ids;
  });
  for (const id of panels) {
    const panel = page.locator(`details[data-panel="${id}"]`);
    if ((await panel.getAttribute("open")) === null)
      await panel.locator(":scope > summary").click();
  }
}
const click = async (a) => {
  const target = page.locator(`[data-action="${a}"]`).first();
  await reveal(target);
  await target.click();
  if (a === "sendSOS") await page.locator('[data-action="confirmSOS"]').click();
};
const stored = () =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)), STORAGE_KEY);
async function fixture(view = "landing", role = "usuario", transform) {
  let s = initialState();
  s.role = role;
  if (role === "brigadista")
    s = transition(s, "entry", { entry: "brigadista", role }).state;
  if (transform) s = transform(s);
  await page.goto(base);
  await page.evaluate(
    ({ k, s }) => localStorage.setItem(k, JSON.stringify(s)),
    { k: STORAGE_KEY, s },
  );
  await page.goto(base + (view === "landing" ? "#landing" : `#/${view}`));
  await page.reload();
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function run(name, fn) {
  try {
    await fn();
    results.push({ name, status: "APROBADA" });
    console.log("OK", name);
  } catch (e) {
    results.push({ name, status: "FALLÓ", detail: e.message });
    console.log("FAIL", name, e.message);
    await page
      .screenshot({ path: `docs/evidencias/fallo-${results.length}.png` })
      .catch(() => {});
  }
}
await run("Entrada a los siete recorridos", async () => {
  for (const [entry, view, role] of [
    ["general", "acceso", "usuario"],
    ["auditiva", "alerta", "usuario"],
    ["visual", "alerta", "usuario"],
    ["movilidad", "ppe", "usuario"],
    ["brigadista", "misiones", "brigadista"],
    ["admin", "admin", "admin"],
    ["visitante", "qr", "visitante"],
  ]) {
    await fixture("recorridos");
    await page
      .locator(`[data-action="entry"][data-payload*='${entry}']`)
      .click();
    await page.waitForURL(`**/#/${view}`);
    assert.equal((await stored()).role, role);
  }
});
await run(
  "Preferencias múltiples, alto contraste, texto 200 %, persistencia",
  async () => {
    await fixture("perfil");
    await page.locator("[name=need0]").check();
    await page.locator("[name=need2]").check();
    await page.locator("[name=contrast]").check();
    await page.selectOption("#text-size", "200");
    await page
      .getByRole("button", { name: "Guardar preferencias", exact: true })
      .click();
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("class"), "contrast");
    assert.equal((await stored()).prefs.text, 200);
    assert.equal((await stored()).prefs.needs.length, 2);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
  },
);
await run(
  "Alerta HU-06: confirmación actualiza estado y ocupa ≥40 % de pantalla",
  async () => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await fixture("alerta");
      const box = await page.locator(".acknowledge").boundingBox();
      assert.ok(
        (box.width * box.height) / (width * (width === 390 ? 844 : 900)) >= 0.4,
      );
      await click("confirmAlert");
      assert.equal((await stored()).people[0].status, "evacuating");
      assert.equal(await page.locator(".acknowledge").isDisabled(), true);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  },
);
await run(
  "Síntesis de voz solicitada y transcripción / fallback visibles; vibración alternativa",
  async () => {
    await fixture("alerta");
    await click("speak");
    assert.match(
      await page.locator(".feedback").textContent(),
      /Instrucción|Voz/,
    );
    await click("vibrate");
    assert.match(
      await page.locator(".feedback").textContent(),
      /Vibración|háptico/,
    );
  },
);
await run(
  "Ruta sin escaleras, avance, bloqueo ascensores y recálculo",
  async () => {
    await fixture("ruta");
    await click("nextStep");
    assert.equal((await stored()).route.step, 3);
    await click("block");
    assert.equal((await stored()).route.blocked, true);
    assert.match(await page.locator("h1").textContent(), /recalculada/);
    await click("elevator");
    assert.match(await page.locator(".feedback").textContent(), /bloqueados/);
    assert.equal((await stored()).route.destination, "Refugio A");
  },
);
await run(
  "PPE: cambio de ritmo recalcula ETA y advertencia de margen",
  async () => {
    await fixture("ppe");
    await page.fill("#pace", "0.2");
    await page
      .getByRole("button", { name: "Confirmar silla manual y ritmo" })
      .click();
    assert.match(
      await page.locator("main").textContent(),
      /7 min.*Supera el margen/,
    );
  },
);
await run("SOS exitoso, fallo y reintento sin duplicación", async () => {
  await fixture("ruta");
  await click("sendSOS");
  await page.waitForURL("**/#/sos");
  assert.equal((await stored()).sos[0].status, "pending");
  await click("failSOS");
  assert.equal((await stored()).sos[0].status, "failed");
  await page
    .getByRole("button", { name: "Reintentar envío", exact: true })
    .click();
  await click("confirmSOS");
  assert.equal((await stored()).sos[0].status, "pending");
  assert.equal((await stored()).sos.length, 3);
});
await run(
  "Tarjeta ampliada, envío, gestos y ficha de brigada compartida",
  async () => {
    await fixture("comunicar");
    await page
      .getByRole("button", { name: "No puedo caminar", exact: true })
      .click();
    await page.locator("dialog").waitFor({ state: "visible" });
    assert.match(
      await page.locator(".enlarged-card").textContent(),
      /No puedo caminar/,
    );
    await click("sendCard");
    await click("gestures");
    assert.match((await stored()).people[0].channel, /señas/);
    await page.goto(base + "#/recorridos");
    await page
      .locator('[data-action="entry"][data-payload*="brigadista"]')
      .click();
    await expect(page.locator("h1")).toHaveText("Misiones de rescate");
    await click("openMission");
    await expect(page.locator("h1")).toHaveText("Rescate R-014");
    await expect(page.locator("main")).toContainText("No puedo caminar");
    await expect(page.locator("main")).toContainText("Evitar destellos");
  },
);
await run(
  "HU-43 consulta y retorno al manual pendiente sin instrucciones físicas",
  async () => {
    await fixture("mision", "brigadista");
    await page.getByRole("button", { name: "Consultar protocolo" }).click();
    await expect(page.locator("h1")).toHaveText("Manual de transferencia");
    await expect(page.locator("main")).toContainText(
      "No se ha incorporado un protocolo de transferencia validado",
    );
    await page.getByRole("button", { name: "Volver a la misión" }).click();
    await expect(page.locator("h1")).toHaveText("Rescate R-014");
  },
);
await run(
  "Chat con mensajes rápidos, texto, cola sin conexión y reintento",
  async () => {
    await fixture("chat");
    await page.getByRole("button", { name: "Estoy bien", exact: true }).click();
    await click("network");
    await page.fill("#message", "Necesito ayuda de prueba");
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    assert.equal((await stored()).messages[1].status, "pending");
    await click("network");
    await click("retryMessage");
    assert.equal((await stored()).messages[1].status, "sent");
    assert.equal((await stored()).messages.length, 2);
  },
);
await run(
  "Refugio lleno cambia alternativa a B; llegada única y contadores",
  async () => {
    await fixture("refugio");
    await click("refugeStatus");
    assert.equal((await stored()).selectedRefuge, "B");
    await page
      .getByRole("button", { name: "Confirmar llegada manualmente" })
      .click();
    await page
      .getByRole("button", { name: "Confirmar llegada manualmente" })
      .click();
    const s = await stored();
    assert.equal(
      s.people.filter((p) => p.refuge === "B" && p.status === "refuge").length,
      3,
    );
    assert.equal(s.people[0].status, "refuge");
  },
);
await run("Llegada segura con modal, protección de duplicados", async () => {
  await fixture("ruta");
  await click("safeDialog");
  await click("safeConfirm");
  await page.waitForURL("**/#/seguro");
  assert.equal(
    (await stored()).people.filter((p) => p.status === "safe").length,
    46,
  );
});
await run(
  "Administración: asignación y reasignación a Carla, datos consistentes",
  async () => {
    await fixture("asignar", "admin");
    await page
      .getByRole("button", { name: "Asignar a Luis Paredes", exact: true })
      .click();
    assert.equal((await stored()).sos[0].assigned, "B1");
    await click("reassign");
    assert.equal((await stored()).sos[0].assigned, "B2");
    await page.goto(base + "#/recorridos");
    await page
      .getByRole("button", { name: "Accesibilidad general", exact: true })
      .click();
    await page.goto(base + "#/asistencia");
    await expect(page.locator("h1")).toHaveText("Brigadista en camino");
    assert.match(await page.locator("main").textContent(), /Carla Núñez/);
    assert.match(await page.locator("main").textContent(), /Llega en 3 min/);
  },
);
await run(
  "Rescate individual: confirmación modal, dashboard y prevención de duplicados",
  async () => {
    await fixture("mision", "brigadista");
    await click("rescueDialog");
    await click("rescueConfirm");
    assert.equal(
      (await stored()).people.filter((p) => p.status === "safe").length,
      46,
    );
    assert.equal(
      await page.locator("[data-action=rescueDialog]").isDisabled(),
      true,
    );
    await page.goto(base + "#/recorridos");
    await page
      .getByRole("button", { name: "Administrador", exact: true })
      .click();
    assert.equal(await page.locator("[data-count=safe]").textContent(), "46");
  },
);
await run("Rescate múltiple de misiones reales seleccionadas", async () => {
  await fixture("misiones", "brigadista");
  await page.locator("[data-action=queueMission]").first().click();
  await page.goto(base + "#/masivo");
  await page.locator('[name="R-014"]').check();
  await page.locator('[name="R-015"]').check();
  await page
    .getByRole("button", { name: "Revisar rescates seleccionados" })
    .click();
  await click("rescueConfirm");
  assert.equal(
    (await stored()).people.filter((p) => p.status === "safe").length,
    47,
  );
  assert.equal(
    (await stored()).missions.filter((m) => m.status === "completed").length,
    2,
  );
});
await run(
  "Emisión sectorizada revisada antes de confirmar y estado compartido",
  async () => {
    await fixture("emitir", "admin");
    await page.getByRole("radio", { name: "Incendio", exact: true }).check();
    await page.getByRole("radio", { name: /Piso 2/ }).check();
    await page
      .getByRole("button", { name: "Confirmar y emitir alerta", exact: true })
      .click();
    assert.match(
      await page.locator("dialog").textContent(),
      /Incendio · Piso 2/,
    );
    await click("emitConfirm");
    assert.equal((await stored()).alert.scope, "Piso 2");
    assert.equal((await stored()).alert.event, "Incendio");
    assert.equal(await page.locator("dialog").isVisible(), false);
  },
);
await run(
  "Estado de refugios y alternativa actualizados desde administración",
  async () => {
    await fixture("zonas", "admin");
    await page
      .getByRole("button", { name: "Marcar En peligro", exact: true })
      .first()
      .click();
    assert.equal((await stored()).refuges[0].status, "En peligro");
    assert.equal((await stored()).selectedRefuge, "B");
  },
);
await run(
  "Sensor IoT manual resalta sector y abre emisión de alerta",
  async () => {
    await fixture("admin", "admin");
    await click("sensor");
    await page.waitForURL("**/#/evento");
    assert.equal((await stored()).sensors.length, 1);
    assert.equal(await page.locator(".room.hazard").count(), 1);
    await page
      .getByRole("button", { name: "Revisar y emitir alerta de incendio" })
      .click();
    assert.equal(
      await page.locator("[name=event]:checked").inputValue(),
      "Incendio",
    );
  },
);
await run(
  "Prioridad por falta de señal: persona al inicio y ficha legible",
  async () => {
    await fixture("solicitudes", "admin");
    await click("priority");
    assert.match(
      await page.locator("main section h2").first().textContent(),
      /Prioridad 1.*María/,
    );
  },
);
await run(
  "Brigadista: reasignación de sector con teclado y disponibilidad",
  async () => {
    await fixture("brigadas", "admin");
    await page.selectOption("#sector-B1", "Sur");
    await page
      .getByRole("button", { name: "Actualizar sector de Luis Paredes" })
      .click();
    assert.equal((await stored()).brigadiers[0].sector, "Sur");
    await click("disconnect");
    assert.equal((await stored()).brigadiers[3].status, "available");
  },
);
await run(
  "Sector despejado exige gesto y confirmación; alternativa de teclado",
  async () => {
    await fixture("sector", "brigadista", (s) => {
      for (const r of s.sos) {
        if (!s.missions.some((m) => m.id === r.id))
          s = transition(s, "assign", {
            requestId: r.id,
            brigadierId: "B1",
            queue: true,
          }).state;
        s = transition(s, "rescue", { ids: [r.id] }).state;
      }
      return transition(s, "sectorArrival", { sector: "Norte", confirm: true })
        .state;
    });
    await page
      .getByRole("button", { name: "Confirmar despeje del sector" })
      .click();
    assert.equal((await stored()).sectors[0].cleared, false);
    await page.locator("#clear-slider").focus();
    await page.keyboard.press("End");
    await page.locator("[name=verified]").check();
    await page
      .getByRole("button", { name: "Confirmar despeje del sector" })
      .click();
    assert.equal((await stored()).sectors[0].cleared, true);
    assert.match(
      await page.locator(".feedback").textContent(),
      /Sector despejado/,
    );
  },
);
await run(
  "Paquete externo: preparación simulada, cierre, expiración y reporte",
  async () => {
    await fixture("externos", "admin");
    await click("external");
    assert.match((await stored()).external.status, /Preparado/);
    await page.goto(base + "#/reporte");
    await click("closeDialog");
    await click("closeConfirm");
    assert.equal((await stored()).external.status, "Expirado");
    assert.match(await page.locator("main").textContent(), /Expirado/);
  },
);
await run(
  "Descarga CSV genera archivo no vacío con personas y auditoría",
  async () => {
    await fixture("reporte", "admin");
    const download = page.waitForEvent("download");
    await click("csv");
    const file = await download;
    await file.saveAs("docs/evidencias/reporte-prueba.csv");
    const data = await fs.readFile(
      "docs/evidencias/reporte-prueba.csv",
      "utf8",
    );
    assert.match(data, /María López/);
    assert.match(data, /P65/);
    assert.ok(data.length > 1000);
  },
);
await run(
  "Reporte imprimible genera PDF real con el motor de Chrome",
  async () => {
    await fixture("reporte", "admin");
    await page.evaluate(() => {
      window.print = () => {
        window.__printRequested = true;
      };
    });
    await click("print");
    assert.equal(await page.evaluate(() => window.__printRequested), true);
    const pdf = await page.pdf({
      path: "docs/evidencias/reporte-impresion.pdf",
      format: "A4",
      printBackground: true,
    });
    assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  },
);
await run("Registro visitante QR: formulario validado y censo 66", async () => {
  await fixture("qr", "visitante");
  await page
    .getByRole("button", { name: "Abrir registro de visitantes" })
    .click();
  await page.getByRole("button", { name: "Registrar ingreso" }).click();
  await page.waitForURL("**/#/visita-ok");
  assert.equal((await stored()).people.length, 66);
});
await run(
  "Navegación móvil, foco de teclado, modal Escape y reinicio",
  async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await fixture("ruta");
    await page.getByRole("button", { name: "Menú", exact: true }).click();
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "false",
    );
    await click("safeDialog");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").isVisible(), false);
    await click("resetDialog");
    await click("resetConfirm");
    assert.equal((await stored()).people.length, 65);
    await page.waitForURL("**/#/recorridos");
  },
);
const screens = [
  ["acceso", "usuario", "2-67", "2-79"],
  ["perfil", "usuario", "2-91", "2-103"],
  ["alerta", "usuario", "2-235", "2-247"],
  ["contraste", "usuario", "2-259", "2-271"],
  ["ppe", "usuario", "2-187", "2-199"],
  ["ruta", "usuario", "2-307", "2-319"],
  ["mapa", "usuario", "2-331", "2-343"],
  ["sos", "usuario", "2-499", "2-511"],
  ["comunicar", "usuario", "2-571", "2-583"],
  ["misiones", "brigadista", "2-883", "2-895"],
  ["mision", "brigadista", "2-907", "2-919"],
  ["admin", "admin", "2-1147", "2-1159"],
  ["emitir", "admin", "2-1195", "2-1207"],
  ["solicitudes", "admin", "2-1267", "2-1279"],
  ["censo", "admin", "2-1435", "2-1447"],
  ["qr", "visitante", "2-1459", "2-1471"],
  ["visitante", "visitante", "2-1483", "2-1495"],
];
const visual = [],
  axe = [];
await run(
  "16 interfaces × Desktop / Mobile: capturas, overflow y auditoría axe",
  async () => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      for (const [v, role, d, m] of screens) {
        await fixture(v === "contraste" ? "alerta" : v, role, (s) => {
          if (v === "contraste") s.prefs.contrast = true;
          if (v === "solicitudes") s.people[0].priority = true;
          if (v === "admin") s = transition(s, "block").state;
          return s;
        });
        const path = `docs/evidencias/${v}-${width}.png`;
        await page.screenshot({ path });
        const overflow = await page.evaluate(() =>
          [...document.querySelectorAll("body *")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                (r.right > innerWidth + 1 || r.left < -1) &&
                !e.closest(".sr-only") &&
                !e.classList.contains("skip")
              );
            })
            .map((e) => ({
              tag: e.tagName,
              cls: e.className,
              right: e.getBoundingClientRect().right,
            })),
        );
        visual.push({
          view: v,
          width,
          path,
          reference: `docs/figma/${width === 1440 ? d : m}.png`,
          overflow,
        });
        const analysis = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        if (analysis.violations.length)
          axe.push({
            view: v,
            width,
            violations: analysis.violations.map((x) => ({
              id: x.id,
              impact: x.impact,
              description: x.description,
              nodes: x.nodes.map((n) => n.target),
            })),
          });
      }
    }
    assert.equal(
      visual.filter((x) => x.overflow.length).length,
      0,
      JSON.stringify(visual.filter((x) => x.overflow.length)),
    );
    assert.equal(axe.length, 0, JSON.stringify(axe));
  },
);
await run(
  "390, 768, 1024, 1440: landing y dashboards sin overflow",
  async () => {
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [v, role] of [
        ["landing", "usuario"],
        ["admin", "admin"],
      ]) {
        await fixture(v, role);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.screenshot({
          path: `docs/evidencias/${v}-${width}-responsive.png`,
          fullPage: v === "landing",
        });
      }
    }
  },
);
await run(
  "Texto al 200 %: 17 interfaces a 390 y 1440 px sin desbordamiento de página",
  async () => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [v, role] of screens) {
        await fixture(v === "contraste" ? "alerta" : v, role, (s) => {
          s.prefs.text = 200;
          return s;
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          v,
        );
        assert.equal(
          await page.evaluate(
            () =>
              document.querySelector(".scroll-area").scrollWidth <=
              document.querySelector(".scroll-area").clientWidth,
          ),
          true,
          v,
        );
      }
      await fixture("mapa", "usuario", (s) => {
        s.prefs.text = 200;
        return s;
      });
      await page.screenshot({
        path: `docs/evidencias/mapa-texto200-${width}.png`,
      });
    }
  },
);
await run(
  "Recursos locales: funciona bloqueando dominios externos",
  async () => {
    await page.route("**/*", (route) =>
      route.request().url().startsWith(base) ? route.continue() : route.abort(),
    );
    await fixture("ruta");
    assert.equal(await page.locator("h1").textContent(), "Sigue de frente");
    assert.equal(
      await page
        .locator(".direction img")
        .evaluate((i) => i.complete && i.naturalWidth > 0),
      true,
    );
    await page.unroute("**/*");
  },
);
await run(
  "Sin errores JavaScript ni recursos ausentes en las rutas ejercitadas",
  async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(failedResources, []);
  },
);
await fs.writeFile(
  "docs/evidencias/qa-browser.json",
  JSON.stringify(
    {
      date: new Date().toISOString(),
      browser: await browser.version(),
      results,
      errors,
      failedResources,
      visual,
      axe,
    },
    null,
    2,
  ),
);
await browser.close();
if (results.some((r) => r.status === "FALLÓ")) process.exitCode = 1;
