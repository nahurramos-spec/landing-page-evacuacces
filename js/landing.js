import { team } from "./team.js";
import { entryButtons, btn, icon, esc, environmentNotice } from "./ui.js";
export function landing() {
  const members = team.filter(
    (member) => member.name?.trim() && member.role?.trim(),
  );
  const teamSection = members.length
    ? `<section class="team" id="equipo"><div><h2>Nuestro equipo</h2><p>Personas comprometidas con una evacuación accesible.</p></div><div class="team-cards">${members.map((member) => `<article class="panel team-card"><h3>${esc(member.name)}</h3><p>${esc(member.role)}</p></article>`).join("")}</div></section>`
    : "";
  return `<div class="landing"><header class="landing-header"><a class="brand" href="#landing">EvacuAccess</a><nav aria-label="Navegación principal"><a href="#problematica">Problemática</a><a href="#solucion">Solución</a><a href="#funcionalidades">Funcionalidades</a>${members.length ? '<a href="#equipo">Equipo</a>' : ""}<a class="btn" href="#recorridos"><span class="desktop-text">Ingresar a EvacuAccess</span><span class="mobile-text">Ingresar</span></a></nav></header>${environmentNotice()}<main id="main-content"><section class="hero"><div><h1>Evacuar con accesibilidad</h1><p>Alertas comprensibles, rutas sin escaleras y asistencia coordinada en una misma plataforma.</p><a class="btn" href="#recorridos">Comenzar</a></div><div class="hero-product" data-ui><div class="product-top">EvacuAccess · Ruta accesible</div><div class="product-content"><div class="panel"><h2>Evacuando · Sin escaleras</h2><p>Avanza 20 metros hacia la salida norte.</p></div><div class="direction"><div class="arrow-slot">${icon("imgFrame2-307")}</div><h2>De frente</h2><p class="tag">Paso 2 de 4 · Vía libre</p></div><p>Punto de encuentro: Patio norte · a 80 m</p>${btn("entry", "Ver ruta accesible", { payload: { entry: "movilidad", role: "usuario", view: "ruta" } })}</div></div></section><section class="problem" id="problematica"><div class="section-intro"><h2>Una alarma no llega igual a todos</h2><p>Escuchar una sirena, interpretar una indicación o desplazarse por una escalera puede ser una barrera durante una evacuación.</p></div><div class="stack"><div><h3>Información que se pueda percibir</h3><p>Las personas con discapacidad auditiva necesitan indicaciones visuales y textuales. Quienes tienen baja visión necesitan contraste y una alternativa por voz.</p></div><div><h3>Un trayecto que se pueda recorrer</h3><p>Las personas con movilidad reducida necesitan conocer rutas accesibles, refugios disponibles y el estado de su solicitud de asistencia.</p></div><div><h3>Asistencia con contexto</h3><p>La brigada necesita saber dónde está la persona y cómo comunicarse con ella; administración necesita un censo coherente.</p></div></div></section><section class="solution" id="solucion"><div class="section-intro"><h2>Una respuesta accesible</h2><p>EvacuAccess reúne la orientación, la comunicación y la coordinación de la evacuación en un solo lugar.</p><a href="#recorridos">Elegir mi perfil</a></div><ol><li>Recibir y confirmar<span>Una alerta estática identifica el evento y permite confirmar su recepción.</span></li><li>Orientarse y pedir ayuda<span>La ruta evita escaleras y ofrece comunicación por texto, tarjetas y solicitudes SOS.</span></li><li>Coordinar y registrar<span>Administración asigna la misión; la brigada registra el rescate y actualiza el censo.</span></li></ol></section><section class="features" id="funcionalidades"><div class="section-intro"><h2>De la alerta a la llegada</h2><p>Recibe información accesible, consulta tu ruta y coordina la asistencia desde el mismo lugar.</p></div><div class="feature-list">${[
    [
      "Alertas accesibles",
      "Texto grande, confirmación, alto contraste y alternativas por voz o vibración cuando el navegador las permita.",
      "auditiva",
      "usuario",
      "alerta",
      "Recibir una alerta",
    ],
    [
      "Evacuación sin escaleras",
      "Consulta el PPE, el plano y el desvío hacia un refugio del mismo nivel cuando se bloquean los ascensores.",
      "movilidad",
      "usuario",
      "ppe",
      "Explorar una evacuación",
    ],
    [
      "Comunicación y asistencia",
      "Consulta tu asistencia, muestra una tarjeta o conversa por texto con la brigada.",
      "general",
      "usuario",
      "sos",
      "Consultar asistencia",
    ],
    [
      "Coordinación de brigadas",
      "Asigna o reasigna misiones, revisa necesidades de comunicación y registra rescates con confirmación.",
      "brigadista",
      "brigadista",
      "misiones",
      "Gestionar una misión",
    ],
    [
      "Supervisión de la emergencia",
      "Supervisa el censo, revisa las solicitudes y coordina las alertas por sector.",
      "admin",
      "admin",
      "admin",
      "Abrir el dashboard",
    ],
    [
      "Reportes verificables",
      "Revisa el historial de la evacuación y descarga el reporte de personas, misiones y acciones.",
      "admin",
      "admin",
      "reporte",
      "Consultar un reporte",
    ],
  ]
    .map(
      ([t, p, entry, role, view, label]) =>
        `<article class="feature-item"><h3>${t}</h3><p>${p}</p>${btn("entry", label, { payload: { entry, role, view } })}</article>`,
    )
    .join(
      "",
    )}</div></section><section class="profiles" id="perfiles"><div class="section-intro"><h2>Una plataforma, cuatro roles</h2><p>Las preferencias de accesibilidad se combinan y se aplican en la misma experiencia responsive.</p></div><div class="profile-list"><article><h3>Usuario</h3><p>Configura sus necesidades, confirma alertas y consulta su ruta o asistencia.</p></article><article><h3>Brigadista</h3><p>Revisa misiones y necesidades, se comunica por texto y registra el rescate.</p></article><article><h3>Administrador</h3><p>Supervisa el censo, las solicitudes, la disponibilidad y el historial.</p></article><article><h3>Visitante</h3><p>Registra su ingreso, indica sus necesidades y consulta la orientación del edificio.</p></article></div></section><section class="demo-section" id="recorridos"><div class="section-intro"><h2>Ingresa a EvacuAccess</h2><p>Elige el perfil que corresponde a tus necesidades o a tu función.</p></div><div class="entry-grid">${entryButtons()}</div></section>${teamSection}</main><footer class="landing-footer"><div><a class="brand" href="#landing">EvacuAccess</a><p>Accesibilidad en cada paso.</p></div><nav aria-label="Recursos"><a href="#recorridos">Ingresar</a><a href="#perfiles">Accesibilidad</a><a href="docs/limitaciones-tecnicas.md">Alcance del entorno</a></nav><p>Orientación y asistencia accesibles</p></footer></div>`;
}
