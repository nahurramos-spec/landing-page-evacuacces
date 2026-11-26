import {
  esc,
  btn,
  go,
  panel,
  icon,
  note,
  check,
  controls,
  productText,
} from "./ui.js";
import { eta, occupancy, refugeAvailable } from "./state.js";
import { map } from "./map.js";
export const cards = [
  ["Hay humo", "Smoke"],
  ["Tengo dolor", "Heart"],
  ["No puedo caminar", "Accessible"],
  ["Me falta el aire", "Air"],
  ["Necesito agua", "Water"],
  ["Necesito mi medicina", "Medication"],
  ["Estoy atrapado", "Lock"],
];
export const cardIcon = (c) => `imgMaterialSymbolsOutlined${c}2-571`;
export function userView(view, s) {
  const p = s.people[0],
    r = s.sos[0],
    b = s.brigadiers.find((x) => x.id === r.assigned);
  switch (view) {
    case "acceso":
      return {
        title: "Iniciar sesión",
        breadcrumb: "Acceso a la plataforma",
        body: `<h2 class="intro-title">Una plataforma para todas las personas</h2><p>Gestiona tu accesibilidad, recibe orientación y coordina la evacuación desde cualquier pantalla.</p>${panel(
          "Acceso de demostración",
          `<p>Datos precargados. Elige el rol autorizado para recorrer el prototipo. No se valida una identidad real.</p>${[
            ["general", "Usuario · María López", "usuario", "perfil"],
            [
              "brigadista",
              "Brigadista · Luis Paredes",
              "brigadista",
              "misiones",
            ],
            ["admin", "Administrador · Ana Torres", "admin", "admin"],
            ["visitante", "Visitante · Registro QR", "visitante", "qr"],
          ]
            .map(([entry, label, role, view]) =>
              btn("entry", label, { payload: { entry, role, view } }),
            )
            .join("")}`,
        )}${panel("Prototipo académico", "<p>No es un sistema de emergencia certificado. Todas las emergencias y comunicaciones de esta demostración son simuladas.</p>", "info")}`,
      };
    case "perfil":
      return {
        title: "Perfil de accesibilidad",
        hu: "HU-05 HU-08",
        body: `<form id="preferences" class="stack">${panel("1. Tus necesidades", `<p>Selecciona de forma independiente. Puedes combinar las opciones y editarlas después.</p>${["Discapacidad auditiva", "Discapacidad visual", "Movilidad reducida"].map((n, i) => check("need" + i, n, s.prefs.needs.includes(n))).join("")}`)}${panel("2. Cómo quieres recibir las alertas", `<p>Texto siempre disponible. Voz y vibración dependen del dispositivo y se simulan aquí.</p>${check("voice", "Instrucciones por voz", s.prefs.voice)}${check("haptic", "Vibración háptica", s.prefs.haptic)}${check("contrast", "Modo mate · Alto contraste", s.prefs.contrast)}<label class="field" for="text-size">Tamaño de texto · 100 % → 200 %<select id="text-size" name="text"><option value="100" ${s.prefs.text === 100 ? "selected" : ""}>100 %</option><option value="150" ${s.prefs.text === 150 ? "selected" : ""}>150 %</option><option value="200" ${s.prefs.text === 200 ? "selected" : ""}>200 %</option></select></label>`)}<button class="btn" type="submit">Guardar preferencias</button></form>`,
      };
    case "inicio":
      return {
        title: "Inicio personal",
        body: `${panel("María López", `<p>Edificio B · Piso 2 · Aula 204</p><p>Estado: <strong>${{ risk: "En riesgo", evacuating: "Evacuando", refuge: "En refugio", safe: "A salvo" }[p.status]}</strong></p><p>Necesidades: ${esc(p.needs.join(" · ") || "Configura tus preferencias")}</p>`)}${go("perfil", "Editar perfil de accesibilidad")}${go("ppe", "Mi Plan Personalizado de Evacuación")}${go("alerta", "Ver alerta de emergencia")}${go("ruta", "Consultar ruta accesible")}${go("sos", "Consultar asistencia")}`,
      };
    case "ppe":
      return {
        title: "Plan Personalizado de Evacuación",
        hu: "HU-25",
        body: `<form id="ppe" class="stack"><input type="hidden" name="pace" value="${s.ppe.pace}">${panel("Asistencia de movilidad", `<p>Silla de ruedas manual · No utilizar escaleras<br>Ancho de paso requerido: 90 cm o más<br>Ritmo personal de referencia: ${String(s.ppe.pace).replace(".", ",")} m/s</p><button class="btn outline" type="submit">Confirmar silla manual y ritmo</button>`)}${panel("Contactos de apoyo · 2 de 2", "<p>Lucía Ramos · +51 966 666 101<br>Diego López · +51 966 666 102<br>Datos ficticios. Avisos SMS y push simulados.</p>")}${note("Privacidad: PPE disponible solo para la brigada autorizada. El almacenamiento y la autorización del servidor no están implementados.")}<button class="btn" type="submit">Guardar PPE</button></form>`,
      };
    case "alerta":
      return {
        title: `Evacuar por ${s.alert.event.toLowerCase()}${s.prefs.contrast ? " · Alto contraste" : ""}`,
        hu: "HU-02 HU-03 HU-06",
        emergency: true,
        body: `${panel(`Emergencia ${s.alert.active ? "activa" : "finalizada"} · ${s.alert.event}`, '<p>Mantén la calma. Sigue la ruta indicada en esta demostración.</p><p class="small-copy"><strong>Vibración simulada · Voz simulada · Sin destellos</strong></p>', "emergency", "HU-03")}<p>Toca el botón para confirmar que recibiste la alerta.</p>${btn("confirmAlert", s.alert.confirmed ? "✓ Alerta confirmada · Evacuando" : "✓ Estoy enterado", { kind: "acknowledge", hu: "HU-06", disabled: !s.alert.active || s.alert.confirmed })}<p>Al confirmar: estado «Evacuando» y detención de la vibración.</p>${s.alert.confirmed ? go("ruta", "Continuar ruta accesible", "", "HU-07") : ""}${btn("contrast", s.prefs.contrast ? "Usar alerta estándar" : "Activar alto contraste", { kind: "outline", hu: "HU-05" })}${btn("vibrate", "Probar vibración de alerta", { kind: "outline", hu: "HU-02" })}${btn("speak", "Escuchar instrucciones", { kind: "outline", hu: "HU-04" })}${go("comunicar", "Ver tarjetas de comunicación", "outline", "HU-12")}`,
      };
    case "ruta":
      return {
        title: s.route.blocked
          ? "Ruta accesible recalculada"
          : "Sigue de frente",
        hu: "HU-07 HU-17 HU-18",
        body: `${panel("Evacuando · Sin escaleras", `<p>${s.route.blocked ? esc(s.route.notice) : "Avanza 20 metros hacia la salida norte."}</p>`, "info")}<section class="direction"><div class="arrow-slot">${icon("imgFrame2-307")}</div><h2>${s.route.step < 4 ? "De frente" : "Llegada al destino"}</h2><p class="tag">Paso ${s.route.step} de 4 · ${s.route.blocked ? "Ascensores bloqueados · Desvío habilitado" : "Vía libre · Baliza B-204 simulada"}</p></section>${panel("Punto de encuentro", `<p>${esc(s.route.destination)} · a ${s.route.blocked ? s.refuges.find((x) => x.id === s.selectedRefuge)?.distance || 0 : s.ppe.distance} m<br>Tiempo adaptado: ${eta(s)} min · ${eta(s) > s.ppe.margin ? "Supera" : "Dentro del"} margen de demostración</p>`)}${btn("speak", "Repetir instrucción", { kind: "outline", hu: "HU-04" })}${s.route.step < 4 ? btn("nextStep", "Continuar al siguiente movimiento", { hu: "HU-07" }) : go("refugio", "Consultar llegada al refugio")}${go("mapa", "Ver mapa")}${btn("elevator", "Consultar ascensores 1 y 2", { kind: "outline", hu: "HU-18" })}${btn("safeDialog", "Ya estoy fuera / Fuera de peligro", { kind: "success", hu: "HU-10" })}`,
      };
    case "mapa":
      return {
        title: "Mapa de evacuación",
        hu: "HU-17 HU-32",
        body: `${map(s)}${panel("Ubicación de demostración", "<p>Edificio B · Piso 2 · Aula 204.<br>La ubicación interior y las balizas son simuladas.</p>", "info")}${go("ruta", "Continuar ruta accesible")}${go("refugio", "Consultar refugios")}`,
      };
    case "sos":
      return {
        title:
          r.status === "failed"
            ? "No se pudo enviar el SOS"
            : r.status === "rescued"
              ? "Rescate registrado"
              : "Solicitud SOS enviada",
        hu: "HU-21 HU-24",
        body: `${r.status === "failed" ? "" : icon("imgFrame2-499")}${panel(r.status === "failed" ? "Fallo de envío" : r.status === "rescued" ? "Rescate registrado" : "Solicitud enviada", `<p>SOS ${r.id} · ${esc(p.name)}<br>Edificio B · Piso 2 · Aula 204<br>${r.status === "failed" ? "La solicitud está guardada y puedes reintentar." : r.status === "rescued" ? "La llegada a zona segura está confirmada." : b ? `Ubicación interior simulada. Asignada a ${esc(b.name)}.` : "Ubicación interior simulada. El centro de control ha recibido la solicitud en esta demostración."}</p>`, r.status === "failed" ? "danger-panel" : "success-panel")}${r.status === "failed" ? btn("sendSOS", "Reintentar envío", { hu: "HU-21" }) : go("asistencia", "Consultar brigadista asignado", "", "HU-24")}${go("comunicar", "Comunicar una necesidad")}${btn("failSOS", "Ver fallo de envío simulado", { kind: "outline", hu: "HU-21", disabled: !!r.assigned || r.status === "rescued" })}`,
      };
    case "asistencia":
      return {
        title: b ? "Brigadista en camino" : "Estado de la asistencia",
        hu: "HU-21 HU-24",
        body: b
          ? `${panel(`${b.name} · Brigadista`, `<div class="row"><img class="portrait" src="${b.photo}" alt="${esc(b.name)}"><div class="stack"><p>${esc(b.badge)} · ${r.id} · Sector ${esc(b.sector)}</p><p class="eta">Llega en ${b.eta} min</p></div></div><p>Comunicación por texto y gestos.</p>${note("Identidad y tiempo estimado de demostración.")}`)}${go("chat", "Abrir chat de emergencia", "")}${go("comunicar", "Mostrar tarjetas de comunicación")}${btn("safeDialog", "Llegué a zona segura", { kind: "success", hu: "HU-10" })}${go("sos", "Volver a la solicitud")}`
          : `${panel("Pendiente de asignación", `<p>${r.id} · ${esc(p.name)}<br>La solicitud está enviada y aún no tiene un brigadista asignado.</p>`, "info")}${go("comunicar", "Comunicar una necesidad")}${go("sos", "Volver a la solicitud")}`,
      };

    case "comunicar":
      return {
        title: "Comunica lo que necesitas",
        hu: "HU-08 HU-12",
        body: `<p>Toca una tarjeta para mostrarla en grande.</p><div class="card-grid">${cards.map(([text, name]) => btn("showCard", `${icon(cardIcon(name))}<span>${text}</span>`, { kind: "outline communication-card", hu: "HU-12", payload: { message: text, icon: name } })).join("")}</div>${btn("gestures", "Requiero comunicación gestual / señas", { hu: "HU-08" })}${note("La ayuda gestual prioriza personal con certificación en lengua de señas. Priorización simulada.")}${p.needCard ? panel("Necesidad enviada", `<p>${esc(p.needCard)}</p>`, "info") : ""}`,
      };
    case "chat":
      return {
        title: "Chat de emergencia",
        hu: "HU-27",
        body: `${panel(b ? `${b.name} · Brigadista` : "Conversación de emergencia", `<p>Comunicación por texto y gestos. Historial compartido en este navegador.</p><p><strong>${s.online ? "Conexión disponible" : "Sin conexión · Mensajes pendientes"}</strong></p>`)}<div class="chat-log" aria-label="Historial de mensajes">${s.messages.length ? s.messages.map((m) => `<article class="message ${m.sender === "brigadista" ? "brigade" : "mine"} ${m.status === "pending" ? "pending" : ""}"><time datetime="${new Date(m.at).toISOString()}">${new Date(m.at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", timeZone: "America/Lima" })} · ${m.sender === "brigadista" ? "Brigadista" : m.sender === "admin" ? "Administrador" : "Usuario"}</time><p>${esc(m.text)}</p><p class="small-copy">${m.status === "pending" ? "Pendiente de envío" : "Guardado"}</p>${m.status === "pending" ? btn("retryMessage", "Reintentar mensaje", { kind: "outline", hu: "HU-27", payload: { id: m.id } }) : ""}</article>`).join("") : "<p>Aún no hay mensajes en esta sesión.</p>"}</div><div class="row stack-mobile">${["Estoy bien", "Hay humo", "No puedo moverme"].map((text) => btn("quickMessage", text, { kind: "outline", hu: "HU-27", payload: { text } })).join("")}</div><form id="chat" class="stack"><label class="field" for="message">Mensaje<textarea id="message" name="message" rows="2" maxlength="500" required></textarea></label><button class="btn" type="submit">Enviar mensaje</button></form>${controls("chat-controls", btn("network", s.online ? "Interrumpir conexión" : "Restablecer conexión", { kind: "outline", hu: "HU-27" }))}`,
      };
    case "refugio":
      return {
        title: "Llegada al refugio",
        hu: "HU-29 HU-10",
        body: `${s.route.notice ? `<p class="tag">${esc(s.route.notice)}</p>` : ""}${s.refuges.map((r) => panel(`Refugio ${r.id} · Piso 2 · ${r.distance} m`, `<p><strong>${esc(r.status)} · ${occupancy(s, r.id)}/${r.capacity} plazas</strong></p><p>${s.selectedRefuge === r.id ? "Destino seleccionado" : "Alternativa del mismo nivel"}</p>${btn("refuge", `Seleccionar Refugio ${r.id}`, { kind: "outline", hu: "HU-29", payload: { id: r.id }, disabled: !refugeAvailable(s, r) })}`, refugeAvailable(s, r) ? "" : "warning-panel")).join("")}${note("Refugios de prueba · Certificación pendiente.")}${btn("refugeArrival", "Confirmar llegada manualmente", { kind: "outline", hu: "HU-10", disabled: !s.selectedRefuge })}${controls("refuge-controls", btn("refugeArrival", "Registrar llegada por QR / baliza", { kind: "success", hu: "HU-10", disabled: !s.selectedRefuge }) + btn("refugeStatus", "Marcar Refugio A lleno", { kind: "outline", hu: "HU-29", payload: { id: "A", status: "Lleno" } }))}${p.status === "refuge" ? panel("Llegada confirmada", `<p>María López · Refugio ${p.refuge} · Censo actualizado</p>`, "info") : ""}`,
      };
    case "seguro":
      return {
        title: "Estás a salvo",
        hu: "HU-10",
        body: `${panel("Llegada confirmada", `<p>María López · ${p.status === "safe" ? "A salvo en zona segura" : p.status === "refuge" ? `En Refugio ${p.refuge}` : "Pendiente de confirmación"}</p><p>Tu estado de evacuación se ha actualizado.</p>`, "info")}${go("inicio", "Volver a mi inicio")}${go("mapa", "Consultar mapa")}`,
      };
    case "historial":
      return {
        title: "Historial de rutas y simulacros",
        body: `${panel(
          "Historial local",
          s.events.length
            ? `<ol class="stack">${
                s.events
                  .filter((e) => e.actor === "usuario")
                  .map((e) => `<li>${esc(productText(e.detail))}</li>`)
                  .join("") || "<li>No hay eventos del rol Usuario.</li>"
              }</ol>`
            : "<p>Realiza un recorrido para registrar sus eventos.</p>",
        )}${go("ruta", "Explorar ruta accesible")}`,
      };
    case "dispositivos":
      return {
        title: "Dispositivos y disponibilidad",
        body: `${panel("Funciones de este navegador", `<p>Voz: ${typeof window !== "undefined" && "speechSynthesis" in window ? "Disponible en este navegador" : "No disponible, transcripción visible"}<br>Vibración: ${typeof navigator !== "undefined" && typeof navigator.vibrate === "function" ? "Disponible según el dispositivo" : "No disponible, alerta visual disponible"}</p><p>Voz y vibración dependen del dispositivo. Las instrucciones siempre están disponibles como texto.</p>`)}${btn("speak", "Probar instrucción por voz", { kind: "outline", hu: "HU-04" })}${btn("vibrate", "Probar vibración", { kind: "outline", hu: "HU-02" })}${go("perfil", "Editar preferencias")}`,
      };
    case "qr":
      return {
        title: "Registro mediante QR",
        breadcrumb: "Visitante · Sede Central / Edificio B",
        body: `${panel("Registro de visitantes", `<p>Acceso web sin instalación. Este botón representa el escaneo del QR de recepción. No se activa la cámara.</p>${icon("imgFrame2-1459", "", "qr-icon")}<p><strong>QR · Simulación de acceso</strong></p>`, "info")}${go("visitante", "Escanear QR simulado y abrir registro", "")}${go("acceso", "Volver al acceso de demostración")}`,
      };
    case "visitante":
      return {
        title: "Registro de visitante",
        breadcrumb: "Visitante · Sede Central / Edificio B",
        body: `<form id="visitor" class="stack">${panel("Datos necesarios para el ingreso", `<p>Formulario precargado de demostración. No introduzcas datos personales reales.</p><label class="visitor-field" for="visitor-name"><span>Nombre</span><input id="visitor-name" name="name" value="Elena Soto" maxlength="60" required autocomplete="off"></label><label class="visitor-field" for="destination"><span>Destino</span><input id="destination" name="destination" value="Edificio B · Recepción" maxlength="80" required autocomplete="off"></label><label class="sr-only" for="visitor-needs">Necesidad de accesibilidad</label><select id="visitor-needs" class="visitor-needs" name="needs"><option value="Texto e indicaciones visuales">Necesidad: texto e indicaciones visuales</option><option>Movilidad reducida</option><option>Discapacidad visual</option><option>Comunicación gestual / señas</option></select>`)}<button class="btn" type="submit">Registrar ingreso</button>${note("Se muestra un recorrido con datos de ejemplo. Los campos no almacenan información ni validan identidad.")}</form>`,
      };

    case "visita-ok": {
      const visitor = [...s.people].reverse().find((p) => p.visitorKey);
      return {
        title: visitor ? "Ingreso confirmado" : "Registra tu visita",
        breadcrumb: "Visitante · Sede Central / Edificio B",
        body: visitor
          ? `${panel("Registro completado", `<p>${esc(visitor.name)} · ${esc(visitor.location)}<br>Necesidad: ${esc(visitor.needs.join(" · "))}<br>Estado: ${visitor.status === "safe" ? "A salvo" : "Evacuando"}</p><p>Tu ingreso está registrado.</p>`, "info")}${map(s)}${panel("Ruta accesible del visitante", "<p>Recorrido por el corredor hasta la salida norte. Evita escaleras; consulta la disponibilidad de refugios en el plano.</p>")}${btn("visitorSafe", "Confirmar llegada del visitante a zona segura", { kind: "success", disabled: visitor.status === "safe" })}`
          : go("qr", "Abrir registro mediante QR", ""),
      };
    }
    default:
      return null;
  }
}
