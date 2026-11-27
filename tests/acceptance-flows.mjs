import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { expect } from "@playwright/test";
import { launchBrowser } from "./browser-config.mjs";
import { STORAGE_KEY } from "../js/state.js";

const base = process.env.BASE_URL || "http://127.0.0.1:4173/";
const before = process.argv.includes("--before");
const directory = process.env.EVIDENCE_DIR || "docs/evidencias/ci/aceptacion";
await fs.mkdir(directory, {recursive:true});
const browser = await launchBrowser();
try {
  for (const width of [1440,390]) {
    const mobile = width === 390;
    const entry = async index => {
      const page = await browser.newPage({viewport:{width,height:mobile?844:900},hasTouch:mobile});
      await page.goto(new URL("#landing",base).href);
      await page.getByRole("link",{name:"Iniciar EvacuAccess",exact:true}).first().click();
      await page.locator(".proto-list button").nth(index).click();
      await page.locator(".app-header").waitFor();
      return page;
    };
    const button = (p,name) => p.getByRole("button",{name}).first();
    const state = p => p.evaluate(key=>JSON.parse(localStorage.getItem(key)),STORAGE_KEY);
    const capture = async (p,name) => {
      await p.evaluate(()=>document.fonts.ready);
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name);
      await p.screenshot({path:directory+"/"+width+"-"+name+".png"});
    };
    for(let index=0;index<7;index++) {
      const p=await entry(index);
      assert.equal(new URL(p.url()).hash,["#/acceso","#/alerta","#/alerta","#/ppe","#/misiones","#/admin","#/qr"][index]);
      await p.close();
    }
    let p=await entry(4);
    await p.locator('[data-action="openMission"]').first().click();
    await p.locator('[data-action="rescueDialog"]').click();
    const initial=await state(p);
    await button(p,/Cancelar/).click();
    assert.deepEqual((await state(p)).missions,initial.missions);
    await p.locator('[data-action="rescueDialog"]').click();
    if(before) await p.locator('[data-action="rescueConfirm"]').click();
    else await button(p,/Sí, registrar rescate/).dblclick();
    await expect.poll(async()=>(await state(p)).events.filter(e=>e.action==="rescue").length).toBe(1);
    if(!before) {
      await expect(p.locator("h1")).toHaveText("Rescate registrado");
      await expect(p.locator("main")).toContainText("R-014");
      await expect(p.locator("main")).toContainText("María López");
    }
    console.log(width,"rescate",new URL(p.url()).hash);
    await capture(p,"rescate"); await p.close();
    p=await entry(5);
    await button(p,/Emitir alerta global/).click();
    await p.locator('[value="Incendio"]').check();
    await p.locator('[value="Piso 2"]').check();
    await button(p,/Confirmar y emitir/).click();
    await expect(p.locator(before?"dialog":"main")).toContainText("Piso 2");
    if(!before){
      await button(p,"Volver a editar").click();
      await expect(p.locator('[value="Incendio"]')).toBeChecked();
      await expect(p.locator('[value="Piso 2"]')).toBeChecked();
      await button(p,/Confirmar y emitir/).click();
    }
    await button(p,before?/^Confirmar emisión$/:/Confirmar emisión simulada/).click();
    if(!before){
      await expect(p.locator("h1")).toHaveText("Alerta emitida");
      for(const value of ["Incendio","Piso 2"])await expect(p.locator("main")).toContainText(value);
    }
    console.log(width,"emisión",new URL(p.url()).hash);
    await capture(p,"emision"); await p.close();
    p=await entry(1);
    const contrast=await p.getByRole("button",{name:"Activar alto contraste",exact:true}).count();
    await p.locator(".acknowledge").click();
    if(before)await button(p,/Continuar ruta accesible/).click();
    await expect(p.locator("h1")).toHaveText("Sigue de frente");
    if(!before)await capture(p,"ruta-confirmada");
    const voice=p.getByRole("button",{name:/Repetir instrucci/});
    console.log(width,"contraste",contrast,"voz",await voice.count());
    if(!before){
      assert.equal(contrast,1);await expect(voice).toHaveCount(1);
      assert.equal((await state(p)).people[0].status,"evacuating");
      await expect(p.locator("#announcer")).toContainText("Evacuando");
      await voice.click();
    }
    await capture(p,"ruta");
    if(mobile)await button(p,"Menú").click();
    await p.getByRole("link",{name:"Mi historial"}).click();
    await p.locator('[data-view="historial"]').waitFor();
    console.log(width,"simulacros",await p.locator('[data-action="drill"]').count());
    if(!before){
      await capture(p,"historial-inicial");
      const entries=p.locator('[data-action="drill"]');await expect(entries).toHaveCount(5);
      for(const item of await entries.all()){await item.click();await expect(item).toHaveAttribute("aria-pressed","true");}
      await button(p,"29 de septiembre · 3 min 12 s · Rampa Sur").click();
      await button(p,/Consultar detención/).click();
      await expect(p.locator("#drill-detail")).toContainText("45 segundos");
      await expect(p.locator("main")).toContainText("Historial local");
    }
    await capture(p,"historial");await p.close();
    p=await entry(3);const more=button(p,"Añadir más acompañantes");
    console.log(width,"añadir",await more.count());
    if(!before){
      await capture(p,"ppe-inicial");
      await more.click();await more.focus();await p.keyboard.press("Enter");if(mobile)await more.tap();
      await expect(p.locator("#announcer")).toHaveText("Límite alcanzado: Puede registrar un máximo de 2 acompañantes directos");
      await expect(p.locator("main")).toContainText("2 de 2");
      for (const name of ["Lucía Ramos","Diego López"]) await expect(p.locator("main")).toContainText(name);
    }
    await capture(p,"ppe");await p.close();
    p=await entry(0);await button(p,/Usuario · María/).click();
    const size=p.locator("#text-size");console.log(width,"tamaño",await size.evaluate(e=>e.type));
    if(!before){
      await capture(p,"perfil-inicial");
      await size.focus();await p.keyboard.press("Home");
      for(const value of ["150","200"]){await p.keyboard.press("ArrowRight");await expect(size).toHaveValue(value);}
      await button(p,"Guardar preferencias").click();
      assert.equal((await state(p)).prefs.text,200);
      await p.goto(new URL("#landing",base).href);
      await p.getByRole("link",{name:"Iniciar EvacuAccess",exact:true}).first().click();
      await p.locator(".proto-list button").first().click();
      await button(p,/Usuario · María/).click();await expect(size).toHaveValue("200");
      await button(p,"Guardar preferencias").scrollIntoViewIfNeeded();
      await expect(button(p,"Guardar preferencias")).toBeInViewport();
      await button(p,"Guardar preferencias").click();
    }
    await capture(p,"perfil");
    if (!before) for (const view of ["rescate","rescatado","emitir_confirm","emitida"]) {
      await p.goto(new URL("#/"+view,base).href);
      await expect(p.locator("h1")).toHaveText("Acceso restringido");
    }
    await p.close();
  }
} finally {await browser.close();}
