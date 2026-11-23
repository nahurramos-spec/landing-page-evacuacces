export const STORAGE_KEY = "evacuaccess-demo-v1";
export const statuses = {
  risk: "En riesgo",
  evacuating: "Evacuando",
  refuge: "En refugio",
  safe: "Evacuados",
};
export function initialState() {
  const people = Array.from({ length: 65 }, (_, i) => ({
    id: `P${i + 1}`,
    name:
      i === 0
        ? "María López"
        : i === 1
          ? "Persona asignada"
          : i === 2
            ? "Persona con discapacidad visual"
            : i === 64
              ? "Pablo Ruiz"
              : `Persona de muestra ${i + 1}`,
    status: i < 3 ? "risk" : i < 15 ? "evacuating" : i < 20 ? "refuge" : "safe",
    building: i === 2 ? "C" : "B",
    floor: i === 1 ? 1 : i === 2 ? 0 : i < 50 ? 2 : 0,
    sector: i < 48 ? "Norte" : "Sur",
    location: i === 0 ? "Aula 204" : i === 1 ? "Pasillo" : "Sector de muestra",
    needs:
      i === 0
        ? ["Discapacidad auditiva", "Movilidad reducida"]
        : i === 1
          ? ["Movilidad reducida"]
          : i === 2
            ? ["Discapacidad visual"]
            : [],
    channel: i === 0 ? "Texto y gestos" : "Texto",
    refuge: i >= 15 && i < 18 ? "A" : i >= 18 && i < 20 ? "B" : null,
    priority: false,
    visitor: i >= 60,
  }));
  return {
    version: 1,
    role: "usuario",
    entry: "general",
    prefs: {
      contrast: false,
      text: 100,
      voice: false,
      haptic: false,
      needs: [],
    },
    alert: {
      active: true,
      event: "Sismo",
      scope: "Todo el edificio",
      confirmed: false,
    },
    route: { step: 2, destination: "Patio norte", blocked: false, notice: "" },
    ppe: { pace: 0.6, distance: 80, margin: 5 },
    selectedRefuge: "A",
    obstacles: [],
    sos: [
      {
        id: "R-014",
        personId: "P1",
        status: "pending",
        createdAt: Date.now(),
        assigned: null,
      },
      {
        id: "R-015",
        personId: "P2",
        status: "pending",
        createdAt: Date.now(),
        assigned: null,
      },
      {
        id: "R-016",
        personId: "P3",
        status: "pending",
        createdAt: Date.now(),
        assigned: null,
      },
    ],
    messages: [],
    people,
    brigadiers: [
      {
        id: "B1",
        name: "Luis Paredes",
        badge: "BR-001",
        status: "available",
        sector: "Norte",
        floor: 2,
        distance: 24,
        eta: 2,
        signs: true,
        photo: "assets/images/luis.png",
      },
      {
        id: "B2",
        name: "Carla Núñez",
        badge: "BR-002",
        status: "available",
        sector: "Norte",
        floor: 2,
        distance: 38,
        eta: 3,
        signs: true,
        photo: "assets/images/carla.png",
      },
      {
        id: "B3",
        name: "Ana Ríos",
        badge: "BR-003",
        status: "mission",
        sector: "Sur",
        floor: 1,
        distance: 60,
        eta: 4,
        signs: false,
      },
      {
        id: "B4",
        name: "José Díaz",
        badge: "BR-004",
        status: "offline",
        sector: "Este",
        floor: 2,
        distance: 70,
        eta: 5,
        signs: false,
      },
    ],
    missions: [],
    sectors: [
      { name: "Norte", cleared: false, hazard: false },
      { name: "Sur", cleared: false, hazard: false },
      { name: "Este", cleared: false, hazard: false },
    ],
    refuges: [
      { id: "A", capacity: 8, status: "Disponible", distance: 24 },
      { id: "B", capacity: 6, status: "Disponible", distance: 38 },
    ],
    sensors: [],
    events: [],
    external: null,
    closed: false,
    online: true,
  };
}
export const counts = (s) =>
  Object.fromEntries(
    Object.keys(statuses).map((k) => [
      k,
      s.people.filter((p) => p.status === k).length,
    ]),
  );
export const occupancy = (s, id) =>
  s.people.filter((p) => p.refuge === id && p.status === "refuge").length;
export const refugeAvailable = (s, r) =>
  r.status === "Disponible" && occupancy(s, r.id) < r.capacity;
export const eta = (s) =>
  Math.max(1, Math.round(s.ppe.distance / s.ppe.pace / 60));
export function validate(s) {
  if (s.people.length !== Object.values(counts(s)).reduce((a, b) => a + b, 0))
    throw Error("Censo inconsistente");
  if (new Set(s.people.map((p) => p.id)).size !== s.people.length)
    throw Error("Persona duplicada");
  for (const r of s.refuges)
    if (occupancy(s, r.id) > r.capacity) throw Error("Aforo excedido");
  for (const m of s.missions)
    if (
      !s.sos.some((r) => r.id === m.requestId) ||
      !s.people.some((p) => p.id === m.personId)
    )
      throw Error("Misión sin solicitud");
  return true;
}
export function transition(current, action, payload = {}) {
  const s = structuredClone(current),
    p = s.people[0];
  let result = "Cambios guardados";
  const req = (id) => {
    const r = s.sos.find((x) => x.id === id);
    if (!r) throw Error("Solicitud no encontrada");
    return r;
  };
  const reroute = () => {
    const r = s.refuges.find((x) => x.id === s.selectedRefuge);
    if (!r || !refugeAvailable(s, r)) {
      const next = s.refuges.find((x) => refugeAvailable(s, x));
      s.selectedRefuge = next?.id ?? null;
      s.route.destination = next ? `Refugio ${next.id}` : "Esperar asistencia";
      s.route.notice = next
        ? `Ruta recalculada hacia Refugio ${next.id}`
        : "No hay refugios disponibles. Solicita asistencia.";
    } else if (s.route.blocked) s.route.destination = `Refugio ${r.id}`;
  };
  switch (action) {
    case "entry":
      s.entry = payload.entry;
      s.role = payload.role;
      if (payload.entry === "visual") s.prefs.contrast = true;
      if (["auditiva", "movilidad"].includes(payload.entry))
        s.prefs.needs = [
          payload.entry === "auditiva"
            ? "Discapacidad auditiva"
            : "Movilidad reducida",
        ];
      if (payload.role === "brigadista" && !s.missions.length) {
        const r = req("R-014");
        if (r.status === "pending") {
          r.assigned = "B1";
          r.status = "assigned";
          s.brigadiers[0].status = "mission";
          s.missions.push({
            id: r.id,
            requestId: r.id,
            personId: r.personId,
            brigadierId: "B1",
            status: "assigned",
            assignedAt: Date.now(),
          });
        }
      }
      break;
    case "preferences":
      s.prefs = { ...s.prefs, ...payload };
      p.needs = [...s.prefs.needs];
      result = "Preferencias guardadas y aplicadas";
      break;
    case "contrast":
      s.prefs.contrast = !s.prefs.contrast;
      result = s.prefs.contrast
        ? "Alto contraste activado"
        : "Modo estándar activado";
      break;
    case "text":
      s.prefs.text = Number(payload.value);
      break;
    case "ppe":
      if (!(payload.pace >= 0.1 && payload.pace <= 1.5))
        throw Error("Elige un ritmo entre 0,1 y 1,5 m/s");
      s.ppe.pace = Number(payload.pace);
      result = `PPE guardado. Tiempo estimado: ${eta(s)} min`;
      break;
    case "confirmAlert":
      if (!s.alert.active) throw Error("No hay alerta activa");
      s.alert.confirmed = true;
      if (p.status === "risk") p.status = "evacuating";
      result = "Alerta confirmada. Estado: Evacuando";
      break;
    case "nextStep":
      s.route.step = Math.min(4, s.route.step + 1);
      result = `Paso ${s.route.step} de 4`;
      break;
    case "block":
      s.route.blocked = true;
      s.obstacles = ["Ascensor 1 bloqueado", "Ascensor 2 bloqueado"];
      s.route.destination = `Refugio ${s.selectedRefuge || "A"}`;
      reroute();
      s.route.notice = `Ruta recalculada: ${s.route.destination}, mismo nivel y sin escaleras`;
      result = s.route.notice;
      break;
    case "elevator":
      if (s.route.blocked)
        throw Error(
          "Ascensores 1 y 2 bloqueados. Usa el desvío al refugio del mismo nivel.",
        );
      result =
        "Trayecto de ascensor consultado; ruta recomendada sin escaleras disponible";
      break;
    case "sos": {
      if (p.status === "safe")
        throw Error(
          "La persona ya está a salvo. Restablece el entorno para iniciar otra evacuación.",
        );
      const r = req("R-014");
      if (r.status === "rescued") throw Error("Rescate ya registrado");
      if (r.assigned) {
        result = "Solicitud ya asignada. Consulta al brigadista";
        break;
      }
      r.status = payload.fail ? "failed" : "pending";
      r.sentAt = Date.now();
      result = payload.fail
        ? "No se pudo enviar. Solicitud conservada para reintentar."
        : "Solicitud registrada · Edificio B · Piso 2 · Aula 204";
      break;
    }
    case "gestures":
      p.channel = "Comunicación gestual / señas";
      if (!p.needs.includes("Comunicación gestual / señas"))
        p.needs.push("Comunicación gestual / señas");
      result =
        "Necesidad registrada. Se prioriza personal con comunicación en lengua de señas";
      break;
    case "card":
      p.needCard = payload.message;
      result = `Necesidad enviada: ${payload.message}`;
      break;
    case "network":
      s.online = !s.online;
      result = s.online
        ? "Conexión restablecida; puedes reintentar mensajes pendientes"
        : "Sin conexión";
      break;
    case "message":
      if (!payload.text?.trim()) throw Error("Escribe un mensaje");
      s.messages.push({
        id: `MSG-${s.messages.length + 1}`,
        text: payload.text.trim().slice(0, 500),
        sender: s.role,
        status: s.online ? "sent" : "pending",
        at: Date.now(),
      });
      result = s.online
        ? "Mensaje enviado en esta sesión"
        : "Mensaje pendiente. Reintenta al recuperar la conexión";
      break;
    case "retryMessage": {
      const m = s.messages.find((x) => x.id === payload.id);
      if (!m) throw Error("Mensaje no encontrado");
      if (!s.online)
        throw Error("Sin conexión. Restablécela antes de reintentar");
      m.status = "sent";
      result = "Mensaje enviado";
      break;
    }
    case "refuge": {
      const r = s.refuges.find((x) => x.id === payload.id);
      if (!r || !refugeAvailable(s, r))
        throw Error("Refugio no disponible. Elige la alternativa indicada");
      s.selectedRefuge = r.id;
      s.route.destination = `Refugio ${r.id}`;
      result = `Ruta actualizada hacia Refugio ${r.id}`;
      break;
    }
    case "refugeStatus": {
      const r = s.refuges.find((x) => x.id === payload.id);
      if (!r || !["Disponible", "Lleno", "En peligro"].includes(payload.status))
        throw Error("Estado de refugio no válido");
      r.status = payload.status;
      reroute();
      result = `Refugio ${r.id}: ${r.status}. ${s.route.notice}`;
      break;
    }
    case "arrive": {
      if (p.status === "safe") {
        result = "Llegada ya registrada";
        break;
      }
      if (payload.refuge) {
        const r = s.refuges.find((x) => x.id === s.selectedRefuge);
        if (!r || !refugeAvailable(s, r))
          throw Error("El refugio no está disponible. Consulta la alternativa");
        if (p.status === "refuge" && p.refuge === r.id) {
          result = "Llegada ya registrada";
          break;
        }
        p.status = "refuge";
        p.refuge = r.id;
        result = `Llegada confirmada en Refugio ${r.id}`;
      } else {
        p.status = "safe";
        p.refuge = null;
        result = "Estás a salvo · Llegada confirmada";
        for (const m of s.missions.filter(
          (x) => x.personId === p.id && x.status !== "completed",
        )) {
          m.status = "completed";
          m.completedAt = Date.now();
          req(m.requestId).status = "rescued";
        }
        const r = req("R-014");
        r.status = "rescued";
      }
      break;
    }
    case "assign": {
      const r = req(payload.requestId || "R-014");
      if (["rescued", "failed"].includes(r.status))
        throw Error("La solicitud no está pendiente de atención");
      const b = s.brigadiers.find((x) => x.id === payload.brigadierId);
      if (
        !b ||
        b.status === "offline" ||
        (b.status === "mission" && r.assigned !== b.id && !payload.queue)
      )
        throw Error("Brigadista no disponible. Selecciona otra persona");
      if (r.assigned && r.assigned !== b.id) {
        const old = s.brigadiers.find((x) => x.id === r.assigned);
        if (
          old &&
          !s.missions.some(
            (m) =>
              m.brigadierId === old.id &&
              m.requestId !== r.id &&
              m.status !== "completed",
          )
        )
          old.status = "available";
      }
      r.assigned = b.id;
      r.status = "assigned";
      b.status = "mission";
      let m = s.missions.find((x) => x.requestId === r.id);
      if (m) {
        m.brigadierId = b.id;
        m.status = "assigned";
      } else
        s.missions.push({
          id: r.id,
          requestId: r.id,
          personId: r.personId,
          brigadierId: b.id,
          status: "assigned",
          assignedAt: Date.now(),
        });
      result = `${r.id}: ${b.name} asignado · ETA ${b.eta} min`;
      break;
    }
    case "accept": {
      const m = s.missions.find((x) => x.id === payload.id);
      if (!m || m.status === "completed")
        throw Error("No hay misión activa que aceptar");
      m.status = "accepted";
      result = "Misión aceptada";
      break;
    }
    case "rescue": {
      const ids = [...new Set(payload.ids || [])];
      if (!ids.length) throw Error("Selecciona al menos una misión");
      let done = 0;
      for (const id of ids) {
        const m = s.missions.find((x) => x.id === id);
        if (!m) throw Error("El rescate requiere una misión asignada");
        if (m.status === "completed") continue;
        const person = s.people.find((x) => x.id === m.personId);
        person.status = "safe";
        person.refuge = null;
        m.status = "completed";
        m.completedAt = Date.now();
        req(m.requestId).status = "rescued";
        done++;
      }
      for (const b of s.brigadiers)
        if (
          b.status === "mission" &&
          !s.missions.some(
            (m) => m.brigadierId === b.id && m.status !== "completed",
          ) &&
          b.id !== "B3"
        )
          b.status = "available";
      result = done
        ? `Rescate registrado: ${done} persona${done === 1 ? "" : "s"}. Censo actualizado.`
        : "Los rescates ya estaban registrados";
      break;
    }
    case "sectorAssign": {
      const b = s.brigadiers.find((x) => x.id === payload.id);
      if (!b || !s.sectors.some((x) => x.name === payload.sector))
        throw Error("Sector no válido");
      b.sector = payload.sector;
      result = `${b.name}: sector ${b.sector}`;
      break;
    }
    case "brigadierStatus": {
      const b = s.brigadiers.find((x) => x.id === payload.id);
      if (
        !b ||
        !["available", "offline"].includes(payload.status) ||
        s.missions.some(
          (m) => m.brigadierId === b.id && m.status !== "completed",
        )
      )
        throw Error("Reasigna sus misiones antes de cambiar su disponibilidad");
      b.status = payload.status;
      result = "Disponibilidad actualizada";
      break;
    }
    case "sensor":
      s.sensors.push({
        event: "Incendio",
        floor: 2,
        sector: "Norte",
        at: Date.now(),
      });
      s.sectors[0].hazard = true;
      result = "Sensor de prueba: incendio en Piso 2 · Sector norte";
      break;
    case "priority":
      p.priority = true;
      result =
        "Prioridad 1: María López · 120 s sin movimiento / pérdida de señal de prueba";
      break;
    case "emit":
      if (
        !["Sismo", "Incendio", "Simulacro"].includes(payload.event) ||
        !["Todo el edificio", "Piso 2"].includes(payload.scope)
      )
        throw Error("Revisa evento y alcance");
      s.alert = {
        active: true,
        event: payload.event,
        scope: payload.scope,
        confirmed: false,
      };
      s.closed = false;
      result = `Alerta registrada sin transmisión real: ${payload.event} · ${payload.scope} · ${payload.scope === "Piso 2" ? s.people.filter((x) => x.floor === 2 && x.building === "B").length : s.people.length} personas del entorno`;
      break;
    case "clearSector": {
      if (payload.value !== 100 || payload.confirm !== true)
        throw Error("Desliza hasta el final y confirma la verificación");
      const sector = s.sectors.find((x) => x.name === payload.sector);
      if (!sector) throw Error("Sector no encontrado");
      if (s.people.some((x) => x.sector === sector.name && x.status !== "safe"))
        throw Error(
          "Hay personas pendientes en el sector. Completa su evacuación antes del despeje",
        );
      sector.cleared = true;
      result = "Sector despejado";
      break;
    }
    case "sectorArrival": {
      if (payload.confirm !== true)
        throw Error("Confirma las llegadas observadas de prueba");
      if (
        s.people.some(
          (p) => p.sector === payload.sector && p.status === "risk",
        ) ||
        s.missions.some(
          (m) =>
            m.status !== "completed" &&
            s.people.find((p) => p.id === m.personId)?.sector ===
              payload.sector,
        )
      )
        throw Error(
          "Completa primero las misiones de rescate y las personas en riesgo de este sector",
        );
      let n = 0;
      for (const p of s.people.filter(
        (p) => p.sector === payload.sector && p.status !== "safe",
      )) {
        p.status = "safe";
        p.refuge = null;
        n++;
      }
      result = `Llegadas de prueba registradas: ${n} · Sector ${payload.sector}`;
      break;
    }
    case "external":
      s.external = {
        event: s.alert.event,
        sector: "Edificio B · Piso 2",
        summary: counts(s),
        status: s.closed ? "Expirado" : "Preparado · Sin enviar",
        at: Date.now(),
      };
      result = s.closed
        ? "Evento cerrado. Paquete expirado"
        : "Paquete preparado. No se ha realizado ningún envío externo";
      break;
    case "close":
      s.closed = true;
      s.alert.active = false;
      if (s.external) s.external.status = "Expirado";
      result =
        "Evento finalizado. Paquete externo expirado. Reporte actualizado con el censo real de la sesión";
      break;
    case "visitor": {
      if (!payload.name?.trim() || !payload.destination?.trim())
        throw Error("Completa nombre y destino");
      if (s.people.some((x) => x.visitorKey === payload.key))
        throw Error("Este ingreso ya fue registrado");
      s.people.push({
        id: `P${s.people.length + 1}`,
        name: payload.name.trim().slice(0, 60),
        status: "evacuating",
        building: "B",
        floor: 2,
        sector: "Norte",
        location: payload.destination.trim().slice(0, 80),
        needs: payload.needs ? [payload.needs] : [],
        channel: "Texto",
        refuge: null,
        visitor: true,
        visitorKey: payload.key,
      });
      result = "Ingreso registrado. Censo actualizado";
      break;
    }
    case "visitorSafe": {
      const visitor = [...s.people].reverse().find((p) => p.visitorKey);
      if (!visitor) throw Error("Registra primero una visita");
      visitor.status = "safe";
      visitor.refuge = null;
      result = `${visitor.name}: llegada a zona segura confirmada`;
      break;
    }
    default:
      throw Error("Acción desconocida");
  }
  for (const b of s.brigadiers)
    if (
      b.status === "mission" &&
      ["B1", "B2"].includes(b.id) &&
      !s.missions.some(
        (m) => m.brigadierId === b.id && m.status !== "completed",
      )
    )
      b.status = "available";
  validate(s);
  s.events.push({
    id: s.events.length + 1,
    action,
    detail: result,
    at: Date.now(),
    actor: s.role,
  });
  return { state: s, result };
}
export function loadState(storage = globalThis.localStorage) {
  try {
    const s = JSON.parse(storage.getItem(STORAGE_KEY));
    if (s?.version === 1) {
      validate(s);
      // Mantener las sesiones anteriores al traslado de los recursos visuales.
      const movedPhotos = {
        "assets/luis.png": "assets/images/luis.png",
        "assets/carla.png": "assets/images/carla.png",
      };
      for (const brigadier of s.brigadiers)
        if (movedPhotos[brigadier.photo])
          brigadier.photo = movedPhotos[brigadier.photo];
      return s;
    }
  } catch {}
  return initialState();
}
export function saveState(s, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}
export function reportCSV(s) {
  const rows = [
    [
      "Tipo",
      "Identificador",
      "Nombre / Acción",
      "Edificio / Actor",
      "Piso",
      "Sector",
      "Estado",
      "Necesidades / Detalle",
      "Fecha ISO",
    ],
    ...s.people.map((p) => [
      "Persona",
      p.id,
      p.name,
      p.building,
      p.floor,
      p.sector,
      statuses[p.status],
      p.needs.join("; "),
      "",
    ]),
    ...s.missions.map((m) => [
      "Misión",
      m.id,
      m.brigadierId,
      "B",
      "",
      "",
      m.status,
      `${m.completedAt ? Math.round((m.completedAt - m.assignedAt) / 1000) : 0} s transcurridos en sesión`,
      "",
    ]),
    ...s.events.map((e) => [
      "Evento",
      e.id,
      e.action,
      e.actor,
      "",
      "",
      "",
      e.detail,
      new Date(e.at).toISOString(),
    ]),
  ];
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((v) => '"' + String(v ?? "").replace(/"/g, '""') + '"')
          .join(","),
      )
      .join("\r\n")
  );
}
