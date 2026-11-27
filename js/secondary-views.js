import { screenStates, relatedActions } from "./screen-states.js";
import { btn, esc, panel } from "./ui.js";
import { map } from "./map.js";

const compact = matchMedia("(max-width: 600px)");
export const onLayoutChange = callback => compact.addEventListener("change", callback);

function action(node, view) {
  const label = esc(node.label);
  if (node.target === "sos") return btn("sendSOS", label, { kind: "danger" });
  if (view === "voz" && !node.target) return btn("speak", label);
  if (!node.target && /cancelar|volver/i.test(node.label))
    return btn("returnScreen", label, { kind: "outline" });
  if (!node.target) return btn("navigate", label, { kind: "outline", disabled: true });
  return btn("screenAction", label, { payload: { target: node.target, label: node.label } });
}

function block(node, view) {
  if (node.label) return action(node, view);
  if (node.text !== undefined) {
    const tag = node.bold && node.size >= 20 ? "h2" : "p";
    return `<${tag} class="screen-copy" style="font-size:${node.size / 16}rem">${esc(node.text)}</${tag}>`;
  }
  const surface = node.bg ? `--screen-fill:${node.bg};` : "";
  return `<div class="screen-group${node.row ? " horizontal" : ""}${node.bg ? " surface" : ""}" style="${surface}padding:${node.pad}px;gap:${node.gap}px">${node.kids.map(child => block(child, view)).join("")}</div>`;
}

export function secondaryView(view, state, review = {}) {
  if (!Object.hasOwn(screenStates, view)) return null;
  const variants = screenStates[view];
  const nodes = (compact.matches && variants.mobile) || variants.desktop || variants.mobile;
  const [crumb, heading, ...content] = nodes;
  const role = crumb.text?.split(" · ")[0];
  const required = { Administrador: "admin", Brigadista: "brigadista", Visitante: "visitante" }[role];
  if (required && state.role !== required)
    return { title: "Acceso restringido", body: action({label:"Seleccionar recorrido",target:"recorridos"},view) };
  if (view === "rescate") {
    const mission = state.missions.find(m => m.id === review.rescueReview?.ids?.[0]);
    const person = state.people.find(p => p.id === mission?.personId);
    return {title:heading.text, breadcrumb:esc(crumb.text), body:
      panel("Confirmar rescate", (mission && person
        ? "<p>" + esc(person.name) + " · " + esc(mission.id) + "</p><p>Confirma solo cuando la persona esté en una zona segura.</p>"
        + btn("rescueConfirm", "Sí, registrar rescate", {kind:"success", disabled:mission.status === "completed"})
        : "<p>Selecciona una misión activa para confirmar el rescate.</p>")
        + btn("returnScreen","Cancelar · Volver a la misión",{kind:"outline"}))
      + action({label:"Ver selección de rescate múltiple", target:"masivo"},view)};
  }
  if (view === "emitir_confirm") {
    const draft = review.alertReview;
    return {title:heading.text, breadcrumb:esc(crumb.text), body:
      panel("Revisar antes de emitir", (draft
        ? "<p>" + esc(draft.event) + " · " + esc(draft.scope) + "</p><p>La alerta se registrará en esta sesión. No se transmitirá a dispositivos ni a servicios reales.</p>"
        + btn("emitConfirm","Confirmar emisión simulada")
        : "<p>Selecciona un evento y su alcance antes de confirmar.</p>")
        + btn("returnScreen","Volver a editar",{kind:"outline"}))};
  }
  const recordedAction = Object.keys(confirmation).find(key => confirmation[key] === view)
    || ({ reasignada:"assign", censo_actualizado:"visitor" })[view];
  let body;
  if (recordedAction) {
    const event = state.events.findLast(item => item.action === recordedAction);
    body = panel(view === "emitida" ? "Alerta emitida · Demostración" : view === "rescatado" && event?.missions ? "Rescate registrado · " + event.missions.join(", ") : "Registro de esta sesión", event
      ? `<p>${esc(event.detail)}</p><p>${esc(new Date(event.at).toLocaleString("es-PE"))}</p>`
      : "<p>Todavía no hay un registro de esta operación.</p>", event && ["emitida","rescatado"].includes(view) ? "success-panel" : "")
      + content.filter(node => node.label).map((node,index) => btn("screenAction", esc(node.label), {kind:index ? "outline" : "", payload:{target:node.target,label:node.label}})).join("");
    if (view === "emitida" && event?.scope) body += `<strong>${esc(event.event)}</strong><p>${esc(event.scope)} · Sin confirmación de recepción en otros dispositivos.</p>`;
  } else {
    body = content.map(node => block(node, view)).join("");
  }
  const icons = { voz:["volume",64], bloqueo:["warning",48], lleno:["warning",56], mensaje_ok:["imgFrame2-499",56] };
  if (icons[view]) {
    const [asset, size] = icons[view];
    body = `<img src="assets/icons/${asset}.svg" width="${size}" height="${size}" alt="">` + body;
  }
  return { title: heading.text || crumb.text, breadcrumb: esc(crumb.text), body: view === "offline" ? map(state) + body : body };
}

// Las confirmaciones de operaciones reales se ofrecen después de validar la transición.
const confirmation = {
  rescue: "rescatado", clearSector: "sector-despejado", emit: "emitida",
  assign: "asignacion", refugeStatus: "estado-de-refugio-actualizado",
  sectorAssign: "sector_asignado", card: "mensaje_ok", visitorSafe: "salida_visita",
};
export function followupActions(view, lastAction) {
  const result = confirmation[lastAction];
  const reserved = new Set([...Object.values(confirmation), "mensaje_ok", "visita_inicio"]);
  const owned = { alerta:["contraste"], ruta:["voz"], perfil:["texto200","contraste"] };
  const options = (relatedActions[view] || []).filter(item => !reserved.has(item.target) && !owned[view]?.includes(item.target));
  if (result && result !== view) options.unshift({ label: "Ver confirmación", target: result });
  return options.map(item => action(item, view)).join("");
}
