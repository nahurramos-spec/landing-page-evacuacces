import {
  esc,
  btn,
  go,
  panel,
  note,
  brigadeLabels,
  requestLabels,
  missionLabels,
  controls,
  productText,
} from "./ui.js";
import { counts, statuses, occupancy, refugeAvailable } from "./state.js";
import { map } from "./map.js";
export function adminView(view, s) {
  const c = counts(s);
  switch (view) {
    case "admin":
      return {
        title: "Dashboard operativo",
        hu: "HU-31",
        body: `<p class="muted">Estado de la evacuación en Sede Central · Simulación</p><div class="metrics">${Object.entries(
          statuses,
        )
          .map(
            ([key, label]) =>
              `<section class="panel metric"><strong data-count="${key}">${c[key]}</strong><h2>${label}</h2><p>${{ risk: "Requieren asistencia", evacuating: "En movimiento", refuge: `${s.refuges.filter((r) => refugeAvailable(s, r)).length} zonas activas`, safe: `${Math.round((c.safe / s.people.length) * 100)} % del total` }[key]}</p></section>`,
          )
          .join(
            "",
          )}</div><div class="dashboard-grid"><div class="stack">${map(s)}${go("solicitudes", "Ver solicitudes y localizar personas")}</div><div class="stack dashboard-side">${panel("Zonas de refugio", `<p>${s.refuges.map((r) => `Refugio ${r.id}: ${esc(r.status)} · ${occupancy(s, r.id)}/${r.capacity}`).join("<br>")}<br>Capacidad disponible de ejemplo: ${s.refuges.filter((r) => refugeAvailable(s, r)).reduce((a, r) => a + r.capacity - occupancy(s, r.id), 0)} personas</p>`)}${panel("Ascensores", `<p>${s.route.blocked ? "1 y 2 bloqueados<br>Rutas sin escaleras recalculadas." : "1 y 2 bloqueados<br>Rutas sin escaleras recalculadas."}</p>`, "danger-panel")}${panel("Brigadistas activos", `<p>6 de 8 · Sector norte</p>`, "warning-panel")}${go("asignar", "Asignar rescate prioritario", "")}</div></div>${go("emitir", "Emitir alerta global / sectorizada")}${go("solicitudes", "Solicitudes de rescate")}${go("zonas", "Gestionar zonas de refugio")}${go("brigadas", "Brigadistas por sector")}${go("censo", "Usuarios y censo")}${go("externos", "Servicios de emergencia externos")}${go("reporte", "Historial y reportes")}${btn("closeDialog", "Finalizar emergencia", { kind: "outline", hu: "HU-40" })}`,
      };
    case "emitir":
      return {
        title: "Disparo de alertas de emergencia",
        hu: "HU-33",
        body: `<form id="alert-form" class="stack">${panel("1 Tipo de evento", `<p>Selecciona el protocolo que se activará.</p><fieldset><legend class="sr-only">Tipo de evento</legend><div class="radio-choices">${["Sismo", "Incendio", "Simulacro"].map((x) => `<label class="choice"><input type="radio" name="event" value="${x}" ${x === (s.sectors[0].hazard ? "Incendio" : s.alert.event) ? "checked" : ""}>${x}</label>`).join("")}</div></fieldset>`)}${panel("2 Alcance de la alerta", `<p>Elige todo el edificio o un piso específico. El resumen muestra el alcance actual.</p><fieldset class="stack"><legend class="sr-only">Destinatarios</legend>${["Todo el edificio", "Piso 2"].map((x) => `<label class="choice"><input type="radio" name="scope" value="${x}" ${s.alert.scope === x ? "checked" : ""}>${x} · Selección de muestra</label>`).join("")}</fieldset>`, "info")}${panel("3 Mensaje adaptativo", "<p>«Evacúa hacia la zona segura más cercana. Sigue la ruta accesible y espera indicaciones de la brigada.»<br>Texto · Voz simulada · Vibración simulada · Sin destellos</p>")}<p id="alert-preview" class="tag">Selección actual: ${s.alert.event} · ${s.alert.scope}</p><button class="btn" type="submit">Confirmar y emitir alerta</button></form>${go("externos", "Preparar información para servicios externos")}${go("admin", "Cancelar")}`,
      };
    case "solicitudes":
      return {
        title: "Solicitudes de rescate",
        hu: "HU-34 HU-44",
        body: `${[...s.sos]
          .sort(
            (a, b) =>
              Number(s.people.find((p) => p.id === b.personId).priority) -
              Number(s.people.find((p) => p.id === a.personId).priority),
          )
          .map((r, index) => {
            const p = s.people.find((p) => p.id === r.personId),
              b = s.brigadiers.find((b) => b.id === r.assigned);
            const floor = p.floor === 0 ? "Planta baja" : `Piso ${p.floor}`;
            if (index > 0)
              return btn(
                "selectRequest",
                `<span class="request-title">${esc(r.id)} · ${esc(p.needs[0] || p.name)}</span><span class="request-meta">Edificio ${p.building} · ${floor}${p.location === "Pasillo" ? " · Pasillo" : ""} · ${requestLabels[r.status]}</span>`,
                {
                  kind: "outline request-card",
                  hu: "HU-34",
                  payload: { id: r.id },
                },
              );
            return panel(
              `Prioridad 1 · ${p.name} · ${r.id}`,
              `<p>${r.status === "rescued" ? "Rescate registrado" : "SOS activo"} · Edificio ${p.building} · ${floor} · ${esc(p.location)}<br>Sin movimiento hace 120 s · Señal pendiente<br>${esc(p.channel)} · ${esc(p.needs.filter((n) => n !== "Discapacidad auditiva").join(" · "))}${b ? `<br>Asignado a ${esc(b.name)}` : ""}</p>${r.status === "rescued" ? '<p class="safe-text">Llegada a zona segura confirmada.</p>' : btn("selectRequest", "Localizar y asignar brigadista", { hu: "HU-34", payload: { id: r.id } })}`,
              "priority danger-panel",
            );
          })
          .join(
            "",
          )}${note("Prioridad crítica indicada con texto, borde e icono estático. Se omite el parpadeo por seguridad.")}`,
      };

    case "asignar": {
      const id = s.selectedRequest || "R-014",
        r = s.sos.find((x) => x.id === id),
        p = s.people.find((x) => x.id === r.personId);
      return {
        title: "Asignar brigadista",
        hu: "HU-34",
        body: `<p><strong>${id} · ${esc(p.name)}</strong> · Piso ${p.floor}</p>${s.brigadiers.map((b) => panel(`${b.name} · ${brigadeLabels[b.status]}`, `<p>Edificio B · Piso ${b.floor} · a ${b.distance} m<br>${b.signs ? "Comunicación en lengua de señas" : "Canal de comunicación: texto"}<br>${b.floor === p.floor ? "Mismo piso" : "Otro piso"}${b.floor === p.floor && b.status === "available" ? " · Recomendado por proximidad" : ""}</p>${btn("assign", `Asignar a ${b.name}`, { hu: "HU-34", payload: { requestId: id, brigadierId: b.id }, disabled: (b.status !== "available" && r.assigned !== b.id) || r.status === "rescued" || r.status === "failed" })}`)).join("")}${controls("reassign-controls", btn("reassign", "Reasignar a Carla · 30 s sin respuesta", { kind: "outline", hu: "HU-34", payload: { requestId: id }, disabled: r.status === "rescued" || r.status === "failed" }))}${go("solicitudes", "Volver a solicitudes")}`,
      };
    }
    case "zonas":
      return {
        title: "Zonas de refugio",
        hu: "HU-39",
        body: `${s.refuges.map((r) => panel(`Refugio ${r.id} · Piso 2`, `<p><strong>${esc(r.status)} · Conteo registrado: ${occupancy(s, r.id)}/${r.capacity} plazas</strong></p><div class="stack">${["Disponible", "Lleno", "En peligro"].map((status) => btn("refugeStatus", status === "Disponible" ? "Marcar como Disponible" : `Marcar ${status}`, { kind: "outline", hu: "HU-39", payload: { id: r.id, status } })).join("")}</div>`, r.status === "En peligro" ? "danger-panel" : r.status === "Lleno" ? "warning-panel" : "")).join("")}${s.route.notice ? `<p class="tag">${esc(s.route.notice)}</p>` : ""}`,
      };
    case "brigadas":
      return {
        title: "Brigadistas por sector",
        hu: "HU-41",
        body: `${map(s)}${panel("Cobertura por sector", s.brigadiers.map((b) => `<form class="stack" data-sector-form="${b.id}"><h3>${esc(b.name)} · ${brigadeLabels[b.status]}</h3><label class="field" for="sector-${b.id}">Sector de patrullaje<select id="sector-${b.id}" name="sector">${s.sectors.map((x) => `<option ${x.name === b.sector ? "selected" : ""}>${x.name}</option>`).join("")}</select></label><button class="btn outline" type="submit">Actualizar sector de ${esc(b.name)}</button></form>`).join(""))}${controls("brigade-controls", btn("disconnect", "Cambiar disponibilidad de José · 30 s", { kind: "outline", hu: "HU-41" }))}`,
      };
    case "censo":
      return {
        title: "Usuarios y censo",
        hu: "HU-31 HU-37",
        body: `${panel("Censo activo del edificio", `<p>Personal fijo de demostración: 60. El total y los visitantes se actualizan en esta sesión y se muestran debajo.</p><h3>Último visitante previo · Pablo Ruiz</h3><p>Registro previo 09:50 · Recepción Edificio B<br>Necesidad: Indicaciones visuales.</p>${go("visitante", "Ver censo tras nuevo ingreso · Muestra", "")}${go("solicitudes", "Consultar solicitudes")}`)}<div class="stack"><p class="muted">Personas en el edificio</p><p class="eta" style="color:var(--ink)">${s.people.length}</p><p class="muted">Visitantes registrados</p><p class="eta" style="color:var(--ink)">${s.people.filter((p) => p.visitor).length}</p></div><div class="panel table-wrap"><table class="data-table"><caption>Personas registradas</caption><thead><tr><th scope="col">Persona</th><th scope="col">Ubicación</th><th scope="col">Estado</th><th scope="col">Necesidades</th></tr></thead><tbody>${s.people.map((p) => `<tr><th scope="row">${esc(p.name)}</th><td>${p.building} · Piso ${p.floor} · ${esc(p.sector)}</td><td>${statuses[p.status]}</td><td>${esc(p.needs.join(" · ") || "Sin necesidad indicada")}</td></tr>`).join("")}</tbody></table></div>`,
      };
    case "roles":
      return {
        title: "Roles y permisos",
        body: `${panel("Matriz de roles del prototipo", "<p>Usuario: perfil de accesibilidad, alertas, ruta y SOS.<br>Brigadista: misiones, PPE autorizado, Push-To-Talk y despeje.<br>Administrador: dashboard operativo, alertas, solicitudes, zonas y censo.<br>Visitante: registro mediante QR y orientación básica.</p>")}${go("admin", "Volver al dashboard")}`,
      };
    case "evento":
      return {
        title: "Evento de sensor",
        hu: "HU-42",
        body: `${panel("Detección de incendio · Piso 2", "<p>Sector norte resaltado en el plano. Evento de prueba activado manualmente.</p>", "danger-panel")}${map(s)}${go("emitir", "Revisar y emitir alerta de incendio", "")}${go("admin", "Volver al dashboard")}`,
      };
    case "externos":
      return {
        title: "Servicios externos",
        hu: "HU-45",
        body: `${panel("Aviso a Bomberos / SAMU", `<p>Edificio B · Piso 2<br>Paquete: plano de acceso + ubicaciones internas y resumen del censo.</p><p>El paquete se preparará en este entorno. No se enviará a Bomberos, SAMU ni a otros servicios externos.</p>${btn("external", "Preparar paquete", { hu: "HU-45" })}`)}${s.external ? panel(`Estado: ${productText(s.external.status)}`, `<p>Tipo de emergencia: ${esc(s.external.event)}<br>Sector: ${esc(s.external.sector)}<br>En riesgo: ${s.external.summary.risk} · Evacuando: ${s.external.summary.evacuating} · En refugio: ${s.external.summary.refuge} · Evacuados: ${s.external.summary.safe}</p><p>Paquete preparado para revisión. No se ha realizado ningún envío externo.</p>`, "info") : ""}${go("reporte", "Consultar auditoría")}`,
      };
    case "reporte": {
      const finished = s.missions.filter((m) => m.status === "completed");
      return {
        title: "Historial y reportes",
        hu: "HU-40 HU-45",
        body: `${panel(`SIM-2026-11 · ${s.closed ? "Emergencia finalizada" : "Emergencia en curso"}`, `<p>${c.risk} en riesgo · ${c.evacuating} evacuando · ${c.refuge} en refugio · ${c.safe} evacuados.<br>Total: ${s.people.length} personas. Paquete de servicios externos: ${productText(s.external?.status || "No preparado")}.</p>`)}${panel("Resumen de respuesta", `<p>Rescates completados: ${finished.length}<br>Porcentaje de evacuación: ${Math.round((c.safe / s.people.length) * 100)} %</p><div class="report-bar" role="img" aria-label="${c.safe} de ${s.people.length} personas evacuadas"><span style="width:${(c.safe / s.people.length) * 100}%"></span></div>${finished.map((m) => `<p>${m.id}: ${Math.round((m.completedAt - m.assignedAt) / 1000)} s en esta sesión. Referencia: 5 min.</p>`).join("")}${note("Tiempos registrados en el entorno de prueba.")}`)}${panel("Desglose por sector y accesibilidad", `<p>${s.sectors.map((x) => `${x.name}: ${s.people.filter((p) => p.sector === x.name).length} personas · ${x.cleared ? "Sector despejado" : "Pendiente de despeje"}`).join("<br>")}</p><p>${["Discapacidad auditiva", "Discapacidad visual", "Movilidad reducida"].map((n) => `${n}: ${s.people.filter((p) => p.needs.includes(n)).length}`).join("<br>")}</p>`)}${btn("csv", "Descargar reporte CSV", { hu: "HU-40" })}${btn("print", "Imprimir / Guardar como PDF desde el navegador", { kind: "outline", hu: "HU-40" })}${btn("closeDialog", "Finalizar evento y expirar paquete externo", { kind: "outline", hu: "HU-45" })}${panel("Auditoría de la sesión", s.events.length ? `<ol class="stack">${s.events.map((e) => `<li><time datetime="${new Date(e.at).toISOString()}">${new Date(e.at).toLocaleTimeString("es-PE", { timeZone: "America/Lima" })}</time> · ${esc(e.actor)} · ${esc(productText(e.detail))}</li>`).join("")}</ol>` : "<p>Aún no se registran acciones. Las acciones que realices aparecerán aquí.</p>")}`,
      };
    }
    default:
      return null;
  }
}
