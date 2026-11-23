import {
  esc,
  btn,
  go,
  panel,
  note,
  check,
  missionLabels,
  controls,
} from "./ui.js";
import { map } from "./map.js";
export function brigadeView(view, s) {
  const current = s.missions.find(
      (m) => m.id === (s.selectedMission || "R-014"),
    ),
    p = current ? s.people.find((p) => p.id === current.personId) : s.people[0];
  switch (view) {
    case "misiones":
      return {
        title: "Misiones de rescate",
        hu: "HU-34 HU-37",
        body: `<p>${s.sos.filter((r) => r.status !== "rescued").length} solicitudes activas · ${s.alert.event}</p>${s.sos
          .map((r) => {
            const m = s.missions.find((x) => x.requestId === r.id),
              b = s.brigadiers.find((x) => x.id === r.assigned),
              p = s.people.find((x) => x.id === r.personId);
            return panel(
              `${r.id} · ${m ? missionLabels[m.status] : "Pendiente"}`,
              `<p>${esc(p.name)} · Edificio ${p.building} · Piso ${p.floor} · ${esc(p.location)}<br>${esc(p.needs.join(" · "))}${b ? `<br>Asignado a ${esc(b.name)}` : ""}</p>${m ? btn("openMission", m.status === "assigned" ? `Aceptar misión ${r.id}` : `Ver misión ${r.id}`, { payload: { id: r.id }, hu: "HU-37" }) : btn("queueMission", "Aceptar solicitud", { kind: "outline", payload: { id: r.id }, hu: "HU-37", disabled: r.status === "failed" || r.status === "rescued" })}`,
            );
          })
          .join(
            "",
          )}${go("masivo", "Selección de rescate múltiple")}${go("mapa-brigada", "Mapa operativo y sectores")}${go("sector", "Sector / Piso despejado")}${go("chat", "Chat rápido de emergencia")}`,
      };
    case "mision":
      return {
        title: `Rescate ${current?.id || "R-014"}`,
        hu: "HU-36 HU-37",
        body: current
          ? `${panel(`${p.name} · ${current.id}`, `<p>${esc(p.needs.join(" · ") || "Necesidades no indicadas")}<br>Ubicación: Edificio ${p.building}, Piso ${p.floor}, ${esc(p.location)}<br>Destino: ${esc(s.route.destination)}, punto de encuentro.</p>${p.needCard ? `<p><strong>Necesidad comunicada:</strong> ${esc(p.needCard)}</p>` : ""}${current.status === "completed" ? '<p class="safe-text">Rescate registrado</p>' : ""}`)}${panel("Comunicación accesible", `<p>${esc(p.channel)}. No usa audio como canal principal. Evitar destellos por sensibilidad visual secundaria.</p>`, "info")}${panel("Plan de evacuación · PPE", `<p>Silla manual · Sin escaleras · Paso ≥ 90 cm<br>Requiere asistencia de movilidad.<br>Ritmo de referencia: ${String(s.ppe.pace).replace(".", ",")} m/s.</p>`)}${go("protocolo", "Consultar protocolo")}${btn("rescueDialog", "Marcar como Rescatado", { hu: "HU-37", payload: { ids: [current.id] }, disabled: current.status === "completed" })}${go("chat", "Abrir chat de emergencia")}${go("comunicar", "Mostrar tarjetas de comunicación")}`
          : panel(
              "Sin misión asignada",
              `<p>Selecciona una misión para consultar sus necesidades y registrar el rescate.</p>${go("misiones", "Volver a misiones")}`,
            ),
      };

    case "protocolo":
      return {
        title: "Manual de transferencia",
        hu: "HU-43",
        body: `${panel("Protocolo no disponible", "<p>No se ha incorporado un protocolo de transferencia validado por profesionales.</p><p>Se requiere un documento profesional aprobado para habilitar este manual.</p>", "info")}${go("mision", "Volver a la misión")}`,
      };
    case "masivo":
      return {
        title: "Selección de rescate múltiple",
        hu: "HU-37",
        body: `<p>Selecciona las misiones cuya llegada a zona segura vas a confirmar.</p><form id="mass-rescue" class="stack">${
          s.missions
            .filter((m) => m.status !== "completed")
            .map((m) =>
              check(
                m.id,
                `${s.people.find((p) => p.id === m.personId).name} · ${m.id}`,
              ),
            )
            .join("") ||
          "<p>No hay misiones activas. Acepta una solicitud desde Misiones.</p>"
        }<button class="btn" type="submit" ${!s.missions.some((m) => m.status !== "completed") ? "disabled" : ""}>Revisar rescates seleccionados</button></form>${go("misiones", "Cancelar selección")}`,
      };
    case "sector":
      return {
        title: "Sector / Piso despejado",
        hu: "HU-47",
        body: `${panel("¿Sector totalmente evacuado?", `<p>Confirma únicamente después de verificar el sector. El deslizador evita una marcación accidental.</p><form id="clear-sector" class="stack"><label class="field" for="clear-sector-name">Sector<select id="clear-sector-name" name="sector">${s.sectors.map((x) => `<option>${x.name}</option>`).join("")}</select></label><label class="field" for="clear-slider">Desliza para confirmar despeje<input id="clear-slider" name="slider" type="range" min="0" max="100" step="10" value="0" aria-valuetext="0 %, pendiente de confirmación"></label><output id="slider-value" for="clear-slider">0 % · Usa también las flechas o Fin del teclado.</output>${check("verified", "He verificado que no quedan personas pendientes")}<button class="btn success" type="submit">Confirmar despeje del sector</button></form><p>Se verifica el censo antes del despeje. Las personas pendientes deben completar su evacuación.</p>`)}${s.sectors.map((x) => `<p class="${x.cleared ? "safe-text" : "muted"}"><strong>${x.name}: ${x.cleared ? "Sector despejado" : "Pendiente"}</strong></p>`).join("")}${go("misiones", "Cancelar")}`,
      };
    case "mapa-brigada":
      return {
        title: "Mapa operativo de brigada",
        hu: "HU-32 HU-44",
        body: `${map(s)}${panel("Localización prioritaria", `<p>María López · Edificio B · Piso 2 · Aula 204<br>Auditiva + motora · ${s.people[0].priority ? "120 s sin movimiento · Señal pendiente" : "Solicitud SOS"}</p>`)}${go("mision", "Consultar necesidad de la persona")}${controls("brigade-priority-controls", btn("priority", "Marcar sin movimiento o sin señal", { kind: "outline", hu: "HU-44" }))}`,
      };
    default:
      return null;
  }
}
