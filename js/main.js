import {
  initialState,
  loadState,
  saveState,
  transition,
  counts,
  eta,
  reportCSV,
} from "./state.js";
import {
  esc,
  btn,
  go,
  panel,
  entries,
  entryButtons,
  environmentNotice,
} from "./ui.js";
import { landing } from "./landing.js";
import { secondaryView, followupActions, onLayoutChange } from "./secondary-views.js";

import { drills, userView, cards, cardIcon } from "./evacuation.js";
import { adminView } from "./administration.js";
import { brigadeView } from "./brigadier.js";
let lastAction = "";
let rescueReview = null;
let alertReview = null;
let state = loadState(),
  view = "",
  feedback = "",
  isError = false,
  lastFocus = null,
  visitorKey = crypto.randomUUID();
const root = document.querySelector("#root"),
  dialog = document.querySelector("#dialog");
const userLinks = [
  ["inicio", "Mi inicio"],
  ["perfil", "Accesibilidad"],
  ["ppe", "Mi PPE"],
  ["mapa", "Mapas offline"],
  ["historial", "Mi historial"],
  ["dispositivos", "Mis dispositivos"],
];
const adminLinks = [
  ["admin", "Dashboard"],
  ["emitir", "Disparo de alertas"],
  ["solicitudes", "Solicitudes"],
  ["zonas", "Zonas de refugio"],
  ["brigadas", "Brigadistas"],
  ["censo", "Usuarios y censo"],
  ["roles", "Roles y permisos"],
  ["externos", "Servicios externos"],
  ["reporte", "Historial y reportes"],
];
const brigadeLinks = [
  ["misiones", "Misiones"],
  ["mapa-brigada", "Mapa y sectores"],
  ["chat", "Push-To-Talk"],
  ["sector", "Despejar sector"],
  ["observaciones", "Observaciones"],
];
const adminRoutes = adminLinks.map((x) => x[0]).concat(["asignar", "evento"]);
const brigadeRoutes = [
  "misiones",
  "mision",
  "protocolo",
  "masivo",
  "sector",
  "mapa-brigada",
  "observaciones",
];
function announce(message, error = false) {
  feedback = message;
  isError = error;
  const live = document.querySelector("#announcer");
  live.textContent = "";
  requestAnimationFrame(() => {
    live.textContent = message;
  });
}
function preferences() {
  document.documentElement.classList.toggle("contrast", state.prefs.contrast);
  document.documentElement.style.setProperty(
    "--text-scale",
    state.prefs.text / 100,
  );
  document.documentElement.dataset.textSize = state.prefs.text;
}
function commit(action, payload = {}, rerender = true) {
  try {
    const next = transition(state, action, payload);
    state = next.state;
    const saved = saveState(state);
    announce(
      next.result +
        (saved
          ? ""
          : " · No se pudo guardar en este navegador; el estado se conserva en memoria."),
    );
    lastAction = action;
    preferences();
    if (rerender) render(false);
    return true;
  } catch (error) {
    announce(error.message, true);
    if (rerender) render(false);
    return false;
  }
}
function navigate(next) {
  lastAction = "";
  feedback = "";
  if (location.hash === `#/${next}`) render();
  else location.hash = `/${next}`;
}
function launch(payload) {
  if (commit("entry", payload, false)) {
    navigate(payload.view);
  }
}
function footer(v) {
  if (state.role === "admin")
    return go("solicitudes", "Solicitudes") + go("emitir", "Emitir alerta", "");
  if (state.role === "brigadista")
    return v === "misiones"
      ? go("mapa-brigada", "Mapa") + go("chat", "PTT", "")
      : go("misiones", "Misiones") + go("chat", "PTT", "");
  if (state.role === "visitante")
    return ["qr", "visitante"].includes(v)
      ? go(v === "qr" ? "acceso" : "qr", "Cancelar registro")
      : go("qr", "Registro de visitantes") + go("visita-ok", "Mi visita", "");
  if (["acceso", "perfil", "ppe", "inicio", "historial"].includes(v))
    return go("acceso", "← Volver") + go("inicio", "Inicio", "");
  return (
    btn("sendSOS", "SOS · Solicitar rescate", { kind: "danger", hu: "HU-21" }) +
    go("comunicar", "Comunicar necesidad", "outline", "HU-12")
  );
}
function tools() {
  return "";
}
function titleHTML(title) {
  if (view === "alerta" && state.prefs.contrast)
    return (
      esc(title.replace(" · Alto contraste", "")) +
      '<span class="desktop-text"> · Alto contraste</span>'
    );
  return esc(title);
}
function retainFocus(before) {
  if (!before) return;
  let next = before.id ? document.getElementById(before.id) : null;
  if (!next && before.dataset?.action)
    next = [...root.querySelectorAll("[data-action]")].find(
      (n) =>
        n.dataset.action === before.dataset.action &&
        n.dataset.payload === before.dataset.payload &&
        !n.disabled,
    );
  if (!next && before.tagName === "BUTTON")
    next = [...root.querySelectorAll("button")].find(
      (n) => n.textContent === before.textContent && !n.disabled,
    );
  if (!next && before !== document.body) next = root.querySelector(".feedback");
  if (next) {
    if (next.classList.contains("feedback")) next.tabIndex = -1;
    next.focus({ preventScroll: true });
  }
}
function render(focus = true) {
  const before = document.activeElement;
  const openedPanels = [
    ...root.querySelectorAll("details[open][data-panel]"),
  ].map((node) => node.dataset.panel);
  preferences();
  const hash = location.hash;
  view = hash.startsWith("#/") ? hash.slice(2).split("?")[0] : "landing";
  if (view === "landing") {
    root.innerHTML = landing();
    document.title = "EvacuAccess · Evacuación accesible";
    if (hash && hash !== "#landing") {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    }
    return;
  }
  if (view === "prototipo") {
    document.title = "EvacuAccess · Recorridos";
    location.replace("#/recorridos");
    return;
  }
  if (view === "recorridos") {
    root.innerHTML = `<main id="main-content" class="demo-list proto-screen"><img class="proto-trazado" src="assets/icons/marca-trazado.svg" alt="" width="210" height="94" aria-hidden="true"><div class="proto-brand-row"><h1 tabindex="-1"><a href="#landing" aria-label="EvacuAccess, volver a la portada">EvacuAccess</a></h1><img class="proto-logo" src="assets/icons/evacuaccess-logo.svg" alt="" width="48" height="48"></div><h2>Prototipo académico · <span class="desktop-text">Desktop</span><span class="mobile-text">Mobile</span></h2><p>Elige un recorrido. Todos pertenecen a la misma plataforma; no hay saltos entre dispositivos.</p><div class="proto-list">${entryButtons()}</div><p class="proto-footnote">Integraciones simuladas. Sin destellos, comunicaciones externas ni protocolos físicos no validados.</p></main>`;
    document.title = "EvacuAccess · Prototipo académico";
    return;
  }
  if (view !== "rescate") rescueReview = null;
  if (!["emitir","emitir_confirm"].includes(view)) alertReview = null;
  const denied =
    (adminRoutes.includes(view) && state.role !== "admin") ||
    (brigadeRoutes.includes(view) && state.role !== "brigadista");
  let data = denied
    ? {
        title: "Acceso restringido",
        body: `<p>Este panel corresponde a otro rol. Selecciona el recorrido apropiado.</p>${go("recorridos", "Seleccionar recorrido", "")}`,
      }
    : adminView(view, state, alertReview) ||
      brigadeView(view, state) ||
      userView(view, state) || secondaryView(view, state, {rescueReview, alertReview});
  if (!data)
    data = {
      title: "Vista no encontrada",
      body: go("recorridos", "Volver a los recorridos", ""),
    };
  if (!denied) data.body += followupActions(view, lastAction);
  const noNav = ["acceso", "alerta", "qr", "visitante", "visita-ok"].includes(
      view,
    ),
    links =
      state.role === "admin"
        ? adminLinks
        : state.role === "brigadista"
          ? brigadeLinks
          : userLinks;
  const side = noNav
    ? ""
    : `<nav class="sidebar" id="role-navigation" aria-label="Navegación del rol"><p class="sidebar-title">${state.role === "admin" ? "Centro de control" : state.role === "brigadista" ? "Brigada · Sector norte" : "Mi EvacuAccess"}</p>${links.map(([v, label]) => (v === view ? `<span class="btn outline current" aria-current="page">${label}</span>` : `<a class="btn outline" href="#/${v}">${label}</a>`)).join("")}<p class="system-state"><span class="status-dot" aria-hidden="true">●</span> Sistemas simulados<br>Actualización muestra</p></nav>`;
  root.innerHTML = `<div class="app" data-ui><header class="app-header"><a class="brand" href="#landing">EvacuAccess</a><img class="institution-logo" src="assets/icons/evacuaccess-logo.svg" width="32" height="32" alt=""><p class="context">Sede Central · Edificio B | Prototipo académico</p><p class="mobile-context">Web · Demo</p>${!noNav ? '<button type="button" class="menu-toggle" data-action="menu" aria-controls="role-navigation" aria-expanded="false">Menú</button>' : ""}</header><div class="workspace">${side}<div class="work-panel"><main id="main-content" class="scroll-area"><div data-view="${view}" class="content ${data.emergency ? "alert-view" : ""}" ${data.hu ? `data-hu="${data.hu}"` : ""}><p class="breadcrumb">${data.breadcrumb || `${state.role === "admin" ? "Administrador" : state.role === "brigadista" ? "Brigadista" : state.role === "visitante" ? "Visitante" : "Usuario"} · Sede Central / Edificio B`}</p><h1 tabindex="-1">${titleHTML(data.title)}</h1>${feedback ? `<div class="feedback ${isError ? "error" : ""}" ${isError ? 'role="alert"' : ""}>${esc(feedback)}</div>` : ""}${data.body}${tools()}</div></main><footer class="persistent" aria-label="Acciones persistentes">${footer(view)}</footer></div></div></div>`;
  document.title = `${data.title} · EvacuAccess`;
  root.querySelectorAll("details[data-panel]").forEach((node) => {
    node.open = openedPanels.includes(node.dataset.panel);
  });
  if (focus) root.querySelector("h1")?.focus({ preventScroll: true });
  else retainFocus(before);
}
function openDialog(title, body) {
  lastFocus = document.activeElement;
  document.querySelector("#dialog-content").innerHTML =
    `<h2 id="dialog-title">${esc(title)}</h2>${body}${btn("cancelDialog", "Cancelar", { kind: "outline" })}`;
  dialog.showModal();
}
function closeDialog() {
  dialog.close();
  lastFocus?.isConnected && lastFocus.focus();
}
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeDialog();
  }
});
dialog.addEventListener("close", () => {
  if (lastFocus?.isConnected) lastFocus.focus();
  else root.querySelector("h1")?.focus({ preventScroll: true });
});
function speech() {
  const text = state.route.blocked
    ? `Ascensores bloqueados. Sigue la ruta sin escaleras hacia ${state.route.destination}.`
    : "Sigue de frente. Avanza 20 metros hacia la salida norte.";
  if (!("speechSynthesis" in window)) {
    announce(`Voz no disponible. Instrucción: ${text}`);
    render(false);
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE";
  utterance.onerror = () => {
    announce(`No se pudo reproducir la voz. Instrucción: ${text}`, true);
    render(false);
  };
  speechSynthesis.speak(utterance);
  announce(`Instrucción solicitada: ${text}`);
  render(false);
}
function vibrate() {
  let supported = false;
  try {
    supported =
      typeof navigator.vibrate === "function" &&
      navigator.vibrate([200, 100, 200]);
  } catch {}
  announce(
    supported
      ? "Patrón háptico solicitado al dispositivo. Alerta visual disponible."
      : "Vibración no disponible o bloqueada. La alerta visual y textual sigue disponible.",
  );
  render(false);
}
document.addEventListener("click", (e) => {
  const element = e.target.closest("[data-action]");
  if (!element) {
    if (e.target.closest('a[href^="#"]')) feedback = "";
    return;
  }
  const action = element.dataset.action,
    payload = JSON.parse(element.dataset.payload || "{}");
  switch (action) {
    case "drill": {
      const detail = document.querySelector("#drill-detail");
      const label = drills[payload.index];
      if (!detail || !label) break;
      root.querySelectorAll('[data-action="drill"]').forEach(control =>
        control.setAttribute("aria-pressed", String(control === element)));
      detail.innerHTML = panel("Simulacro seleccionado", "<p>" + esc(label) + "</p>" +
        (payload.index === 1 ? btn("drillStop", "Consultar detención de septiembre", {kind:"outline"}) : ""));
      break;
    }
    case "drillStop":
      element.replaceWith(document.createTextNode("Detención de 45 segundos en la Rampa Sur durante el simulacro del 29 de septiembre."));
      break;
    case "companionLimit": {
      const message = "Límite alcanzado: Puede registrar un máximo de 2 acompañantes directos";
      document.querySelector("#companion-limit").textContent = message;
      announce(message);
      break;
    }
    case "returnScreen":
      navigate(({ salida:"ruta", rescate:"mision", emitir_confirm:"emitir" })[view] || "recorridos");
      break;
    case "screenAction": {
      const target = payload.target;
      if (target === "contraste" && !state.prefs.contrast) commit("contrast", {}, false);
      if (view === "contraste" && target === "alerta" && state.prefs.contrast) commit("contrast", {}, false);
      if (target === "texto200") commit("text", { value:200 }, false);
      if (view === "texto200" && target === "perfil") commit("text", { value:100 }, false);
      if (target === "bloqueo" || target === "desvio") commit("block", {}, false);
      if (target === "lleno") commit("refugeStatus", {id:"A",status:"Lleno"}, false);
      if (target === "reasignada" && !commit("assign", { requestId:state.selectedRequest || "R-014", brigadierId:"B2" })) break;
      if (target === "chat_fallo" && state.online) commit("network", {}, false);
      if (view === "chat_fallo" && target === "mensaje_ok") {
        if (!state.online) commit("network", {}, false);
        const pending = state.messages.find(message => message.status === "pending");
        if (!pending) { navigate("chat"); break; }
        if (!commit("retryMessage", {id:pending.id})) break;
      }
      if (view === "salida" && target === "seguro" && !commit("arrive", {}, false)) break;
      if (view === "voz" && target === "ruta") commit("confirmAlert", {}, false);
      if (view === "cerrar" && target === "reporte" && !commit("close", {}, false)) break;

      if (target === "visita-ok" && view === "visitante_seleccion") { navigate("visitante"); break; }
      navigate(target);
      break;
    }
    case "navigate":
      navigate(payload.view);
      break;
    case "entry":
      launch(payload);
      break;
    case "menu": {
      const side = document.querySelector(".sidebar");
      const open = side.classList.toggle("open");
      element.setAttribute("aria-expanded", String(open));
      if (open) side.querySelector("a")?.focus();
      break;
    }
    case "cancelDialog":
      closeDialog();
      break;
    case "contrast":
      commit("contrast");
      break;
    case "confirmAlert":
      if (commit("confirmAlert", {}, false)) {
        try {
          navigator.vibrate?.(0);
          if (state.prefs.haptic) navigator.vibrate?.(80);
        } catch {}
        if (state.prefs.voice) speech();
        announce("Alerta confirmada. Estado: Evacuando");
        location.hash = "/ruta";
      }
      break;
    case "speak":
      speech();
      break;
    case "vibrate":
      vibrate();
      break;
    case "sendSOS":
      openDialog(
        "Solicitar rescate",
        `<p>La solicitud se registrará únicamente en este entorno de prueba. No se enviará a brigadistas ni a servicios de emergencia reales.</p><p>Ubicación de prueba: Edificio B · Piso 2 · Aula 204.</p>${btn("confirmSOS", "Registrar solicitud SOS", { kind: "danger", hu: "HU-21" })}`,
      );
      break;
    case "confirmSOS":
      closeDialog();
      if (commit("sos", {}, false)) {
        if (view === "sos") render(false);
        else {
          location.hash = "/sos";
        }
      } else render(false);
      break;
    case "failSOS":
      commit("sos", { fail: true });
      break;
    case "safeDialog":
      openDialog(
        "Confirmar salida segura",
        `<p>¿Confirmas que María López llegó a una zona segura?</p>${btn("safeConfirm", "Confirmar llegada a zona segura", { kind: "success", hu: "HU-10" })}`,
      );
      break;
    case "safeConfirm":
      closeDialog();
      if (commit("arrive", {}, false)) {
        location.hash = "/seguro";
      }
      break;
    case "refugeArrival":
      commit("arrive", { refuge: true });
      break;
    case "showCard":
      openDialog(
        "Tarjeta de comunicación",
        `<div class="enlarged-card"><img src="assets/icons/${cardIcon(payload.icon)}.svg" alt=""><p>${esc(payload.message)}</p></div>${btn("sendCard", "Enviar necesidad", { hu: "HU-12", payload })}`,
      );
      break;
    case "sendCard":
      closeDialog();
      commit("card", payload);
      break;
    case "quickMessage":
      commit("message", payload);
      break;
    case "sensor":
      if (commit("sensor", {}, false)) location.hash = "/evento";
      break;
    case "selectRequest":
      state.selectedRequest = payload.id;
      saveState(state);
      navigate("asignar");
      break;
    case "assign":
      commit("assign", payload);
      break;
    case "emitConfirm":
      if (state.role === "admin" && view === "emitir_confirm" && alertReview && commit("emit", alertReview, false)) {
        alertReview = null;
        navigate("emitida");
      }
      break;
    case "reassign":
      commit("assign", { requestId: payload.requestId, brigadierId: "B2" });
      break;
    case "openMission":
      state.selectedMission = payload.id;
      if (
        state.missions.find((m) => m.id === payload.id)?.status === "assigned"
      )
        commit("accept", { id: payload.id }, false);
      saveState(state);
      navigate("mision");
      break;
    case "queueMission":
      commit("assign", {
        requestId: payload.id,
        brigadierId: "B1",
        queue: true,
      });
      break;
    case "rescueDialog":
      if (state.role === "brigadista") {
        rescueReview = { ids: payload.ids };
        navigate("rescate");
      }
      break;
    case "rescueConfirm": {
      const request = view === "rescate" ? rescueReview : dialog.open && view === "masivo" ? payload : null;
      if (!request || state.role !== "brigadista") break;
      if (commit("rescue", request, false)) {
        rescueReview = null;
        if (dialog.open) closeDialog();
        navigate("rescatado");
      }
      break;
    }
    case "disconnect":
      commit("brigadierStatus", {
        id: "B4",
        status:
          state.brigadiers.find((b) => b.id === "B4").status === "offline"
            ? "available"
            : "offline",
      });
      break;
    case "sectorArrivalDialog":
      openDialog(
        "Registrar llegadas del sector",
        `<p>Se registrará la llegada a zona segura de las personas evacuando o en refugio del sector ${esc(payload.sector)}. Las misiones y personas en riesgo deben resolverse primero.</p>${btn("sectorArrivalConfirm", "Confirmar llegadas", { payload })}`,
      );
      break;
    case "sectorArrivalConfirm":
      closeDialog();
      commit("sectorArrival", { ...payload, confirm: true });
      break;
    case "marker": {
      const p =
        payload.type === "sos"
          ? state.people[0]
          : payload.type === "person"
            ? state.people[2]
            : null;
      openDialog(
        payload.type === "brigade" ? "Brigadistas por sector" : p.name,
        `<p>${p ? `Edificio ${p.building} · Piso ${p.floor} · ${esc(p.location)}<br>${esc(p.needs.join(" · "))}<br>Canal: ${esc(p.channel)}` : state.brigadiers.map((b) => `${esc(b.name)} · ${esc(b.sector)}`).join("<br>")}</p>${noteLocal("Ubicaciones de prueba.")}`,
      );
      break;
    }
    case "csv": {
      const blob = new Blob([reportCSV(state)], {
          type: "text/csv;charset=utf-8",
        }),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "evacuaccess-reporte.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(
        "Reporte CSV generado con el estado y la auditoría de esta sesión",
      );
      render(false);
      break;
    }
    case "print":
      window.print();
      break;
    case "closeDialog":
      openDialog(
        "Finalizar emergencia",
        `<p>Se cerrará el evento y expirará el paquete externo. El reporte conservará los estados actuales del censo.</p>${btn("closeConfirm", "Confirmar cierre del evento", { hu: "HU-40 HU-45" })}`,
      );
      break;
    case "closeConfirm":
      closeDialog();
      commit("close");
      break;
    case "resetDialog":
      openDialog(
        "Restablecer entorno",
        `<p>Se restaurarán los datos iniciales y se borrarán las preferencias, mensajes y eventos guardados en este entorno.</p>${btn("resetConfirm", "Restaurar escenario inicial")}`,
      );
      break;
    case "resetConfirm":
      closeDialog();
      state = initialState();
      saveState(state);
      visitorKey = crypto.randomUUID();
      feedback = "";
      preferences();
      navigate("recorridos");
      break;
    default:
      commit(action, payload);
  }
});
const noteLocal = (t) => `<p class="small-copy muted">${t}</p>`;
document.addEventListener("submit", (e) => {
  const form = e.target;
  e.preventDefault();
  const data = new FormData(form);
  if (form.id === "preferences") {
    commit("preferences", {
      needs: [
        "Discapacidad auditiva",
        "Discapacidad visual",
        "Movilidad reducida",
      ].filter((_, i) => data.has("need" + i)),
      voice: data.has("voice"),
      haptic: data.has("haptic"),
      contrast: data.has("contrast"),
      text: Number(data.get("text")),
    });
  } else if (form.id === "ppe")
    commit("ppe", { pace: Number(data.get("pace")) });
  else if (form.id === "chat") commit("message", { text: data.get("message") });
  else if (form.id === "visitor") {
    if (
      commit(
        "visitor",
        {
          name: data.get("name"),
          destination: data.get("destination"),
          needs: data.get("needs"),
          key: visitorKey,
        },
        false,
      )
    ) {
      visitorKey = crypto.randomUUID();
      location.hash = "/visita-ok";
    }
  } else if (form.id === "alert-form") {
    const event = data.get("event"),
      scope = data.get("scope");
    if (state.role !== "admin") return;
    alertReview = {event, scope};
    navigate("emitir_confirm");
  } else if (form.id === "mass-rescue") {
    const ids = [...data.keys()];
    if (!ids.length) {
      announce("Selecciona al menos una misión activa", true);
      render(false);
    } else
      openDialog(
        "Confirmar rescates seleccionados",
        `<p>Se registrarán ${ids.length} rescates de las misiones ${ids.map(esc).join(", ")}.</p>${btn("rescueConfirm", "Confirmar registro de rescates", { hu: "HU-37", payload: { ids } })}`,
      );
  } else if (form.id === "clear-sector")
    commit("clearSector", {
      sector: data.get("sector"),
      value: Number(data.get("slider")),
      confirm: data.has("verified"),
    });
  else if (form.dataset.sectorForm)
    commit("sectorAssign", {
      id: form.dataset.sectorForm,
      sector: data.get("sector"),
    });
});
document.addEventListener("input", (e) => {
  if (e.target.id === "text-size") {
    const value = e.target.value + " %";
    document.querySelector("#text-value").value = value;
    e.target.setAttribute("aria-valuetext", value);
  }
  if (e.target.id === "clear-slider") {
    document.querySelector("#slider-value").value =
      `${e.target.value} % · Usa también las flechas o Fin del teclado.`;
    e.target.setAttribute(
      "aria-valuetext",
      `${e.target.value} %, ${Number(e.target.value) === 100 ? "listo para confirmar" : "pendiente"}`,
    );
  }
});
document.addEventListener("change", (e) => {
  if (e.target.closest("#alert-form")) {
    const f = document.querySelector("#alert-form"),
      d = new FormData(f);
    document.querySelector("#alert-preview").textContent =
      `Selección actual: ${d.get("event")} · ${d.get("scope")}`;
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const open = document.querySelector(".sidebar.open");
    open?.classList.remove("open");
    const menu = document.querySelector(".menu-toggle");
    menu?.setAttribute("aria-expanded", "false");
    if (open) menu?.focus();
  }
});
window.addEventListener("hashchange", () => render());
onLayoutChange(() => { if (secondaryView(view, state)) render(false); });
window.addEventListener("storage", () => {
  state = loadState();
  render(false);
});
document.querySelector(".skip").addEventListener("click", (event) => {
  event.preventDefault();
  const main = document.getElementById("main-content");
  if (!main) return;
  main.tabIndex = -1;
  main.focus({ preventScroll: true });
  if (main.classList.contains("scroll-area")) main.scrollTop = 0;
  else main.scrollIntoView({ block: "start" });
});
render(false);
