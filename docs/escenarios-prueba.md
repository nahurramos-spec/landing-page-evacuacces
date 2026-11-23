# Escenarios de prueba reproducibles

Iniciar `npm start` en una terminal y ejecutar `npm test` y `npm run test:browser` en otra. `tests/browser.mjs` restaura una fixture por caso y usa acciones reales del DOM. Las únicas fixtures que completan estados directamente preparan precondiciones de prueba, como el censo previo al despeje.

| Caso | Preparación y acción / resultado esperado | Resultado obtenido | Estado y evidencia |
|---|---|---|---|
| QA-01 | Entrada a los siete recorridos. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-02 | Preferencias múltiples, alto contraste, texto 200 %, persistencia. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-03 | Alerta HU-06: confirmación actualiza estado y ocupa ≥40 % de pantalla. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-04 | Síntesis de voz solicitada y transcripción / fallback visibles; vibración alternativa. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-05 | Ruta sin escaleras, avance, bloqueo ascensores y recálculo. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-06 | PPE: cambio de ritmo recalcula ETA y advertencia de margen. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-07 | SOS exitoso, fallo y reintento sin duplicación. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-08 | Tarjeta ampliada, envío, gestos y ficha de brigada compartida. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-09 | HU-43 consulta y retorno al manual pendiente sin instrucciones físicas. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-10 | Chat con mensajes rápidos, texto, cola sin conexión y reintento. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-11 | Refugio lleno cambia alternativa a B; llegada única y contadores. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-12 | Llegada segura con modal, protección de duplicados. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-13 | Administración: asignación y reasignación a Carla, datos consistentes. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-14 | Rescate individual: confirmación modal, dashboard y prevención de duplicados. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-15 | Rescate múltiple de misiones reales seleccionadas. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-16 | Emisión sectorizada revisada antes de confirmar y estado compartido. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-17 | Estado de refugios y alternativa actualizados desde administración. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-18 | Sensor IoT manual resalta sector y abre emisión de alerta. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-19 | Prioridad por falta de señal: persona al inicio y ficha legible. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-20 | Brigadista: reasignación de sector con teclado y disponibilidad. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-21 | Sector despejado exige gesto y confirmación; alternativa de teclado. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-22 | Paquete externo: preparación simulada, cierre, expiración y reporte. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-23 | Descarga CSV genera archivo no vacío con personas y auditoría. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-24 | Reporte imprimible genera PDF real con el motor de Chrome. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-25 | Registro visitante QR: formulario validado y censo 66. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-26 | Navegación móvil, foco de teclado, modal Escape y reinicio. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-27 | 16 interfaces × Desktop / Mobile: capturas, overflow y auditoría axe. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-28 | 390, 768, 1024, 1440: landing y dashboards sin overflow. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-29 | Texto al 200 %: 17 interfaces a 390 y 1440 px sin desbordamiento de página. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-30 | Recursos locales: funciona bloqueando dominios externos. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |
| QA-31 | Sin errores JavaScript ni recursos ausentes en las rutas ejercitadas. Ver secuencia exacta y aserciones en tests/browser.mjs. | Las aserciones del caso se ejecutaron sin error. | **APROBADA** · evidencias/qa-browser.json |

## Pruebas manuales posteriores

- Verificar voz y vibración en hardware compatible; actualmente solo se verificó solicitud/fallback del navegador.
- Recorrer con lector de pantalla y personas usuarias.
- Consultar despliegue.json para la comprobación pública de los siete recorridos; esta lista conserva pendientes las validaciones físicas y humanas.

Estos casos no se marcan como aprobados.
