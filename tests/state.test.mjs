import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  transition,
  counts,
  occupancy,
  eta,
  validate,
  loadState,
  saveState,
  reportCSV,
  STORAGE_KEY,
} from "../js/state.js";
const apply = (s, a, p) => transition(s, a, p).state;
test("Las sesiones anteriores conservan datos al trasladar los retratos", () => {
  const previous = apply(initialState(), "confirmAlert");
  previous.brigadiers[0].photo = "assets/luis.png";
  previous.brigadiers[1].photo = "assets/carla.png";
  const expected = structuredClone(previous);
  expected.brigadiers[0].photo = "assets/images/luis.png";
  expected.brigadiers[1].photo = "assets/images/carla.png";
  const loaded = loadState({ getItem: key => key === STORAGE_KEY ? JSON.stringify(previous) : null });
  assert.deepEqual(loaded, expected);
  assert.equal(previous.brigadiers[0].photo, "assets/luis.png");
});
test("Censo inicial oficial: 65 = 3 + 12 + 5 + 45; ocupación A 3/8 y B 2/6", () => {
  const s = initialState();
  assert.deepEqual(counts(s), { risk: 3, evacuating: 12, refuge: 5, safe: 45 });
  assert.equal(occupancy(s, "A"), 3);
  assert.equal(occupancy(s, "B"), 2);
  assert.ok(validate(s));
});
test("Siete puntos de entrada conservan el censo y el rol", () => {
  for (const [entry, role] of [
    ["general", "usuario"],
    ["auditiva", "usuario"],
    ["visual", "usuario"],
    ["movilidad", "usuario"],
    ["brigadista", "brigadista"],
    ["admin", "admin"],
    ["visitante", "visitante"],
  ]) {
    const s = apply(initialState(), "entry", { entry, role });
    assert.equal(s.role, role);
    assert.equal(s.people.length, 65);
  }
});
test("HU-02,03,06: confirmación sin audio; estado evacuando y sin doble conteo", () => {
  let s = apply(initialState(), "confirmAlert");
  assert.equal(s.alert.confirmed, true);
  assert.equal(s.people[0].status, "evacuating");
  s = apply(s, "confirmAlert");
  assert.deepEqual(counts(s), { risk: 2, evacuating: 13, refuge: 5, safe: 45 });
});
test("HU-05: preferencias persistentes y recuperación ante almacenamiento corrupto", () => {
  let value = "",
    store = {
      getItem: () => value,
      setItem: (k, v) => {
        value = v;
      },
    };
  const s = apply(initialState(), "preferences", {
    contrast: true,
    text: 200,
    needs: ["Discapacidad visual"],
  });
  assert.ok(saveState(s, store));
  assert.equal(loadState(store).prefs.contrast, true);
  assert.equal(loadState(store).prefs.text, 200);
  value = "{no";
  assert.equal(loadState(store).people.length, 65);
  assert.equal(
    saveState(s, {
      setItem() {
        throw Error();
      },
    }),
    false,
  );
});
test("HU-07,17,18: progreso, exclusión de ascensores y desvío mismo nivel", () => {
  let s = apply(initialState(), "nextStep");
  assert.equal(s.route.step, 3);
  s = apply(s, "block");
  assert.equal(s.obstacles.length, 2);
  assert.equal(s.route.destination, "Refugio A");
  assert.throws(() => apply(s, "elevator"), /bloqueados/);
});
test("HU-08,12,36: necesidad, canal y tarjeta compartidos con ficha brigadista", () => {
  let s = apply(initialState(), "gestures");
  s = apply(s, "card", { message: "No puedo caminar" });
  assert.match(s.people[0].channel, /señas/);
  assert.equal(s.people[0].needCard, "No puedo caminar");
  assert.ok(s.brigadiers[0].signs);
});
test("HU-10: llegada a refugio y salida segura idempotentes", () => {
  let s = apply(initialState(), "arrive", { refuge: true });
  assert.equal(occupancy(s, "A"), 4);
  s = apply(s, "arrive", { refuge: true });
  assert.equal(occupancy(s, "A"), 4);
  s = apply(s, "arrive");
  s = apply(s, "arrive");
  assert.equal(counts(s).safe, 46);
  assert.equal(occupancy(s, "A"), 3);
});
test("HU-21: fallo de SOS, reintento y ausencia de solicitudes duplicadas", () => {
  let s = apply(initialState(), "sos", { fail: true });
  assert.equal(s.sos[0].status, "failed");
  s = apply(s, "sos");
  assert.equal(s.sos[0].status, "pending");
  assert.equal(s.sos.length, 3);
});
test("HU-24,34: asignación, falta de disponibilidad y reasignación coherente", () => {
  let s = apply(initialState(), "assign", { brigadierId: "B1" });
  assert.equal(s.sos[0].assigned, "B1");
  assert.throws(
    () => apply(s, "assign", { requestId: "R-015", brigadierId: "B1" }),
    /no disponible/,
  );
  assert.throws(
    () => apply(s, "assign", { brigadierId: "B4" }),
    /no disponible/,
  );
  s = apply(s, "assign", { brigadierId: "B2" });
  assert.equal(s.sos[0].assigned, "B2");
  assert.equal(s.missions[0].brigadierId, "B2");
  assert.equal(s.brigadiers[1].eta, 3);
  assert.equal(s.brigadiers[0].status, "available");
});
test("HU-25: ritmo cambia ETA; advertencia supera margen 5 min", () => {
  const s = apply(initialState(), "ppe", { pace: 0.2 });
  assert.equal(eta(s), 7);
  assert.ok(eta(s) > s.ppe.margin);
  assert.throws(() => apply(s, "ppe", { pace: 0 }));
});
test("HU-27: chat, mensaje pendiente, reintento y texto validado", () => {
  let s = apply(initialState(), "network");
  s = apply(s, "message", { text: "Hay humo" });
  assert.equal(s.messages[0].status, "pending");
  assert.throws(
    () => apply(s, "retryMessage", { id: "MSG-1" }),
    /Sin conexión/,
  );
  s = apply(s, "network");
  s = apply(s, "retryMessage", { id: "MSG-1" });
  assert.equal(s.messages[0].status, "sent");
  assert.throws(() => apply(s, "message", { text: "  " }));
});
test("HU-29,39: refugio lleno / peligro, alternativa B y sin disponible", () => {
  let s = apply(initialState(), "refugeStatus", { id: "A", status: "Lleno" });
  assert.equal(s.selectedRefuge, "B");
  assert.equal(s.route.destination, "Refugio B");
  assert.throws(() => apply(s, "refuge", { id: "A" }));
  s = apply(s, "refugeStatus", { id: "B", status: "En peligro" });
  assert.equal(s.selectedRefuge, null);
  assert.throws(() => apply(s, "arrive", { refuge: true }));
  assert.match(s.route.destination, /asistencia/);
});
test("HU-31,37: rescate individual y múltiple, misiones reales y no duplicados", () => {
  let s = apply(initialState(), "assign", { brigadierId: "B1" });
  s = apply(s, "rescue", { ids: ["R-014"] });
  assert.equal(counts(s).safe, 46);
  s = apply(s, "rescue", { ids: ["R-014"] });
  assert.equal(counts(s).safe, 46);
  assert.throws(() => apply(s, "rescue", { ids: ["R-099"] }));
  s = apply(s, "assign", { requestId: "R-015", brigadierId: "B1" });
  s = apply(s, "assign", { requestId: "R-016", brigadierId: "B2" });
  s = apply(s, "rescue", { ids: ["R-015", "R-016"] });
  assert.equal(counts(s).safe, 48);
  assert.equal(counts(s).risk, 0);
  assert.ok(s.missions.every((m) => m.status === "completed"));
});
test("HU-40: CSV verificable, censo y auditoría reales de la sesión; escapa comillas", () => {
  const fixture = initialState();
  fixture.people[0].name = 'Texto "seguro", prueba';
  const s = apply(fixture, "message", { text: "Prueba de auditoría" });
  const csv = reportCSV(s);
  assert.match(csv, /Identificador/);
  assert.match(csv, /P65/);
  assert.match(csv, /Texto ""seguro"", prueba/);
  assert.equal(csv.split("\r\n").length, 67);
});
test("HU-41: cambio de sector y desconexión simulada", () => {
  let s = apply(initialState(), "sectorAssign", { id: "B1", sector: "Sur" });
  assert.equal(s.brigadiers[0].sector, "Sur");
  s = apply(s, "brigadierStatus", { id: "B1", status: "offline" });
  assert.equal(s.brigadiers[0].status, "offline");
});
test("HU-42: sensor manual deja evento, sector y aviso de incendio", () => {
  const s = apply(initialState(), "sensor");
  assert.equal(s.sensors.length, 1);
  assert.equal(s.sectors[0].hazard, true);
  assert.equal(s.events[0].action, "sensor");
});
test("HU-33: alcance Piso 2 se conserva y confirmación es un evento auditable", () => {
  const s = apply(initialState(), "emit", {
    event: "Incendio",
    scope: "Piso 2",
  });
  assert.equal(s.alert.event, "Incendio");
  assert.equal(s.alert.scope, "Piso 2");
  assert.equal(s.events[0].action, "emit");
  assert.equal(s.alert.confirmed, false);
});
test("HU-44: prioridad manual identifica a María sin sensor real", () => {
  const s = apply(initialState(), "priority");
  assert.equal(s.people[0].priority, true);
  assert.match(s.events[0].detail, /120 s/);
});
test("HU-45: paquete preparado, datos verificables y expiración al cerrar", () => {
  let s = apply(initialState(), "external");
  assert.deepEqual(s.external.summary, counts(s));
  assert.match(s.external.status, /Preparado/);
  s = apply(s, "close");
  assert.equal(s.external.status, "Expirado");
  assert.equal(s.alert.active, false);
});
test("HU-47: deslizador + confirmación, censo pendiente bloquea despeje, resultado verde coherente", () => {
  let s = initialState();
  assert.throws(() =>
    apply(s, "clearSector", { value: 0, confirm: true, sector: "Norte" }),
  );
  assert.throws(
    () =>
      apply(s, "clearSector", { value: 100, confirm: true, sector: "Norte" }),
    /personas pendientes/,
  );
  assert.throws(
    () => apply(s, "sectorArrival", { sector: "Norte", confirm: true }),
    /primero/,
  );
  for (const requestId of ["R-014", "R-015", "R-016"]) {
    s = apply(s, "assign", { requestId, brigadierId: "B1" });
    s = apply(s, "rescue", { ids: [requestId] });
  }
  s = apply(s, "sectorArrival", { sector: "Norte", confirm: true });
  s = apply(s, "clearSector", { value: 100, confirm: true, sector: "Norte" });
  assert.equal(s.sectors[0].cleared, true);
  assert.equal(counts(s).risk, 0);
});
test("Visitante aumenta el censo una sola vez; validación de datos ficticios", () => {
  let s = apply(initialState(), "visitor", {
    name: "Elena Soto",
    destination: "Recepción",
    needs: "Texto",
    key: "one",
  });
  assert.equal(s.people.length, 66);
  assert.equal(s.people.filter((p) => p.visitor).length, 6);
  assert.throws(() =>
    apply(s, "visitor", {
      name: "Elena",
      destination: "Recepción",
      key: "one",
    }),
  );
  assert.throws(() =>
    apply(s, "visitor", { name: " ", destination: "Recepción" }),
  );
});
test("El reducer no altera el estado original ante acciones válidas ni fallos", () => {
  const s = initialState(),
    snapshot = JSON.stringify(s);
  apply(s, "confirmAlert");
  assert.equal(JSON.stringify(s), snapshot);
  assert.throws(() => apply(s, "assign", { brigadierId: "missing" }));
  assert.equal(JSON.stringify(s), snapshot);
});
test("La llegada de un visitante solo modifica a la persona registrada", () => {
  let s = apply(initialState(), "visitor", {
    name: "Elena Soto",
    destination: "Recepción",
    key: "visita",
  });
  s = apply(s, "visitorSafe");
  assert.equal(s.people.at(-1).status, "safe");
  assert.equal(s.people[0].status, "risk");
  assert.equal(counts(s).safe, 46);
});
