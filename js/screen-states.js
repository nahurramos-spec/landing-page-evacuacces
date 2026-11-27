// Estados secundarios de los mockups de escritorio y móvil.
export const screenStates = {
  "contraste": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Evacuar por sismo · Alto contraste","size":36,"bold":true},{"text":"HU-03 · HU-05 · HU-15  |  Evacuar por sismo · Alto contraste","size":16,"bold":false},{"kids":[{"text":"Emergencia activa · Sismo","size":22,"bold":true},{"text":"Mantén la calma. Sigue la ruta indicada en esta demostración.","size":18,"bold":false},{"text":"Vibración simulada · Voz simulada · Sin destellos","size":16,"bold":true}],"bg":"#000000","row":false,"pad":20,"gap":16},{"text":"Toca el botón para confirmar que recibiste la alerta.","size":18,"bold":false},{"label":"✓  Estoy enterado","target":"ruta"},{"text":"Al confirmar: estado «Evacuando» y detención de la vibración simulada.","size":16,"bold":false},{"label":"Usar alerta estándar","target":"alerta"},{"label":"Escuchar instrucciones · Simulado","target":"voz"},{"label":"Ver tarjetas de comunicación","target":"comunicar"},{"label":"Ver cancelación de falsa alarma","target":"falsa"}],"mobile":[{"text":"HU-03 · HU-05 · HU-15  |  Confirma que recibiste la alerta.","size":16,"bold":false},{"kids":[{"text":"Evacuar por sismo","size":36,"bold":true},{"text":"Alerta activa · Sin destellos.","size":18,"bold":false}],"bg":"#000000","row":false,"pad":20,"gap":8},{"text":"Confirma que recibiste la alerta.","size":18,"bold":false},{"label":"✓  Estoy enterado","target":"ruta"},{"text":"Vibración y voz simuladas. Al confirmar: Evacuando.","size":16,"bold":false},{"label":"Usar alerta estándar","target":"alerta"},{"label":"Escuchar instrucciones · Simulado","target":"voz"},{"label":"Ver tarjetas de comunicación","target":"comunicar"},{"label":"Ver cancelación de falsa alarma","target":"falsa"}]},
  "voz": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Instrucción de voz simulada","size":28,"bold":true},{"text":"HU-04  |  «Avanza 20 metros hacia la salida norte. Sigue de frente.» Transcripción visible: no se reproduce audio real.","size":16,"bold":false},{"kids":[{"text":"Narración simulada","size":22,"bold":true},{"text":"«Avanza 20 metros hacia la salida norte. Sigue de frente.»\nTranscripción visible: no se reproduce audio real.","size":18,"bold":false}],"bg":"#eaf3ff","row":false,"pad":20,"gap":16},{"label":"Repetir la última instrucción","target":null},{"label":"Confirmar alerta y consultar ruta","target":"ruta"},{"label":"Solicitar ayuda","target":"sos"}]},
  "bloqueo": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Ruta bloqueada","size":28,"bold":true},{"text":"HU-07 · HU-18 · HU-20 · HU-25  |  No disponibles durante esta emergencia simulada. El corredor norte presenta congestión. No se permite usar el ascensor.","size":16,"bold":false},{"kids":[{"text":"Ascensores 1 y 2 bloqueados","size":22,"bold":true},{"text":"No disponibles durante esta emergencia simulada. El corredor norte presenta congestión. No se permite usar el ascensor.","size":18,"bold":false}],"bg":"#fbeaeb","row":false,"pad":20,"gap":16},{"label":"Recalcular hacia refugio del mismo piso","target":"desvio"},{"label":"Intentar usar ascensor · Acción bloqueada","target":null},{"label":"Solicitar rescate","target":"sos"},{"text":"Advertencia de tiempo · Muestra: un trayecto de 6 min superaría el margen de ejemplo de 5 min. Se prioriza refugio en el mismo piso; no es una evaluación de seguridad real.","size":18,"bold":false}]},
  "desvio": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Ruta accesible recalculada","size":28,"bold":true},{"text":"HU-17 · HU-18 · HU-20 · HU-28 · HU-29  |  Ruta recalculada: ascensor excluido. Hacia el refugio disponible en este mismo piso.","size":16,"bold":false},{"kids":[{"text":"Evacuando · Sin escaleras","size":22,"bold":true},{"text":"Ruta recalculada: ascensor excluido. Hacia el refugio disponible en este mismo piso.","size":18,"bold":false}],"bg":"#eaf3ff","row":false,"pad":20,"gap":16},{"kids":[{"text":"De frente","size":32,"bold":true},{"text":"Paso 2 de 4 · Vía libre · Baliza B-204 simulada","size":16,"bold":true}],"bg":"#eaf3ff","row":false,"pad":24,"gap":16},{"kids":[{"text":"Punto de encuentro","size":22,"bold":true},{"text":"Refugio A · Piso 2 · 24 m · 3/8 plazas","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"label":"Repetir instrucción · Simulado","target":"voz"},{"label":"Ver mapa","target":"mapa"},{"label":"Ver bloqueo de ruta","target":"bloqueo"},{"label":"Ya estoy fuera / Fuera de peligro","target":"salida"},{"label":"Confirmar llegada al refugio","target":"refugio"},{"label":"Simular vía despejada","target":"ruta"}]},
  "detalles": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Puertas y pendientes","size":28,"bold":true},{"text":"HU-17 · HU-22 · HU-23  |  Ancho libre: 100 cm · Paso permitido. Estado del sensor simulado.","size":16,"bold":false},{"kids":[{"text":"Puerta P-204 · Abierta","size":22,"bold":true},{"text":"Ancho libre: 100 cm · Paso permitido. Estado del sensor simulado.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"kids":[{"text":"Rampa R-02 · Pendiente 6 %","size":22,"bold":true},{"text":"Ancho libre: 120 cm · Vía despejada. Validación física pendiente.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"kids":[{"text":"Precaución · Rampa R-03: 10 %","size":22,"bold":true},{"text":"Supera el 8 %. Se excluye de esta ruta de demostración. Puerta manual pesada al final: requiere apoyo.","size":18,"bold":false},{"label":"Ver alternativa accesible","target":"desvio"}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Puerta bloqueada · Ver desvío","target":"bloqueo"},{"text":"Puerta P-205 · Cerrada · Apertura manual pesada: solicita apoyo. Estados de puertas: Abierta, Cerrada y Bloqueada son datos simulados.","size":18,"bold":false}]},
  "offline": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Mapa sin conexión","size":28,"bold":true},{"text":"HU-09 · HU-13  |  Edificio B · Posiciones simuladas","size":16,"bold":false},{"kids":[{"text":"Plano operativo · Piso 2","size":22,"bold":true},{"text":"Edificio B · Posiciones simuladas","size":16,"bold":false},{"text":"Aula 201","size":18,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Refugio A","size":18,"bold":true},{"text":"3/8","size":16,"bold":false},{"text":"Aula 203","size":18,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Aula 204","size":18,"bold":true},{"text":"SOS","size":16,"bold":false},{"text":"Aula 205","size":18,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Refugio B","size":18,"bold":true},{"text":"2/6","size":16,"bold":false},{"text":"Aula 207","size":18,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Aula 208","size":18,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Salida ←","size":16,"bold":true},{"label":"→ Salida","target":null},{"text":"×","size":18,"bold":true},{"text":"B","size":16,"bold":true},{"text":"U","size":16,"bold":true},{"text":"!","size":16,"bold":true},{"text":"U Persona con necesidad de asistencia     B Brigadista     ! SOS activo     — Ruta habilitada","size":16,"bold":false}],"bg":"#ffffff","row":false,"pad":0,"gap":0},{"kids":[{"text":"Sin conexión · Modo Offline","size":22,"bold":true},{"text":"Plano local disponible · Última sincronización 10:02. Posición y recálculo se simulan; los datos de puertas pueden estar desactualizados.","size":18,"bold":false}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Ver puertas y pendientes","target":"detalles"},{"label":"Continuar ruta accesible","target":"ruta"},{"label":"Reportar obstáculo","target":"obstaculo"},{"label":"Consultar refugios","target":"refugio"}],"mobile":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Mapa sin conexión","size":28,"bold":true},{"text":"HU-09 · HU-13  |  Plano local disponible · Última sincronización 10:02. Posición y recálculo se simulan; los datos de puertas pueden estar desactualizados.","size":16,"bold":false},{"kids":[{"text":"Plano operativo · Piso 2","size":18,"bold":true},{"text":"Edificio B · Posiciones simuladas","size":16,"bold":false},{"text":"Aula 201","size":14,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Refugio A","size":14,"bold":true},{"text":"3/8","size":16,"bold":false},{"text":"Aula 203","size":14,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Aula 204","size":14,"bold":true},{"text":"SOS","size":16,"bold":false},{"text":"Aula 205","size":14,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Refugio B","size":14,"bold":true},{"text":"2/6","size":16,"bold":false},{"text":"Aula 207","size":14,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Aula 208","size":14,"bold":true},{"text":"Libre","size":16,"bold":false},{"text":"Salida ←","size":16,"bold":true},{"label":"→ Salida","target":null},{"text":"×","size":18,"bold":true},{"text":"B","size":16,"bold":true},{"text":"U","size":16,"bold":true},{"text":"!","size":16,"bold":true},{"text":"U Usuario   B Brigada   ! SOS","size":16,"bold":false}],"bg":"#ffffff","row":false,"pad":0,"gap":0},{"kids":[{"text":"Sin conexión · Modo Offline","size":22,"bold":true},{"text":"Plano local disponible · Última sincronización 10:02. Posición y recálculo se simulan; los datos de puertas pueden estar desactualizados.","size":18,"bold":false}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Ver puertas y pendientes","target":"detalles"},{"label":"Continuar ruta accesible","target":"ruta"},{"label":"Reportar obstáculo","target":"obstaculo"},{"label":"Consultar refugios","target":"refugio"}]},
  "obstaculo": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Reportar obstáculo","size":28,"bold":true},{"text":"HU-28  |  Ubicación asociada: Edificio B · Piso 2 · Aula 204. El reporte y la propagación son simulados.","size":16,"bold":false},{"text":"¿Qué bloquea el paso?","size":18,"bold":false},{"label":"Escombros · Seleccionar","target":"desvio"},{"label":"Fuego · Seleccionar","target":"desvio"},{"label":"Aglomeración · Seleccionar","target":"desvio"},{"label":"Objeto caído · Seleccionar","target":"desvio"},{"text":"Ubicación asociada: Edificio B · Piso 2 · Aula 204. El reporte y la propagación son simulados.","size":16,"bold":false}]},
  "no-puedo-caminar": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"No puedo caminar","size":28,"bold":true},{"text":"HU-08 · HU-12  |  Muestra esta tarjeta al brigadista. Prefiero texto y gestos.","size":16,"bold":false},{"kids":[{"text":"No puedo caminar","size":64,"bold":true},{"text":"Muestra esta tarjeta al brigadista. Prefiero texto y gestos.","size":32,"bold":true}],"bg":"#eaf3ff","row":false,"pad":24,"gap":16},{"label":"Enviar esta necesidad a Luis","target":"mensaje_ok"},{"label":"Volver a las tarjetas","target":"comunicar"}],"mobile":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"No puedo caminar","size":28,"bold":true},{"text":"HU-08 · HU-12  |  Muestra esta tarjeta al brigadista. Prefiero texto y gestos.","size":16,"bold":false},{"kids":[{"text":"No puedo caminar","size":42,"bold":true},{"text":"Muestra esta tarjeta al brigadista. Prefiero texto y gestos.","size":24,"bold":true}],"bg":"#eaf3ff","row":false,"pad":24,"gap":16},{"label":"Enviar esta necesidad a Luis","target":"mensaje_ok"},{"label":"Volver a las tarjetas","target":"comunicar"}]},
  "mensaje_ok": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Necesidad enviada","size":28,"bold":true},{"text":"HU-08 · HU-27  |  Necesidad registrada: No puedo caminar. Entrega simulada a Luis Paredes.","size":16,"bold":false},{"kids":[{"text":"Enviado a Luis Paredes","size":22,"bold":true},{"text":"Necesidad registrada: No puedo caminar. Entrega simulada a Luis Paredes.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Consultar conversación","target":"chat"},{"label":"Volver a las tarjetas","target":"comunicar"}]},
  "chat_fallo": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Mensaje pendiente de envío","size":28,"bold":true},{"text":"HU-27  |  Mensaje pendiente · Sin conexión","size":16,"bold":false},{"kids":[{"text":"Mensaje pendiente · Sin conexión","size":22,"bold":true},{"text":"«No puedo moverme» no se ha entregado. Reintento en espera. La compresión de audio y el envío en segundo plano no se implementan en Figma.","size":18,"bold":false}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Restablecer red y reintentar · Simulado","target":"mensaje_ok"},{"label":"Volver al chat","target":"chat"}]},
  "lleno": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Refugio lleno","size":28,"bold":true},{"text":"HU-29 · HU-39  |  8 de 8 plazas. No se puede confirmar un destino disponible aquí. Se ofrece Refugio B, en el mismo piso: 2 de 6.","size":16,"bold":false},{"kids":[{"text":"Refugio A · Lleno","size":22,"bold":true},{"text":"8 de 8 plazas. No se puede confirmar un destino disponible aquí. Se ofrece Refugio B, en el mismo piso: 2 de 6.","size":18,"bold":false}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Recalcular hacia Refugio B","target":"desvio"},{"label":"Solicitar asistencia","target":"sos"}]},
  "salida": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Confirmar salida segura","size":28,"bold":true},{"text":"HU-30  |  Confirma solo si ya llegaste al punto seguro. Esta acción detiene el seguimiento y libera tu solicitud en el escenario de demostración.","size":16,"bold":false},{"kids":[{"text":"¿Ya estás a salvo?","size":22,"bold":true},{"text":"Confirma solo si ya llegaste al punto seguro. Esta acción detiene el seguimiento y libera tu solicitud en el escenario de demostración.","size":18,"bold":false},{"label":"Sí, estoy a salvo","target":"seguro"},{"label":"Cancelar · Seguir evacuando","target":null}],"bg":"#ffffff","row":false,"pad":20,"gap":16}]},
  "falsa": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"EMERGENCIA CANCELADA - FALSA ALARMA","size":36,"bold":true},{"text":"HU-02 · HU-11  |  EMERGENCIA CANCELADA - FALSA ALARMA","size":16,"bold":false},{"kids":[{"text":"EMERGENCIA CANCELADA - FALSA ALARMA","size":22,"bold":true},{"text":"La alerta y la guía de ruta se han detenido.\n3 pulsos cortos y aviso hablado: simulados.","size":18,"bold":false}],"bg":"#138654","row":false,"pad":20,"gap":16},{"label":"Entendido","target":"inicio"}]},
  "texto200": {"desktop":[{"text":"Usuario · Sede Central / Edificio B","size":16,"bold":false},{"text":"Texto al 200 %","size":28,"bold":true},{"text":"HU-15  |  La instrucción mantiene su orden y se ajusta al ancho disponible. Esta pantalla demuestra el tamaño ampliado; la persistencia global queda pendiente.","size":16,"bold":false},{"kids":[{"text":"Vista previa de guía · Sigue de frente.","size":32,"bold":true}],"bg":"#061733","row":false,"pad":16,"gap":0},{"text":"Vista previa al 200 %","size":36,"bold":true},{"text":"Sigue de frente.","size":64,"bold":true},{"text":"La instrucción mantiene su orden y se ajusta al ancho disponible. Esta pantalla demuestra el tamaño ampliado; la persistencia global queda pendiente.","size":36,"bold":false},{"kids":[{"text":"Aplicar muestra y guardar preferencias","size":18,"bold":true}],"bg":"#111111","row":true,"pad":16,"gap":0},{"label":"Volver al tamaño estándar","target":"perfil"},{"label":"Muestra de tema · Azul oscuro y amarillo","target":"mapa"},{"label":"Muestra de tema · Negro y blanco puro","target":"mapa"}]},
  "rescate": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Confirmar rescate","size":28,"bold":true},{"text":"HU-37  |  ¿Confirmar el rescate de María?","size":16,"bold":false},{"kids":[{"text":"¿Confirmar el rescate de María?","size":22,"bold":true},{"text":"Registra esta acción solo cuando la persona esté en una zona segura.\nDestino: Patio norte · R-014.","size":18,"bold":false},{"label":"Sí, registrar rescate","target":"rescatado"},{"label":"Cancelar · Volver a la misión","target":null}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"label":"Ver selección de rescate múltiple","target":"masivo"}]},
  "rescatado": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Rescate registrado","size":28,"bold":true},{"text":"HU-37  |  María López · A salvo en Patio norte · 10:07 Censo de demostración actualizado: 2 en riesgo, 12 evacuando, 5 en refugio y 46 evacuados. Total: 65.","size":16,"bold":false},{"kids":[{"text":"Rescate registrado · R-014","size":22,"bold":true},{"text":"María López · A salvo en Patio norte · 10:07\nCenso de demostración actualizado: 2 en riesgo, 12 evacuando, 5 en refugio y 46 evacuados. Total: 65.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Verificar y despejar sector","target":"sector"},{"label":"Volver a misiones","target":"misiones"}]},
  "sector-despejado": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Sector despejado","size":28,"bold":true},{"text":"HU-47  |  Verificación confirmada por Luis Paredes a las 10:08. El sector se muestra en verde en el escenario de cierre.","size":16,"bold":false},{"kids":[{"text":"Sector despejado · Piso 2","size":22,"bold":true},{"text":"Verificación confirmada por Luis Paredes a las 10:08. El sector se muestra en verde en el escenario de cierre.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Registrar observaciones","target":"observaciones"},{"label":"Volver a misiones","target":"misiones"}]},
  "ptt": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Comunicación Push-To-Talk","size":28,"bold":true},{"text":"HU-38  |  Sector norte · Canal de brigada","size":16,"bold":false},{"kids":[{"text":"Sector norte · Canal de brigada","size":22,"bold":true},{"text":"Luis Paredes + Centro de control\nMicrófono: simulado. No se captura ni transmite audio real.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"label":"Mantener pulsado","target":"canal-de-voz-simulado"},{"label":"Volver a misiones","target":"misiones"},{"text":"QoS, codec, redes 2G y latencia: fuera del alcance demostrable en Figma.","size":16,"bold":false}]},
  "canal-de-voz-simulado": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Canal de voz simulado","size":28,"bold":true},{"text":"HU-38  |  Canal norte · Mensaje de voz de demostración. No se usa el micrófono ni existe comunicación de red.","size":16,"bold":false},{"kids":[{"text":"Transmitiendo · Simulación","size":22,"bold":true},{"text":"Canal norte · Mensaje de voz de demostración. No se usa el micrófono ni existe comunicación de red.","size":18,"bold":false}],"bg":"#eaf3ff","row":false,"pad":20,"gap":16},{"label":"Finalizar transmisión simulada","target":"ptt"}]},
  "emitir_confirm": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Confirmar emisión de alerta","size":28,"bold":true},{"text":"HU-33  |  Revisa evento y alcance antes de confirmar. No se envía una emergencia real.","size":16,"bold":false},{"kids":[{"text":"Revisar antes de emitir","size":22,"bold":true},{"text":"Revisa evento y alcance antes de confirmar. No se envía una emergencia real.","size":18,"bold":false},{"label":"Confirmar emisión simulada","target":"emitida"},{"label":"Volver a editar","target":null}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"text":"Sismo","size":22,"bold":false},{"text":"Piso 2 · 48 dispositivos","size":18,"bold":false}]},
  "emitida": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Alerta emitida","size":28,"bold":true},{"text":"HU-33  |  Entrega confirmada en el escenario de demostración. El prototipo no activa hardware ni notificaciones reales.","size":16,"bold":false},{"kids":[{"text":"Alerta emitida · Demostración","size":22,"bold":true},{"text":"Entrega confirmada en el escenario de demostración. El prototipo no activa hardware ni notificaciones reales.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Visualizar solicitudes","target":"solicitudes"},{"label":"Supervisar dashboard","target":"admin"},{"text":"Sismo","size":22,"bold":false},{"text":"Piso 2 · 48 dispositivos","size":18,"bold":false}]},
  "asignacion": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Brigadista asignado","size":28,"bold":true},{"text":"HU-24 · HU-34  |  Luis Paredes → María López Mismo piso · ETA simulada: 2 min Notificación de misión y ficha del usuario actualizadas en esta demostración.","size":16,"bold":false},{"kids":[{"text":"Brigadista asignado · R-014","size":22,"bold":true},{"text":"Luis Paredes → María López\nMismo piso · ETA simulada: 2 min\nNotificación de misión y ficha del usuario actualizadas en esta demostración.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Supervisar rescate","target":"admin"},{"label":"Consultar brigadistas por sector","target":"brigadas"}]},
  "estado-de-refugio-actualizado": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Estado de refugio actualizado","size":28,"bold":true},{"text":"HU-39  |  Refugio A: Lleno. Refugio B disponible, 2/6. Desvío simulado hacia Refugio B.","size":16,"bold":false},{"kids":[{"text":"Estado actualizado","size":22,"bold":true},{"text":"Refugio A: Lleno. Refugio B disponible, 2/6. Desvío simulado hacia Refugio B.","size":18,"bold":false}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"label":"Volver al dashboard","target":"admin"},{"label":"Revisar zonas","target":"zonas"}]},
  "salida_visita": {"desktop":[{"text":"Visitante · Sede Central / Edificio B","size":16,"bold":false},{"text":"Salida registrada","size":28,"bold":true},{"text":"HU-35  |  Elena Soto dejó el edificio. Censo de demostración: vuelve a 65 personas. La detección GPS no está implementada.","size":16,"bold":false},{"kids":[{"text":"Salida registrada","size":22,"bold":true},{"text":"Elena Soto dejó el edificio.\nCenso de demostración: vuelve a 65 personas. La detección GPS no está implementada.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Volver al acceso","target":"acceso"}]},
  "cerrar": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Finalizar emergencia","size":28,"bold":true},{"text":"HU-11 · HU-40 · HU-45  |  Antes de cerrar, revisa personas pendientes. Esta es una transición de demostración: el reporte final simula la evacuación completa. No valida que el edificio esté despejado.","size":16,"bold":false},{"kids":[{"text":"¿Finalizar la emergencia?","size":22,"bold":true},{"text":"Antes de cerrar, revisa personas pendientes. Esta es una transición de demostración: el reporte final simula la evacuación completa. No valida que el edificio esté despejado.","size":18,"bold":false},{"label":"Confirmar cierre de demostración","target":"reporte"},{"label":"Cancelar y seguir supervisando","target":"admin"}],"bg":"#fff7d6","row":false,"pad":20,"gap":16},{"kids":[{"text":"Simular cancelación por falsa alarma","size":18,"bold":true}],"bg":"#ffffff","row":true,"pad":16,"gap":0}]},
  "exportado": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Informe preparado · Demostración","size":28,"bold":true},{"text":"HU-40  |  Informe preparado · Demostración","size":16,"bold":false},{"kids":[{"text":"Informe preparado · Simulación","size":22,"bold":true},{"text":"PDF y Excel: vista de demostración, sin descarga real. Incluye tiempos, tasa de evacuación, fallas y desglose por piso, sector y accesibilidad.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"kids":[{"text":"Tiempo de rescate frente al límite","size":22,"bold":true},{"text":"R-014 · 3 min de 5 min\nRescatadas dentro del margen de ejemplo: 1 de 1.","size":18,"bold":false},{"kids":[{"text":"Rescate  ██████  3 min","size":22,"bold":true},{"text":"Límite     ██████████  5 min","size":22,"bold":true}],"bg":"#eaf3ff","row":false,"pad":8,"gap":16}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"text":"Los valores son datos de demostración. Los límites no constituyen una validación de seguridad profesional.","size":16,"bold":false},{"label":"Volver al reporte","target":"reporte"}]},
  "denegado": {"desktop":[{"text":"Brigadista · Sede Central / Edificio B","size":16,"bold":false},{"text":"Acceso no autorizado","size":28,"bold":true},{"text":"HU-46  |  Tu rol Brigadista permite mapas operativos y rescate, pero no los ajustes globales ni la gestión de permisos.","size":16,"bold":false},{"kids":[{"text":"Acceso no autorizado","size":22,"bold":true},{"text":"Tu rol Brigadista permite mapas operativos y rescate, pero no los ajustes globales ni la gestión de permisos.","size":18,"bold":false}],"bg":"#fbeaeb","row":false,"pad":20,"gap":16},{"label":"Volver a misiones autorizadas","target":"misiones"}]},
  "revocado": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Permisos revocados","size":28,"bold":true},{"text":"HU-46  |  Permisos revocados · Sesión cerrada","size":16,"bold":false},{"kids":[{"text":"Permisos revocados · Sesión cerrada","size":22,"bold":true},{"text":"La sesión de Luis Paredes se cierra en esta demostración. Ya no puede abrir módulos protegidos. La invalidación real del servidor no está implementada.","size":18,"bold":false}],"bg":"#fbeaeb","row":false,"pad":20,"gap":16},{"label":"Volver a gestión de permisos","target":"roles"}]},
  "reasignada": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Misión reasignada a Carla","size":28,"bold":true},{"text":"HU-24 · HU-34  |  Reasignación de demostración completada. Misma planta, a 38 m. ETA actualizada: 3 min. La ficha del usuario refleja la nueva asignación.","size":16,"bold":false},{"kids":[{"text":"R-014 · Carla Núñez asignada","size":22,"bold":true},{"text":"Reasignación de demostración completada. Misma planta, a 38 m. ETA actualizada: 3 min. La ficha del usuario refleja la nueva asignación.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Supervisar rescate","target":"admin"}]},
  "sector_asignado": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Sector de patrullaje actualizado","size":28,"bold":true},{"text":"HU-41  |  Sector de patrullaje actualizado","size":16,"bold":false},{"kids":[{"text":"Luis Paredes → Sector sur","size":22,"bold":true},{"text":"Cobertura de patrullaje actualizada en la demostración. El cambio no se envía a dispositivos reales.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Consultar brigadistas","target":"brigadas"}]},
  "censo_actualizado": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Censo actualizado por QR","size":28,"bold":true},{"text":"HU-35  |  Elena Soto registrada mediante QR. Necesidad: texto e indicaciones visuales. El censo usa datos de demostración.","size":16,"bold":false},{"kids":[{"text":"66 personas · 6 visitantes","size":22,"bold":true},{"text":"Elena Soto registrada mediante QR. Necesidad: texto e indicaciones visuales. El censo usa datos de demostración.","size":18,"bold":false}],"bg":"#eaf4ee","row":false,"pad":20,"gap":16},{"label":"Volver al dashboard","target":"admin"}]},
  "visitante_seleccion": {"desktop":[{"text":"Visitante · Sede Central / Edificio B","size":16,"bold":false},{"text":"Necesidad de visitante seleccionada","size":28,"bold":true},{"text":"HU-35  |  Necesidad de visitante seleccionada","size":16,"bold":false},{"kids":[{"text":"Elena Soto · Recepción","size":22,"bold":true},{"text":"☑ Texto e indicaciones visuales\nDatos de ejemplo preparados para confirmar el ingreso.","size":18,"bold":false}],"bg":"#eaf3ff","row":false,"pad":20,"gap":16},{"label":"Confirmar registro","target":"visita-ok"},{"label":"Volver al formulario","target":"visitante"}]},
  "observaciones_admin": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Auditoría de mantenimiento","size":28,"bold":true},{"text":"HU-48  |  Luz de señalización apagada en pasillo norte.","size":16,"bold":false},{"kids":[{"text":"Mantenimiento · SIM-2026-11","size":22,"bold":true},{"text":"Luz de señalización apagada en pasillo norte.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"label":"Volver al reporte","target":"reporte"}]},
  "ptt_admin": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Canal de voz del centro de control","size":28,"bold":true},{"text":"HU-38  |  Canal de voz del centro de control","size":16,"bold":false},{"kids":[{"text":"Sector norte · Canal de brigada","size":22,"bold":true},{"text":"Luis Paredes + Centro de control\nMicrófono: simulado. No se captura ni transmite audio real.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"label":"Mantener pulsado","target":"transmision-del-centro-de-control"},{"label":"Volver a misiones","target":"misiones"},{"text":"QoS, codec, redes 2G y latencia: fuera del alcance demostrable en Figma.","size":16,"bold":false}],"mobile":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Canal de voz del centro de control","size":28,"bold":true},{"text":"HU-38  |  Canal de voz del centro de control","size":16,"bold":false},{"kids":[{"text":"Sector norte · Canal de brigada","size":22,"bold":true},{"text":"Luis Paredes + Centro de control\nMicrófono: simulado. No se captura ni transmite audio real.","size":18,"bold":false}],"bg":"#ffffff","row":false,"pad":20,"gap":16},{"kids":[{"text":"Mantén pulsado para hablar","size":18,"bold":true}],"bg":"#111111","row":true,"pad":16,"gap":0},{"label":"Volver a misiones","target":"misiones"},{"text":"QoS, codec, redes 2G y latencia: fuera del alcance demostrable en Figma.","size":16,"bold":false}]},
  "transmision-del-centro-de-control": {"desktop":[{"text":"Administrador · Sede Central / Edificio B","size":16,"bold":false},{"text":"Transmisión del centro de control","size":28,"bold":true},{"text":"HU-38  |  Transmisión del centro de control","size":16,"bold":false},{"kids":[{"text":"Transmitiendo · Simulación","size":22,"bold":true},{"text":"Canal norte · Mensaje de voz de demostración. No se usa el micrófono ni existe comunicación de red.","size":18,"bold":false}],"bg":"#eaf3ff","row":false,"pad":20,"gap":16},{"label":"Finalizar transmisión simulada","target":"ptt_admin"}]}
};
export const relatedActions = {
  "perfil": [
    {
      "label": "Modo mate · Alto contraste",
      "target": "contraste"
    },
    {
      "label": "Tamaño de texto · 100 % → 200 %",
      "target": "texto200"
    }
  ],
  "inicio": [
    {
      "label": "Preparar mapa offline",
      "target": "offline"
    },
    {
      "label": "Escenario visual · Voz y alto contraste",
      "target": "contraste"
    }
  ],
  "alerta": [
    {
      "label": "Activar alto contraste",
      "target": "contraste"
    },
    {
      "label": "Escuchar instrucciones · Simulado",
      "target": "voz"
    },
    {
      "label": "Ver cancelación de falsa alarma",
      "target": "falsa"
    }
  ],
  "ruta": [
    {
      "label": "Repetir instrucción · Simulado",
      "target": "voz"
    },
    {
      "label": "Ver bloqueo de ruta",
      "target": "bloqueo"
    }
  ],
  "mapa": [
    {
      "label": "Ver puertas y pendientes",
      "target": "detalles"
    },
    {
      "label": "Reportar obstáculo",
      "target": "obstaculo"
    }
  ],
  "sos": [
    {
      "label": "Ver fallo de envío simulado",
      "target": "offline"
    }
  ],
  "comunicar": [
    {
      "label": "Requiero comunicación gestual / señas",
      "target": "mensaje_ok"
    }
  ],
  "chat": [
    {
      "label": "Estoy bien",
      "target": "mensaje_ok"
    },
    {
      "label": "Simular fallo de red",
      "target": "chat_fallo"
    }
  ],
  "refugio": [
    {
      "label": "Simular refugio lleno",
      "target": "lleno"
    }
  ],
  "dispositivos": [
    {
      "label": "Consultar mapa sin conexión",
      "target": "offline"
    }
  ],
  "misiones": [
    {
      "label": "Canal Push-To-Talk",
      "target": "ptt"
    },
    {
      "label": "Intentar ajustes globales · Acceso restringido",
      "target": "denegado"
    }
  ],
  "mision": [
    {
      "label": "Abrir canal Push-To-Talk",
      "target": "ptt"
    }
  ],
  "sector": [
    {
      "label": "Deslizar para confirmar",
      "target": "sector-despejado"
    }
  ],
  "asignar": [
    {
      "label": "Asignar a Luis Paredes",
      "target": "asignacion"
    },
    {
      "label": "Simular falta de disponibilidad / 30 s",
      "target": "reasignada"
    }
  ],
  "zonas": [
    {
      "label": "Lleno",
      "target": "estado-de-refugio-actualizado"
    }
  ],
  "brigadas": [
    {
      "label": "Brigadista",
      "target": "sector_asignado"
    },
    {
      "label": "Canal Push-To-Talk",
      "target": "ptt_admin"
    }
  ],
  "censo": [
    {
      "label": "Ver censo tras nuevo ingreso · Muestra",
      "target": "censo_actualizado"
    }
  ],
  "visitante": [
    {
      "label": "Necesidad: texto e indicaciones visuales",
      "target": "visitante_seleccion"
    }
  ],
  "reporte": [
    {
      "label": "Ver gráficos y preparar PDF / Excel",
      "target": "exportado"
    },
    {
      "label": "Consultar auditoría de mantenimiento",
      "target": "observaciones_admin"
    }
  ],
  "roles": [
    {
      "label": "Revocar acceso de demostración",
      "target": "revocado"
    }
  ],
  "visita-ok": [
    {
      "label": "Consultar datos del ingreso",
      "target": "visitante_seleccion"
    },
    {
      "label": "Registrar salida",
      "target": "salida_visita"
    }
  ],
  "mapa-brigada": [
    {
      "label": "Canal Push-To-Talk",
      "target": "ptt"
    }
  ]
};
