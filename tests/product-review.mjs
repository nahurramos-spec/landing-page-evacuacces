import { launchBrowser } from "./browser-config.mjs";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { initialState, transition, STORAGE_KEY } from "../js/state.js";
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const browser = await launchBrowser();
const context = await browser.newContext({ reducedMotion: "reduce" }),
  page = await context.newPage(),
  results = [],
  screens = [],
  errors = [],
  externalRequests = [];
page.setDefaultTimeout(6000);
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    externalRequests.push(r.url());
});
const directory = "docs/evidencias/revision-producto";
await fs.mkdir(directory, { recursive: true });
async function fixture(view, role = "usuario", modify) {
  let s = initialState();
  s.role = role;
  if (role === "brigadista")
    s = transition(s, "entry", { role, entry: "brigadista" }).state;
  if (modify) s = modify(s);
  await page.goto(base);
  await page.evaluate(
    ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
    { key: STORAGE_KEY, state: s },
  );
  await page.goto(base + (view === "landing" ? "#landing" : `#/${view}`));
  await page.reload();
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
const state = () =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)), STORAGE_KEY);
async function run(name, fn) {
  try {
    await fn();
    results.push({ name, status: "APROBADA" });
    console.log("OK", name);
  } catch (e) {
    results.push({ name, status: "FALLÓ", detail: e.message });
    console.log("FAIL", name, e.message);
  }
}
await run(
  "SOS: aviso previo, cancelar sin registrar y confirmación local sin envío externo",
  async () => {
    await fixture("ruta");
    await page.locator("[data-action=sendSOS]").click();
    await expect(page.locator("dialog")).toContainText(
      "No se enviará a brigadistas ni a servicios de emergencia reales",
    );
    assert.equal((await state()).sos[0].sentAt, undefined);
    await page.keyboard.press("Escape");
    assert.equal((await state()).sos[0].sentAt, undefined);
    await page.locator("[data-action=sendSOS]").click();
    await page.locator("[data-action=confirmSOS]").click();
    await expect(page.locator("h1")).toHaveText("Solicitud SOS registrada");
    assert.ok((await state()).sos[0].sentAt);
    await page
      .getByRole("button", { name: "Consultar brigadista asignado" })
      .click();
    await expect(page.locator("h1")).toHaveText("Estado de la asistencia");
  },
);
await run(
  "Emisión: el alcance no se aplica antes de confirmar y se informa que no hay transmisión",
  async () => {
    await fixture("emitir", "admin");
    await page.getByRole("radio", { name: "Incendio", exact: true }).check();
    await page
      .getByRole("button", { name: "Confirmar y emitir alerta", exact: true })
      .click();
    await expect(page.locator("dialog")).toContainText(
      "No se transmitirá a dispositivos ni a servicios reales",
    );
    assert.equal((await state()).alert.event, "Sismo");
    await page.locator("[data-action=emitConfirm]").click();
    assert.equal((await state()).alert.event, "Incendio");
    await expect(page.locator(".feedback")).toContainText(
      "sin transmisión real",
    );
  },
);
await run(
  "Solicitudes: la tarjeta secundaria conserva la selección y asignación de R-015",
  async () => {
    await fixture("solicitudes", "admin");
    await page.locator(".request-card").first().click();
    await expect(page.locator("h1")).toHaveText("Asignar brigadista");
    assert.equal((await state()).selectedRequest, "R-015");
    await page
      .getByRole("button", { name: "Asignar a Luis Paredes", exact: true })
      .click();
    assert.equal(
      (await state()).sos.find((r) => r.id === "R-015").assigned,
      "B1",
    );
  },
);
await run(
  "Equipo: no se publican fichas vacías ni se inventan integrantes",
  async () => {
    await fixture("landing");
    assert.equal(await page.locator(".team-card").count(), 0);
    assert.equal(await page.locator('a[href="#equipo"]').count(), 0);
    assert.doesNotMatch(
      await page.locator("body").innerText(),
      /Nombre pendiente|Rol pendiente|Ficha pendiente/,
    );
  },
);
await run(
  "Registros anteriores: presentación natural sin borrar el historial ni alterar sus datos",
  async () => {
    await fixture("reporte", "admin", (s) => {
      s.external = {
        status: "Preparado · Demostración",
        event: "Sismo",
        sector: "Edificio B",
        summary: { risk: 3, evacuating: 12, refuge: 5, safe: 45 },
      };
      s.events = [
        {
          id: 1,
          action: "message",
          actor: "usuario",
          at: Date.now(),
          detail: "Mensaje de demostración simulado",
        },
      ];
      return s;
    });
    assert.doesNotMatch(
      await page.locator("main").innerText(),
      /demostración|simulado/i,
    );
    assert.equal(
      (await state()).events[0].detail,
      "Mensaje de demostración simulado",
    );
  },
);
const priorities = [
  ["sos", "usuario"],
  ["solicitudes", "admin"],
  ["visitante", "visitante"],
  ["mision", "brigadista"],
  ["admin", "admin"],
  ["landing", "usuario"],
];
await run(
  "Seis pantallas prioritarias: 390, 768, 1024 y 1440 px, aviso visible, sin overflow ni infracciones axe",
  async () => {
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const [view, role] of priorities) {
        await fixture(view, role, (s) => {
          if (view === "solicitudes") s.people[0].priority = true;
          if (view === "admin") s = transition(s, "block").state;
          return s;
        });
        await expect(page.locator(".environment-notice")).toBeVisible();
        await expect(page.locator(".environment-notice")).toHaveText(
          "Entorno de prueba · Servicios de emergencia no conectados",
        );
        const copy = await page.locator("body").innerText();
        assert.doesNotMatch(
          copy,
          /prototipo académico|demostración|simulad[oa]|Nombre pendiente|Rol pendiente|Ficha pendiente/i,
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `${view} ${width}`,
        );
        if (view !== "landing")
          assert.equal(
            await page
              .locator(".scroll-area")
              .evaluate((e) => e.scrollWidth <= e.clientWidth),
            true,
            view,
          );
        if (view === "sos") {
          const geometry = await page.locator(".content>.icon").boundingBox();
          assert.equal(geometry.width, 56);
          assert.equal(geometry.height, 56);
          await expect(
            page.getByRole("button", { name: "Consultar brigadista asignado" }),
          ).toBeInViewport();
        }
        if (view === "visitante") {
          await expect(
            page.getByRole("button", {
              name: "Registrar ingreso",
              exact: true,
            }),
          ).toBeInViewport();
          const button=await page.getByRole("button",{name:"Registrar ingreso",exact:true}).boundingBox();
          const area=await page.locator(".scroll-area").boundingBox();
          assert.ok(button.y+button.height<=area.y+area.height+1,`Registrar ingreso oculto por acciones persistentes a ${width} px`);
        }
        if (view === "landing")
          await expect(page.locator(".landing-header a.btn")).toBeVisible();
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations));
        const file = `${directory}/${view}-${width}.png`;
        await page.screenshot({ path: file, fullPage: view === "landing" });
        screens.push({
          view,
          width,
          file,
          axeViolations: axe.violations.length,
          fixture:
            view === "solicitudes"
              ? "Prioridad activa"
              : view === "admin"
                ? "Ascensores bloqueados"
                : "Estado inicial",
        });
      }
    }
  },
);
await run(
  "Sin errores de JavaScript ni solicitudes a servicios externos",
  async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
  },
);
await fs.writeFile(
  `${directory}/qa-producto.json`,
  JSON.stringify(
    {
      date: new Date().toISOString(),
      results,
      screens,
      errors,
      externalRequests,
    },
    null,
    2,
  ),
);
await browser.close();
if (results.some((r) => r.status === "FALLÓ")) process.exitCode = 1;
