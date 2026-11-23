# Alcance técnico y pendientes

EvacuAccess es una demostración estática académica. Las 30 HU core tienen controles locales o una consulta explícita de su dependencia pendiente. La cobertura de interacciones no significa que estén implementadas las integraciones físicas de esas historias.

- Los roles se seleccionan sin autenticación. La restricción de vistas es una ayuda de navegación; no constituye autorización segura. PPE y mensajes contienen únicamente datos ficticios.
- El estado se guarda en `localStorage` de este origen. Las vistas y pestañas del mismo navegador lo comparten. No existe sincronización entre dispositivos, servidor, WebSockets, push ni mensajería de emergencias real. Si se bloquea el almacenamiento, la aplicación informa que conserva el estado en memoria.
- Vibración y voz dependen de la implementación, permisos y dispositivos del navegador. El test de Chrome comprueba la solicitud a la API y el fallback visible; no certifica vibración física ni que una persona escuche audio. No se controla volumen del sistema ni dispositivos externos.
- No hay destellos, efectos estroboscópicos ni superposición en la pantalla bloqueada. Las prioridades usan texto y bordes estáticos.
- Las rutas, puertas, rampa de 6 %, posiciones y sectores son datos de ejemplo. No existe GPS, posicionamiento indoor, geofencing, baliza física ni cálculo de rutas sobre un edificio real.
- La ETA personal se calcula con distancia de muestra ÷ ritmo ÷ 60 y se redondea al minuto más próximo, con mínimo 1 min. La ETA de Luis (2 min) y Carla (3 min) es ficticia. El margen de 5 min no es un límite profesional de seguridad.
- Refugio A comienza con 3/8 y B con 2/6 personas. Un estado operativo «Lleno» bloquea nuevos ingresos aunque el conteo registrado sea menor: se trata de un evento de escenario, sin inventar personas para llenar el contador. La certificación cortafuego está pendiente.
- Sensores, 120 s sin movimiento, desconexión >30 s y reasignación tras 30 s se activan manualmente. No se detectan señales ni tiempos externos.
- El chat implementa texto, respuestas rápidas y reintento local. Compresión de audio menor de 50 KB, servicio en segundo plano y red de mensajería no implementados.
- HU-43 y CA02 de HU-36 requieren un protocolo profesional aprobado. Solo existe la consulta del documento pendiente. No se inventan técnicas, ilustraciones ni dotaciones para transferir personas.
- El paquete externo conserva una fotografía del censo al prepararlo y expira al cerrar el evento. No genera URL, token, cifrado ni envío a Bomberos/SAMU.
- El CSV se descarga realmente. «Imprimir / Guardar como PDF» abre el diálogo de impresión del navegador: el usuario elige impresora o archivo. No hay generación directa de PDF ni archivo Excel nativo. El CSV puede abrirse en una hoja de cálculo.
- El QR es un control de acceso simulado. No usa cámara ni valida identidad. El ingreso del visitante añade una persona ficticia al censo y permite confirmar su propia llegada.
- Se mantienen las 65 personas iniciales del prototipo y sus cuatro contadores. Solo se detallan cuatro brigadistas sobre los que hay acciones, por lo que el dashboard muestra ese universo de muestra, en lugar de repetir «6 de 8» sin ocho registros disponibles.
- El despeje necesita deslizador al 100 %, verificación deliberada y censo sin personas pendientes en el sector. El control de «Registrar llegadas» permite demostrar la llegada de las personas no asociadas a misiones, después de completar los rescates.
- La landing extiende el sistema visual; no existe una landing completa original que pueda reproducirse exactamente. El equipo se configura en `js/team.js`; la sección y su enlace solo se publican cuando hay integrantes con nombre y rol completos. No se muestran placeholders ni se inventan integrantes o fotografías.

## Validación pendiente fuera del entorno

Revisión humana con personas usuarias, lectores de pantalla reales, dispositivos con vibración, Safari/Firefox, contenido profesional de rescate y un edificio validado. La auditoría axe no sustituye estas revisiones. El texto al 200 % se comprobó en las 17 interfaces principales a 390 y 1440 px para detectar desbordamiento horizontal; la legibilidad humana a ese tamaño sigue pendiente de evaluación.

La publicación en GitHub Pages está preparada, pero este workspace no tenía repositorio ni remoto. No hay URL pública verificada. Véase `README.md` para publicar.
