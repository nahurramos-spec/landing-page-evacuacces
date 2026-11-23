# Corrección de la interfaz de EvacuAccess

La intervención modifica los módulos existentes. Se conserva el estado central, las 30 HU, la navegación por roles, los contadores, preferencias, rutas, chat, asignaciones, rescates y reportes. No se reconstruyó la landing ni se cambió el sistema visual.

## Textos y transparencia

- Se sustituyeron las llamadas académicas por acciones de producto: «Comenzar», «Ingresar a EvacuAccess», «Mensaje», «Registro de visitantes» y «Consultar asistencia».
- Cabeceras y navegación ya no repiten «Prototipo académico», «Demo» o explicaciones de implementación. El aviso «Entorno de prueba · Servicios de emergencia no conectados» permanece visible en la landing y en la aplicación.
- SOS requiere una confirmación explícita antes de registrar la solicitud. Cancelar el modal no registra el envío. La emisión de alertas también informa que no habrá transmisión a dispositivos o servicios reales antes de confirmar.
- La solicitud se presenta como **registrada**, sin atribuir recepción a brigadistas ni a servicios externos. Los paquetes externos quedan **preparados y sin enviar**.
- Las explicaciones técnicas extensas se mantienen en README y en las limitaciones. Las advertencias profesionales imprescindibles —como la falta del protocolo de transferencia— permanecen visibles y concisas.
- Las entradas antiguas del historial se presentan con texto actualizado sin borrar ni alterar sus registros originales. Los mensajes escritos por el usuario no se reescriben.

## Ajustes visuales y de navegación

Se volvió a consultar Figma en modo lectura: SOS Desktop/Mobile, solicitudes Mobile, registro Desktop/Mobile, misión Desktop/Mobile y dashboard Desktop/Mobile. Se usaron sus componentes y las exportaciones originales ya conservadas en `docs/figma`. Se mantuvieron Atkinson Hyperlegible, los colores, radios e iconos originales.

| Vista | Problema corregido | Resultado |
|---|---|---|
| SOS | El icono podía estirarse al ancho del contenedor; había demasiadas acciones y datos en la primera vista | Icono fijo en sus 56 × 56 originales, tarjeta de estado breve, acción principal para consultar asignación y acceso directo a comunicación |
| Asistencia | La asignación y los controles de prueba sobrecargaban SOS | La ficha del brigadista se consulta desde SOS, con la misma foto, identificación y ETA compartidas |
| Solicitudes Mobile | Todas las tarjetas repetían una acción principal grande y mucho contenido | Solicitud principal detallada y tarjetas secundarias compactas seleccionables, manteniendo su ID, ubicación y asignación |
| Visitantes | Campos genéricos, cancelación duplicada y contenido técnico dominante | Campos amplios dentro de tarjetas, selector legible, botón de registro visible y una sola cancelación persistente |
| Misión | Necesidades repetidas, mensajes vacíos y explicación técnica extensa | Tres paneles claros: persona y destino, comunicación accesible y PPE; se conserva la necesidad enviada cuando existe |
| Dashboard | Proporciones móviles y textos de ensayo repetidos | Métricas alineadas por su contenido, separación de 16 px en Mobile y textos calculados desde el estado |
| Landing Mobile | CTA académico largo y fichas de integrantes sin datos | Acceso breve en cabecera, «Comenzar» como CTA principal y sección Equipo condicional |

«Controles de prueba» conserva fallo de SOS, bloqueo de ascensores, pérdida de conexión, refugio lleno, reasignación, sensores y prioridad manual. «Opciones del entorno» conserva cambio de perfil, contraste, restablecimiento, consulta del alcance y registro de llegadas por sector. Los paneles abiertos se conservan al actualizar una vista y se operan por teclado.

## Equipo

`js/team.js` conserva la estructura editable. Solo se renderizan personas con nombre y rol completos; cuando no existen integrantes confirmados, se omiten la sección y su enlace de cabecera. No se inventan personas, fotografías ni cargos, y no se muestran textos de pendiente.

## Validación y evidencias

Los resultados reales se generan en [resultados-qa.md](resultados-qa.md). La regresión de producto está en [qa-producto.json](evidencias/revision-producto/qa-producto.json), con 24 capturas de las seis pantallas prioritarias en cuatro anchos y pruebas específicas de los avisos críticos. Se conservaron capturas anteriores en `evidencias/revision-producto/antes/` para revisar cambios.

Las capturas principales y las láminas Figma/implementación se regeneran mediante `tests/browser.mjs` y `tests/visual-compare.mjs`. Las fixtures de solicitudes y dashboard activan respectivamente prioridad y bloqueo de ascensores para corresponder a los estados mostrados por las referencias originales. Esto no modifica los datos iniciales de la aplicación.

El aviso global ocupa una franja adicional y los textos de producto difieren deliberadamente del copy académico de Figma. Por ello, las diferencias de píxeles incluyen esos cambios autorizados; no se presenta un porcentaje de fidelidad.

## Limitaciones que permanecen

Persistencia y comunicación en el navegador, sin backend, autenticación real ni sincronización entre dispositivos. SOS, alertas y paquetes no se transmiten a servicios externos. Posiciones, rutas, sensores y ETA usan datos de prueba. Voz y vibración dependen del navegador y hardware. El manual físico y la certificación de refugios requieren validación profesional. La publicación remota sigue pendiente de configurar GitHub. Detalle completo en [limitaciones-tecnicas.md](limitaciones-tecnicas.md).

El manifiesto [archivos-modificados.json](evidencias/revision-producto/archivos-modificados.json) identifica los archivos fuente y de pruebas que cambiaron respecto a la implementación revisada.
