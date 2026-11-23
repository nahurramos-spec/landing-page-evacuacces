# Organización del repositorio

La entrega conserva la aplicación existente y su diseño. No se reconstruyeron pantallas ni se modificaron los estilos.

## Inspección y decisiones

Se revisaron el árbol completo, dependencias, entradas de HTML, importaciones, recursos CSS, scripts de npm, configuración de Git y workflow. El repositorio local estaba en `main`, sin commits, con el remoto público existente `nahurramos-spec/landing-page-evacuacces`. Se reutiliza ese remoto; no se crea un duplicado ni se fuerza su historial.

## Traslados y referencias

| Origen | Destino | Motivo |
|---|---|---|
| Carpeta JavaScript original | `js/` | Organización solicitada; se conservan nueve módulos |
| Entrada `app.js` | `js/main.js` | Nombre de entrada principal |
| Retratos de la raíz de assets | `assets/images/luis.png`, `assets/images/carla.png` | Separación de imágenes, iconos y fuentes |
| Inspector auxiliar `.taste-skill/` | `docs/evidencias/inspeccion-inicial/` | Conservar capturas e informe histórico |

Se actualizaron HTML, pruebas, generadores, documentación y manifiestos de recursos. Las sesiones locales anteriores migran únicamente las dos rutas de retratos al cargarse; conservan mensajes, preferencias, personas y eventos. La clave de almacenamiento no cambia.

## Limpieza justificada

- `.review-baseline/`: se eliminaron 31 respaldos de fuentes, fragmentos y scripts intermedios de la revisión anterior. La búsqueda de dependencias no encontró consumidores en aplicación, pruebas ni configuración. El inventario con tamaños y SHA-256 está en [reorganizacion.json](evidencias/reorganizacion.json).
- `dddd`: archivo vacío de trabajo, sin referencias; eliminado tras comprobar su tamaño de cero bytes.
- `.taste-skill/`: trasladada, no descartada. Se preservan sus nueve archivos históricos; sus observaciones no se presentan como QA actual.
- `node_modules/`: conservado localmente e ignorado. npm ci lo reproduce desde el lockfile.
- `dist/`: ignorado y regenerado de forma limpia. El build comprueba su destino dentro del proyecto y rechaza un enlace simbólico antes de eliminar la salida generada.
- Las capturas y fallos anteriores de `docs/evidencias/` se conservan para trazabilidad. No representan incidencias actuales sin una ejecución que las confirme.

No se crean directorios vacíos `pages/` ni `assets/videos/`: la aplicación usa rutas hash y no contiene vídeos. Se mantiene el favicon SVG original, sin añadir un archivo ICO ficticio.

## Conservación visual y funcional

El manifiesto [reorganizacion.json](evidencias/reorganizacion.json) registra SHA-256 de 25 estilos y recursos visuales antes y después del traslado: contenido idéntico. Se conservan paleta, fuente, iconografía y composición. La implementación sigue usando un único estado central y conserva las 30 HU y sus 90 criterios oficiales con los límites documentados por fila.

Se añadieron compatibilidad de navegador de pruebas para Linux/Windows y una prueba de recuperación de sesiones antiguas. Los resultados de la ejecución posterior a la reorganización figuran en [resultados de QA](resultados-qa.md); no equivalen a certificar servicios externos ni seguridad física.

## Git y publicación

`.gitignore` excluye dependencias, salida generada, logs, cachés, configuración local del editor, archivos de entorno y claves. La autenticación se resuelve mediante Git Credential Manager; no se incorporan credenciales al repositorio.

Una sola estrategia publica el artefacto `dist/` mediante GitHub Actions. El workflow prueba la aplicación en Chromium, verifica el paquete bajo un subdirectorio, conserva evidencias de CI y despliega. El estado real, SHA y ejecución de Actions se documentan en [despliegue.json](despliegue.json). El README contiene el árbol final, instalación y comandos.
