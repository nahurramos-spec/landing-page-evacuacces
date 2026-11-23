export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const btn = (
  action,
  label,
  { kind = "", hu = "", payload = {}, disabled = false } = {},
) =>
  `<button type="button" class="btn ${kind}" data-action="${esc(action)}" data-payload="${esc(JSON.stringify(payload))}" ${hu ? `data-hu="${hu}"` : ""} ${disabled ? "disabled" : ""}>${label}</button>`;
export const go = (view, label, kind = "outline", hu = "") =>
  btn("navigate", label, { kind, hu, payload: { view } });
export const panel = (title, body, kind = "", hu = "") =>
  `<section class="panel ${kind}" ${hu ? `data-hu="${hu}"` : ""}><h2>${esc(title)}</h2>${body}</section>`;
export const icon = (name, alt = "", cls = "") =>
  `<img class="icon ${cls}" src="assets/icons/${name}.svg" alt="${esc(alt)}">`;
export const note = (t) => `<p class="small-copy muted">${t}</p>`;
export const environmentNotice = () =>
  '<p class="environment-notice" role="note">Entorno de prueba · Servicios de emergencia no conectados</p>';
export const controls = (id, body) =>
  `<details class="scenario-controls" data-panel="${esc(id)}"><summary>Controles de prueba</summary><div class="stack">${body}</div></details>`;
// Conserva los registros anteriores; adapta únicamente su presentación.
export const productText = (value) =>
  String(value ?? "")
    .replaceAll("Preparado · Demostración", "Preparado · Sin enviar")
    .replace(/prototipo académico/gi, "entorno de prueba")
    .replace(/demostración/gi, "prueba")
    .replace(/simulad[oa]s?/gi, "de prueba");
export const check = (name, label, checked = false) =>
  `<label class="check"><input type="checkbox" name="${name}" ${checked ? "checked" : ""}>${esc(label)}</label>`;
export const entries = [
  ["general", "Accesibilidad general", "usuario", "acceso"],
  ["auditiva", "Discapacidad auditiva", "usuario", "alerta"],
  ["visual", "Discapacidad visual", "usuario", "alerta"],
  ["movilidad", "Movilidad reducida", "usuario", "ppe"],
  ["brigadista", "Brigadista", "brigadista", "misiones"],
  ["admin", "Administrador", "admin", "admin"],
  ["visitante", "Visitante", "visitante", "qr"],
];
export const entryButtons = () =>
  entries
    .map(([entry, label, role, view]) =>
      btn("entry", esc(label), { payload: { entry, role, view } }),
    )
    .join("");
export const brigadeLabels = {
  available: "Disponible",
  mission: "En misión",
  offline: "Desconectado >30 s",
};
export const requestLabels = {
  pending: "Pendiente",
  failed: "Fallo de envío",
  assigned: "Asignada",
  rescued: "Rescate registrado",
};
export const missionLabels = {
  assigned: "Asignada",
  accepted: "Aceptada · En camino",
  completed: "Rescate registrado",
};
