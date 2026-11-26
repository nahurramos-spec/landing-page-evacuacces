import { esc, btn } from "./ui.js";
import { occupancy } from "./state.js";
export function map(s) {
  const refuge = (id) => {
    const r = s.refuges.find((x) => x.id === id);
    return `<div class="room refuge ${r.status === "En peligro" ? "hazard" : ""}"><b>Refugio ${id}</b><span class="${r.status === "Disponible" ? "safe-text" : "danger-text"}">${occupancy(s, id)}/${r.capacity}</span></div>`;
  };
  const room = (n, txt = "Libre") =>
    `<div class="room ${s.sectors[0].hazard && n === 204 ? "hazard" : ""}"><b>Aula ${n}</b><span class="${txt === "SOS" ? "danger-text" : "muted"}">${esc(txt)}</span></div>`;
  return `<section class="map" data-hu="HU-32" aria-label="Plano de Edificio B, Piso 2"><h2>Plano operativo · Piso 2</h2><p class="map-note">Edificio B · Posiciones simuladas</p><div class="floorplan">${room(201)}${refuge("A")}${room(203)}${room(204, s.people[0].status === "safe" ? "A salvo" : "SOS")}<div class="hall"><span class="exit">Salida ←</span><span class="exit right">→ Salida</span><div class="route-line"></div><button type="button" class="marker b" data-action="marker" data-payload='{"type":"brigade"}' aria-label="B: brigadista, consultar asignación">B</button><button type="button" class="marker u" data-action="marker" data-payload='{"type":"person"}' aria-label="U: persona con discapacidad visual, consultar ficha">U</button>${s.people[0].status !== "safe" ? `<button type="button" class="marker s" data-action="marker" data-payload='{"type":"sos"}' aria-label="SOS: María López, necesidades auditiva y motora">!</button>` : ""}${s.route.blocked ? '<span class="elevator" aria-label="Ascensores bloqueados">×</span>' : ""}</div>${room(205)}${refuge("B")}${room(207)}${room(208)}</div><p class="map-legend"><span class="desktop-text">U Persona con necesidad de asistencia &nbsp; B Brigadista &nbsp; ! SOS activo &nbsp; — Ruta habilitada</span><span class="mobile-text">U Usuario · B Brigada · ! SOS</span></p>${s.sectors[0].hazard ? '<p class="danger-text"><strong>Incendio · Piso 2 · Sector norte</strong></p>' : ""}</section>`;
}
