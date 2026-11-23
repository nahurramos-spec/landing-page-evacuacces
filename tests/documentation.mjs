import fs from "node:fs";
const rows = JSON.parse(
  fs.readFileSync("docs/figma/criterios-oficiales.json", "utf8"),
);
const qa = JSON.parse(
  fs.readFileSync("docs/evidencias/qa-browser.json", "utf8"),
);
const sourceByHU = {
  2: "evacuation",
  3: "evacuation",
  4: "main",
  5: "main",
  6: "evacuation",
  7: "evacuation",
  8: "evacuation",
  10: "evacuation",
  12: "evacuation",
  17: "evacuation",
  18: "evacuation",
  21: "evacuation",
  24: "evacuation",
  25: "evacuation",
  27: "evacuation",
  29: "evacuation",
  31: "administration",
  32: "map",
  33: "administration",
  34: "administration",
  36: "brigadier",
  37: "brigadier",
  39: "administration",
  40: "administration",
  41: "administration",
  42: "administration",
  43: "brigadier",
  44: "administration",
  45: "administration",
  47: "brigadier",
};
const actual = {
  2: [
    "API de navegador y alternativa local",
    "Solicitar vibración y confirmar la alerta; Chrome verifica fallback / solicitud, sin certificar vibración física.",
  ],
  3: [
    "Funcional local; pendientes del sistema",
    "Alerta estática, tipo de evento grande y contraste. Destellos y superposición del sistema no implementados.",
  ],
  4: [
    "API de navegador y alternativa local",
    "Speech Synthesis, repetición manual y transcripción visible. Audio físico no comprobado; volumen del sistema fuera de alcance.",
  ],
  5: [
    "Funcional local",
    "Negro/amarillo, sin animaciones y persistencia local. La implementación resuelve la persistencia pendiente en el prototipo.",
  ],
  6: [
    "Funcional local y API condicionada",
    "Control ocupa ≥40 % del viewport de referencia; actualiza el estado, se deshabilita y permite continuar. Háptica física no comprobada.",
  ],
  7: [
    "Simulación y funcional local",
    "Flecha SVG estática, pasos y texto de vía libre/bloqueo. Sin rumbo real ni sensores.",
  ],
  8: [
    "Funcional local y simulación",
    "Necesidad de señas compartida con brigada; Luis y Carla tienen certificación ficticia. Sin reconocimiento ni traducción.",
  ],
  10: [
    "Funcional local y simulación",
    "Llegada manual o QR/baliza simulado, confirmación y conteo idempotente. No hay geofencing ni señal de llegada física.",
  ],
  12: [
    "Funcional local",
    "Tarjetas en español con iconos originales, modal ampliado y envío local de necesidad.",
  ],
  17: [
    "Simulación local",
    "Trayecto precargado sin escaleras; rampa de 6 % y corredores amplios de muestra. Sin cálculo geométrico.",
  ],
  18: [
    "Simulación y funcional local",
    "Evento bloquea ascensores 1 y 2, impide uso y actualiza destino al refugio del mismo nivel.",
  ],
  21: [
    "Funcional local y simulación",
    "SOS persistente, ubicación precargada, fallo y reintento. No se contacta a servicios externos.",
  ],
  24: [
    "Funcional local y simulación",
    "Asignación compartida, fotos ficticias de Figma y ETA 2/3 min; reasignación Luis → Carla.",
  ],
  25: [
    "Cálculo local sobre datos de ejemplo",
    "Ritmo editable; 80 m ÷ ritmo ÷ 60, redondeado al minuto más próximo, mínimo 1. Margen de ejemplo 5 min.",
  ],
  27: [
    "Funcional local; audio pendiente",
    "Texto, respuestas rápidas, historial, cola y reintento. Compresión de audio y servicio de red pendientes.",
  ],
  29: [
    "Simulación; validación profesional pendiente",
    "Aforo basado en personas, selección y alternativa por indisponibilidad. Certificación cortafuego pendiente.",
  ],
  31: [
    "Funcional local responsive",
    "Los cuatro contadores se calculan desde las personas y reflejan rescates/llegadas. Sin WebSockets.",
  ],
  32: [
    "Simulación local",
    "Plano DOM, marcadores de personas, brigada y SOS, leyenda y consulta de fichas. Sin seguimiento en tiempo real ni garantía ≤3 s.",
  ],
  33: [
    "Funcional local y simulación",
    "Radios de evento/alcance, resumen y confirmación deliberada. Sin notificaciones ni control del sistema operativo.",
  ],
  34: [
    "Simulación y funcional local",
    "Candidatos con piso y distancia; asignación, indisponibilidad y reasignación manual del escenario de 30 s.",
  ],
  36: [
    "Funcional local; protocolo pendiente",
    "Ficha comparte necesidades, canal y advertencia de evitar destellos. Abordaje físico paso a paso pendiente.",
  ],
  37: [
    "Funcional local",
    "Rescate individual y múltiple con selección real de misiones, modal y prevención de doble conteo.",
  ],
  39: [
    "Funcional local y simulación",
    "Acciones Disponible/Lleno/En peligro y alternativa automática. No se inventan personas al marcar Lleno.",
  ],
  40: [
    "Funcional local",
    "Reporte calculado desde la sesión; CSV real y salida PDF del motor de impresión de Chrome probada. Sin exportación Excel nativa.",
  ],
  41: [
    "Funcional local y simulación",
    "Estados y selector de sector operable con teclado. No se implementa arrastre; desconexión manual, no detección automática.",
  ],
  42: [
    "Simulación local; IoT externo pendiente",
    "Evento manual de incendio resalta sector, registra auditoría y ofrece emisión. Sin webhook ni umbral <1 s medido.",
  ],
  43: [
    "Consulta funcional; contenido profesional pendiente",
    "Se abre el manual pendiente y se vuelve a la misión. Los tres CA necesitan material profesional autorizado.",
  ],
  44: [
    "Simulación y funcional local",
    "Activación manual de 120 s sin movimiento / señal; María pasa al inicio con aviso estático. Sin detección real.",
  ],
  45: [
    "Simulación; integración externa pendiente",
    "Paquete con resumen, confirmación y expiración al cierre. No hay envío cifrado, token ni URL real.",
  ],
  47: [
    "Funcional local y simulación",
    "Range hasta 100 % + casilla deliberada; valida censo y actualiza sector. Alternativa de teclado con flechas/Fin.",
  ],
};
const matchTest = {
  2: "Síntesis",
  3: "Alerta HU-06",
  4: "Síntesis",
  5: "Preferencias múltiples",
  6: "Alerta HU-06",
  7: "Ruta sin",
  8: "Tarjeta ampliada",
  10: "Llegada segura",
  12: "Tarjeta ampliada",
  17: "Ruta sin",
  18: "Ruta sin",
  21: "SOS exitoso",
  24: "Administración: asignación",
  25: "PPE:",
  27: "Chat con",
  29: "Refugio lleno",
  31: "Rescate individual",
  32: "interfaces ×",
  33: "Emisión sectorizada",
  34: "Administración: asignación",
  36: "Tarjeta ampliada",
  37: "Rescate múltiple",
  39: "Estado de refugios",
  40: "Descarga CSV",
  41: "Brigadista: reasignación",
  42: "Sensor IoT",
  43: "HU-43 consulta",
  44: "Prioridad por",
  45: "Paquete externo",
  47: "Sector despejado",
};
const md = (s) => String(s).replace(/\|/g, " / ").replace(/\n/g, "<br>");
let trace =
  "# Matriz de trazabilidad · 30 HU core\n\nFuente: [matriz oficial de Figma](https://www.figma.com/design/vNZs4J1ms6hxHErWETquDB/?node-id=2-21432). Los textos CA se transcribieron de sus nodos específicos mediante lectura de Figma. D, S y P se conservan como clasificación del **prototipo original**, no como declaración de cumplimiento de esta implementación. D: demostrable; S: simulado; P: pendiente.\n\nLa prueba aprobada verifica la interacción local descrita; no convierte los CA profesionales o de integración externa en requisitos cumplidos. Las diferencias se detallan por fila y en `limitaciones-tecnicas.md`.\n\n| HU oficial y nombre | Actor | CA01, CA02 y CA03 oficiales | Pantalla / componente | Archivos | Acción y resultado observable | Soporte actual y limitaciones | Prueba ejecutada y resultado |\n|---|---|---|---|---|---|---|---|\n";
for (const row of rows) {
  const texts = row.text.map((t) => t.text),
    id = texts[0],
    n = Number(id.slice(3)),
    test = qa.results.find((t) => t.name.includes(matchTest[n]));
  trace += `| ${id} · ${md(row.name.split(" · ").slice(1).join(" · "))} | ${md(texts[1])} | ${texts.slice(-3).map(md).join("<br>")} | ${md(texts[3])}<br>${md(texts[4])} | js/${sourceByHU[n]}.js; js/state.js | ${md(texts[5])} → ${md(texts[6])}. Resultado implementado: ${md(actual[n][1])} | ${md(actual[n][0])}. Véase limitación en el resultado y archivo de alcance. | ${md(test?.name || "Sin prueba asociada")} · **${test?.status || "NO EJECUTADA"}**. Evidencia: [QA JSON](evidencias/qa-browser.json), [pruebas de estado](evidencias/qa-state.tap) y capturas del componente. |\n`;
}
fs.writeFileSync("docs/hu-trazabilidad.md", trace);
let cases =
  "# Escenarios de prueba reproducibles\n\nIniciar `npm start` en una terminal y ejecutar `npm test` y `npm run test:browser` en otra. `tests/browser.mjs` restaura una fixture por caso y usa acciones reales del DOM. Las únicas fixtures que completan estados directamente preparan precondiciones de prueba, como el censo previo al despeje.\n\n| Caso | Preparación y acción / resultado esperado | Resultado obtenido | Estado y evidencia |\n|---|---|---|---|\n";
qa.results.forEach((r, i) => {
  cases += `| QA-${String(i + 1).padStart(2, "0")} | ${md(r.name)}. Ver secuencia exacta y aserciones en tests/browser.mjs. | ${r.status === "APROBADA" ? "Las aserciones del caso se ejecutaron sin error." : md(r.detail)} | **${r.status}** · evidencias/qa-browser.json |\n`;
});
cases +=
  "\n## Pruebas manuales posteriores\n\n- Verificar voz y vibración en hardware compatible; actualmente solo se verificó solicitud/fallback del navegador.\n- Recorrer con lector de pantalla y personas usuarias.\n- Consultar despliegue.json para la comprobación pública de los siete recorridos; esta lista conserva pendientes las validaciones físicas y humanas.\n\nEstos casos no se marcan como aprobados.\n";
fs.writeFileSync("docs/escenarios-prueba.md", cases);
const tap = fs.readFileSync("docs/evidencias/qa-state.tap", "utf8"),
  unitPassed = Number(tap.match(/# pass (\d+)/)?.[1] || 0),
  unitFailed = Number(tap.match(/# fail (\d+)/)?.[1] || 0);
let results = `# Resultados de QA\n\nEjecución local: ${qa.date}. Navegador: Chrome ${qa.browser}, modo headless en Windows.\n\n- Estado: **${unitPassed} aprobadas, ${unitFailed} fallidas**, evidencia TAP.\n- Navegador: **${qa.results.filter((x) => x.status === "APROBADA").length} aprobadas, ${qa.results.filter((x) => x.status === "FALLÓ").length} fallidas**.\n- Capturas y auditorías axe: ${qa.visual.length} vistas/resoluciones. ${qa.axe.length} vistas con infracciones detectadas de las reglas WCAG 2 A/AA y 2.1 AA evaluadas. No es una certificación completa WCAG.\n- ${qa.errors.length} errores JavaScript; ${qa.failedResources.length} respuestas HTTP de error entre los recursos ejercitados.\n- 390, 768, 1024 y 1440 px: landing y dashboard sin desbordamiento de página.\n- Texto 200 %: 17 interfaces a 390 y 1440 px sin desbordamiento horizontal de la página ni del área principal. No sustituye la validación humana de legibilidad.\n- CSV descargado y PDF generado con el motor de impresión de Chrome. El botón de impresión se verificó por invocación; no se probó el diálogo nativo del sistema operativo en headless.\n\n[Casos completos](escenarios-prueba.md), [JSON de navegador](evidencias/qa-browser.json), [TAP del estado](evidencias/qa-state.tap), [CSV real](evidencias/reporte-prueba.csv), [PDF de impresión](evidencias/reporte-impresion.pdf).\n\n## Incidencias corregidas\n\n| Incidencia observada | Corrección | Verificación |\n|---|---|---|\n| Botón de alerta móvil por debajo del 40 % de área | Se aumentó el área y se eliminó la reserva de scrollbar que reducía su ancho | Aserción de geometría Desktop/Mobile aprobada |\n| Verde sobre azul pálido insuficiente para texto pequeño | Etiquetas de aforo en tinta sobre el fondo original | Auditorías axe posteriores sin esa infracción |\n| Tabla del censo desbordaba el contenedor móvil | Reorganización como filas apiladas, etiquetas y ancho fijo | Capturas móviles, overflow y axe aprobados |\n| Pruebas leían contenido antes del evento hashchange | Espera del título y del contenido con aserciones reintentables de Playwright | Recorridos de tarjeta y protocolo aprobados |\n| Captión del censo adoptaba un ancho mínimo de tabla al apilar filas | Caption con ancho de bloque en Mobile | Comparación visual posterior |\n| Comparación de píxeles se ejecutaba en origen vacío | El comparador abre primero el origen local | Métricas generadas desde el mismo origen |\n\n## Alcance de la prueba visual\n\nSe exportaron referencias originales y se tomaron capturas de la implementación. Las láminas comparativas y el error RGB medido están en evidencias. Las diferencias de contenido funcional, estados o controles también alteran esos valores; **no se expresa un porcentaje de fidelidad**. Véase [revisión visual](revision-visual.md).\n\nEl inspector estético genérico se ejecutó. Sus exigencias de varias fotografías y movimiento se exceptúan frente al pedido de mantener el sistema de Figma y evitar animaciones innecesarias. No se usa ese inspector para afirmar fidelidad al prototipo.\n`;
if (fs.existsSync("docs/evidencias/qa-static.json")) {
  const staticQA = JSON.parse(
    fs.readFileSync("docs/evidencias/qa-static.json", "utf8"),
  );
  results += `\n## Paquete estático y subdirectorios\n\n${staticQA.results.filter((r) => r.status === "APROBADA").length} comprobaciones aprobadas: sintaxis/importaciones, recursos CSS, matriz exacta, recorrido bajo dist/ y foco del menú. [Evidencia del paquete](evidencias/qa-static.json).\n`;
}
if (fs.existsSync("docs/evidencias/qa-targeted.json")) {
  const targeted = JSON.parse(fs.readFileSync("docs/evidencias/qa-targeted.json", "utf8"));
  results += `\n## Comprobaciones puntuales finales\n\n${targeted.results.filter(r => r.status === "APROBADA").length} casos adicionales aprobados: PPE/salto al contenido en Desktop y Mobile, y acceso a la aplicación desde landing móvil con texto ampliado. [Evidencia](evidencias/qa-targeted.json).\n`;
}
if(fs.existsSync("docs/evidencias/revision-producto/qa-producto.json")){
  const product=JSON.parse(fs.readFileSync("docs/evidencias/revision-producto/qa-producto.json","utf8"));
  results+=`\n## Corrección de interfaz de producto\n\nEjecución: ${product.date}. ${product.results.filter(r=>r.status==="APROBADA").length} casos aprobados y ${product.results.filter(r=>r.status==="FALLÓ").length} fallidos. ${product.screens.length} capturas de seis pantallas prioritarias a 390, 768, 1024 y 1440 px. Se comprobó aviso global visible, geometría del icono SOS de 56 × 56, botón de registro completamente visible, ausencia de desbordamiento y auditoría axe sin infracciones en esas capturas. Se verificaron cancelación y confirmación de SOS, aviso previo de emisión, selección de R-015 y presentación del historial anterior sin borrar datos.\n\n[Evidencia JSON](evidencias/revision-producto/qa-producto.json) · [Informe de cambios](revision-producto.md). Los fallos, bloqueos y sensores se operan desde «Controles de prueba»; su disponibilidad sigue cubierta por las pruebas de navegador.\n`;
}
results += "\n## Reorganización y entrega\n\nLas pruebas anteriores se ejecutaron tras el traslado a js/main.js y assets/images/. Los 25 estilos y recursos visuales conservan su SHA-256. Se añadió una prueba de compatibilidad con las sesiones guardadas anteriormente. Véase [organización del repositorio](organizacion-repositorio.md) y [estado de publicación](despliegue.json).\n";
fs.writeFileSync("docs/resultados-qa.md", results);
const deployment = JSON.parse(fs.readFileSync("docs/despliegue.json", "utf8"));
const cap = `# Capítulo V · Implementación de EvacuAccess\n\n## 5.1. Landing Page web · Desktop\n\nLa entrada index.html carga módulos nativos de JavaScript y hojas CSS. La landing presenta encabezado, hero, problemática, solución, funcionalidades, perfiles, demostración, equipo y pie de página. El fragmento de ruta del hero es DOM real con el recurso direccional individual de Figma; abre el recorrido de movilidad. Las funcionalidades enlazan situaciones completas, no 30 aplicaciones separadas.\n\nEl sistema visual procede del archivo oficial: Atkinson Hyperlegible local, cabecera #2264BC, tinta #111111, fondo #F6F7F8, superficies blancas, información #EAF3FF, bordes #D7DBDF y radio 10 px. La landing es una extensión del sistema, no una pantalla original de Figma. Las 30 HU y sus 90 CA oficiales están en la matriz, con interacción, soporte y evidencia por fila.\n\nLa estructura de Equipo permanece editable en js/team.js. La sección y su enlace solo se publican si existen integrantes con nombre y rol completos; no se muestran fichas vacías ni se inventan nombres o fotografías.\n\n## 5.2. Adaptación responsive\n\nUna misma implementación adapta Desktop, Tablet y Mobile. Desktop mantiene navegación de 224 px, cabecera de 64 px y paneles paralelos; Mobile parte de la referencia 390 × 844, cabecera de 56 px y márgenes de contenido de 24 px. El menú abre la navegación por rol desde el teclado o un botón táctil. Los contadores pasan de cuatro columnas a dos; los paneles se apilan cuando sus anchos mínimos dejan de caber. El plano conserva los cuatro ambientes por fila del Figma móvil y se reorganiza al 200 % de texto.\n\nSe comprobaron 390, 768, 1024 y 1440 px, con evidencia de landing y dashboard. La matriz de capturas incluye las interfaces principales Desktop/Mobile y el formulario de visitante. La tabla de censo se transforma en filas legibles, manteniendo sus datos.\n\n## 5.3. Interacciones con el usuario\n\nLa navegación usa hash y funciona en subdirectorios estáticos. Los módulos renderizan componentes semánticos sobre un estado central. transition clona el estado, valida invariantes y registra auditoría antes de guardar en localStorage. Los contadores se calculan a partir de personas; las misiones enlazan solicitudes, personas y brigadistas. Ninguna vista conserva un segundo contador independiente.\n\nLos formularios aplican preferencias, PPE, mensajes, registro de visitantes y alcance de alerta. Las alertas masivas y el SOS se revisan en un modal antes de confirmar, con un aviso explícito de que no existe transmisión real. Un aviso global identifica el entorno de prueba. Los controles de fallo/reintento, sensores, bloqueo y desconexión permanecen en paneles secundarios. El SOS conserva fallo/reintento. El chat conserva mensajes pendientes. Los rescates necesitan misiones y confirmación deliberada; su repetición no cambia el censo. El despeje exige slider, verificación y ausencia de personas pendientes. El paquete externo expira al cerrar el evento.\n\n## 5.4. Accesibilidad\n\nSe implementaron HTML semántico, idioma español, etiquetas de formulario, foco visible de 3 px, salto al contenido, modales nativos, anuncio aria-live y estados identificados con texto. Se usa una alerta estática y una transcripción visible para la voz. El modo negro mate/amarillo se aplica sin recarga, persiste y elimina animaciones; se respeta prefers-reduced-motion.\n\nLos controles principales tienen mínimos de 48–64 px. Los marcadores pequeños disponen de un área táctil ampliada y nombre accesible. El slider permite flechas/Fin y una confirmación adicional. Las pruebas ejercitan teclado, menú, Escape y persistencia, e incluyen auditorías axe. No se declara conformidad WCAG integral ni pruebas humanas que no se hayan ejecutado. Véase resultados-qa.md para resultados y límites.\n\n## 5.5. Repositorio del proyecto\n\nRepositorio público existente: [nahurramos-spec/landing-page-evacuacces](${deployment.repository}), rama main. Se reutilizó origin. El código se organiza en js/ (entrada main.js y módulos), css/, assets/images/, assets/icons/, assets/fonts/, docs/ y tests/. README.md contiene el árbol, instalación, 30 HU y comandos. node_modules y dist no se versionan. Las evidencias se conservan en docs/evidencias/; véase organizacion-repositorio.md para traslados y limpieza.\n\n## 5.6. Despliegue en GitHub Pages\n\nEl workflow pages.yml instala Node.js y Chromium, ejecuta pruebas de estado, navegador, producto y comprobaciones puntuales, genera dist/, verifica sus recursos bajo un subdirectorio y publica el artefacto estático mediante GitHub Actions. Las evidencias de CI se conservan como artefacto. Los recursos son relativos y la navegación por hash evita reescrituras de servidor. El directorio publicado incorpora .nojekyll.\n\nPages configurado con origen GitHub Actions. URL asignada por GitHub: [EvacuAccess](${deployment.pagesUrl}). Estado verificado: ${deployment.status} ${deployment.verified ? `Comprobación pública: ${deployment.checkedAt}. Commit desplegado: ${deployment.sha}. [Ejecución](${deployment.workflowUrl}). Se verificaron carga, recursos y recorridos locales sobre la URL publicada; el detalle figura en despliegue.json y sus evidencias.` : "La asignación de URL no acredita todavía una publicación accesible. Comprobación pública pendiente."}\n`;
fs.writeFileSync("docs/capitulo-v.md", cap);
// Los enlaces temporales de descarga se reemplazan por sus rutas locales en la evidencia textual.
const manifests = ["assets-descarga.json", "capturas-descarga.json"],
  assets = [];
for (const name of manifests) {
  const path = "docs/figma/" + name;
  if (fs.existsSync(path)) {
    assets.push(...JSON.parse(fs.readFileSync(path, "utf8")));
    fs.unlinkSync(path);
  }
}
const origin = assets.map((a) => ({
  local: a.name,
  source:
    "Figma oficial, salvo fuente Atkinson y licencia procedentes de google/fonts",
}));
if (origin.length)
  fs.writeFileSync(
    "docs/figma/recursos-locales.json",
    JSON.stringify(origin, null, 2),
  );
for (const name of fs
  .readdirSync("docs/figma")
  .filter((n) => n.endsWith(".txt"))) {
  const path = "docs/figma/" + name;
  let value = fs.readFileSync(path, "utf8");
  for (const a of assets) value = value.replaceAll(a.url, a.name);
  value = value.replace(
    /https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^\s"')]+/g,
    "[URL temporal omitida]",
  );
  fs.writeFileSync(path, value);
}
console.log(
  `Documentación generada: ${rows.length} HU; ${unitPassed} pruebas de estado; ${qa.results.length} casos de navegador.`,
);
