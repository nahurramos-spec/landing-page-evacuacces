# Resultados de QA

Ejecución local: 2026-11-23T01:00:14.736Z. Navegador: Chrome 157.0.8103.79, modo headless en Windows.

- Estado: **24 aprobadas, 0 fallidas**, evidencia TAP.
- Navegador: **31 aprobadas, 0 fallidas**.
- Capturas y auditorías axe: 34 vistas/resoluciones. 0 vistas con infracciones detectadas de las reglas WCAG 2 A/AA y 2.1 AA evaluadas. No es una certificación completa WCAG.
- 0 errores JavaScript; 0 respuestas HTTP de error entre los recursos ejercitados.
- 390, 768, 1024 y 1440 px: landing y dashboard sin desbordamiento de página.
- Texto 200 %: 17 interfaces a 390 y 1440 px sin desbordamiento horizontal de la página ni del área principal. No sustituye la validación humana de legibilidad.
- CSV descargado y PDF generado con el motor de impresión de Chrome. El botón de impresión se verificó por invocación; no se probó el diálogo nativo del sistema operativo en headless.

[Casos completos](escenarios-prueba.md), [JSON de navegador](evidencias/qa-browser.json), [TAP del estado](evidencias/qa-state.tap), [CSV real](evidencias/reporte-prueba.csv), [PDF de impresión](evidencias/reporte-impresion.pdf).

## Incidencias corregidas

| Incidencia observada | Corrección | Verificación |
|---|---|---|
| Botón de alerta móvil por debajo del 40 % de área | Se aumentó el área y se eliminó la reserva de scrollbar que reducía su ancho | Aserción de geometría Desktop/Mobile aprobada |
| Verde sobre azul pálido insuficiente para texto pequeño | Etiquetas de aforo en tinta sobre el fondo original | Auditorías axe posteriores sin esa infracción |
| Tabla del censo desbordaba el contenedor móvil | Reorganización como filas apiladas, etiquetas y ancho fijo | Capturas móviles, overflow y axe aprobados |
| Pruebas leían contenido antes del evento hashchange | Espera del título y del contenido con aserciones reintentables de Playwright | Recorridos de tarjeta y protocolo aprobados |
| Captión del censo adoptaba un ancho mínimo de tabla al apilar filas | Caption con ancho de bloque en Mobile | Comparación visual posterior |
| Comparación de píxeles se ejecutaba en origen vacío | El comparador abre primero el origen local | Métricas generadas desde el mismo origen |

## Alcance de la prueba visual

Se exportaron referencias originales y se tomaron capturas de la implementación. Las láminas comparativas y el error RGB medido están en evidencias. Las diferencias de contenido funcional, estados o controles también alteran esos valores; **no se expresa un porcentaje de fidelidad**. Véase [revisión visual](revision-visual.md).

El inspector estético genérico se ejecutó. Sus exigencias de varias fotografías y movimiento se exceptúan frente al pedido de mantener el sistema de Figma y evitar animaciones innecesarias. No se usa ese inspector para afirmar fidelidad al prototipo.

## Paquete estático y subdirectorios

5 comprobaciones aprobadas: sintaxis/importaciones, recursos CSS, matriz exacta, recorrido bajo dist/ y foco del menú. [Evidencia del paquete](evidencias/qa-static.json).

## Comprobaciones puntuales finales

3 casos adicionales aprobados: PPE/salto al contenido en Desktop y Mobile, y acceso a la aplicación desde landing móvil con texto ampliado. [Evidencia](evidencias/qa-targeted.json).

## Corrección de interfaz de producto

Ejecución: 2026-11-23T01:00:09.371Z. 7 casos aprobados y 0 fallidos. 24 capturas de seis pantallas prioritarias a 390, 768, 1024 y 1440 px. Se comprobó aviso global visible, geometría del icono SOS de 56 × 56, botón de registro completamente visible, ausencia de desbordamiento y auditoría axe sin infracciones en esas capturas. Se verificaron cancelación y confirmación de SOS, aviso previo de emisión, selección de R-015 y presentación del historial anterior sin borrar datos.

[Evidencia JSON](evidencias/revision-producto/qa-producto.json) · [Informe de cambios](revision-producto.md). Los fallos, bloqueos y sensores se operan desde «Controles de prueba»; su disponibilidad sigue cubierta por las pruebas de navegador.

## Reorganización y entrega

Las pruebas anteriores se ejecutaron tras el traslado a js/main.js y assets/images/. Los 25 estilos y recursos visuales conservan su SHA-256. Se añadió una prueba de compatibilidad con las sesiones guardadas anteriormente. Véase [organización del repositorio](organizacion-repositorio.md) y [estado de publicación](despliegue.json).

## Verificación de GitHub Pages

Comprobación pública: 2026-11-23T01:08:12.990Z. [Sitio](https://nahurramos-spec.github.io/landing-page-evacuacces/) · [Actions](https://github.com/nahurramos-spec/landing-page-evacuacces/actions/runs/45092436191) · commit comprobado 994dd33c1acc10a7e8119de677d5af073abc6af7.

- Navegador público: **31 aprobadas, 0 fallidas**. [Evidencia](evidencias/publicado/navegador/qa-browser.json).
- Producto público: **7 aprobadas, 0 fallidas**. [Evidencia](evidencias/publicado/producto/qa-producto.json).
- Recursos HTTP y contenido de los fuentes: **35 aprobadas, 0 fallidas**. [Evidencia](evidencias/publicado/recursos-http.json).

Se repitieron los siete puntos de entrada, las interacciones locales, 34 capturas con axe y seis pantallas prioritarias a 390, 768, 1024 y 1440 px. Los recursos públicos coinciden con los fuentes; no se detectaron errores de JavaScript ni recursos ausentes en las rutas ejercitadas. La comprobación no convierte servicios externos, sensores ni protocolos pendientes en funcionalidades reales.
