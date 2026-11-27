import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { launchBrowser } from "./browser-config.mjs";
import { initialState, transition, STORAGE_KEY } from "../js/state.js";
import { screenStates } from "../js/screen-states.js";

const routes = "acceso perfil inicio ppe alerta contraste voz ruta mapa bloqueo desvio detalles offline obstaculo sos asistencia comunicar no-puedo-caminar mensaje_ok chat chat_fallo refugio lleno salida seguro falsa historial dispositivos texto200 misiones mision protocolo rescate rescatado sector sector-despejado observaciones ptt canal-de-voz-simulado admin evento emitir emitir_confirm emitida solicitudes asignar asignacion zonas estado-de-refugio-actualizado brigadas censo qr visitante salida_visita cerrar reporte exportado roles denegado externos revocado masivo reasignada sector_asignado censo_actualizado visitante_seleccion visita-ok observaciones_admin mapa-brigada ptt_admin transmision-del-centro-de-control".split(" ");
const base = process.env.BASE_URL || "http://127.0.0.1:4173/";
const browser = await launchBrowser();
try {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => new URL(route.request().url()).origin === new URL(base).origin
      ? route.continue() : route.abort());
    await page.goto(base);
    assert.match(await page.locator(".landing-footer").innerText(), /© \d{4} Grupo 3 · EvacuAccess\. Todos los derechos reservados/);
    await page.getByRole("link", { name:"Iniciar EvacuAccess", exact:true }).first().click();
    await page.waitForURL("**/#/recorridos");
    await expect(page.locator(".proto-list button")).toHaveCount(7);
    for (const route of routes) {
      const breadcrumb = screenStates[route]?.desktop?.[0]?.text || "";
      const admin = "admin emitir solicitudes asignar zonas brigadas censo roles evento externos reporte".split(" ");
      const brigade = "misiones mision observaciones protocolo masivo sector mapa-brigada".split(" ");
      const role = admin.includes(route) || breadcrumb.startsWith("Administrador") ? "admin"
        : brigade.includes(route) || breadcrumb.startsWith("Brigadista") ? "brigadista"
        : /visit|^qr$/.test(route) || breadcrumb.startsWith("Visitante") ? "visitante" : "usuario";
      const state = transition(initialState(), "entry", { entry: role === "usuario" ? "general" : role, role }).state;
      await page.evaluate(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
      await page.goto(new URL("#/" + route, base).href);
      await page.reload();
      const title = await page.locator("h1").innerText();
      assert.ok(title.trim() && !/Vista no encontrada|Acceso restringido/.test(title), route + ": " + title);
      assert.equal(await page.locator("iframe").count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route);
    }
    assert.deepEqual(errors, []);
    console.log(width + " px: " + routes.length + " vistas locales, sin iframe ni desbordamiento horizontal");
    await page.close();
  }
} finally {
  await browser.close();
}
