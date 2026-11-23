# Revisión visual comparativa

Esta revisión se actualiza con la [corrección de interfaz de producto](revision-producto.md): aviso global, textos naturales, controles de prueba secundarios, SOS compacto, solicitudes seleccionables y formulario de visitantes ajustado. Las capturas y mediciones se regeneraron; las diferencias de copy académico respecto a Figma son deliberadas y responden a esta corrección.

Fuente: archivo oficial `vNZs4J1ms6hxHErWETquDB`, en modo de lectura. Se consultaron sistema visual, arquitectura, flujos, conexiones de los siete puntos de entrada, mockups originales y los nodos específicos de las 30 HU. No se modificó Figma.

La metadata y los contextos de implementación están en `figma/`. Las imágenes de referencia se exportaron por nodo. Las capturas de implementación usan 1440 × 900 y 390 × 844. No se utilizan capturas como fondos ni como sustitutos de controles en la aplicación.

## Evidencia

`evidencias/qa-browser.json` relaciona las 17 interfaces con sus exportaciones originales y sus capturas. `tests/visual-compare.mjs` genera diez láminas comparativas y `comparacion-pixeles.json`, con error absoluto medio RGB (escala 0–255) y conteo de píxeles cuya diferencia supera 30 en algún canal. Las diferencias de estado y contenido funcional adicional también influyen. No se interpreta esa medición como porcentaje de coincidencia.

Se revisaron visualmente las parejas de Acceso, Perfil, Alerta, Contraste, PPE, Ruta, Mapa, SOS, Comunicación, Misiones, Detalle de rescate, Dashboard, Emisión, Solicitudes, Censo, QR y formulario de visitante. También se inspeccionaron las capturas de landing a 390, 768 y 1440 px.

## Ajustes derivados de la comparación

- Se conservan la tipografía Atkinson, los colores por función, las superficies planas, los bordes y los radios originales. Se restauraron los tamaños nativos de los iconos individuales y los marcadores del plano.
- La alerta móvil abre con el título sobre rojo, sin el encabezado de contenido de Desktop. El modo contraste usa negro mate y amarillo, con título abreviado en Mobile.
- Se amplió el control de confirmación para cumplir el área del CA01 de HU-06. Se mantuvo fuera del área desplazable el SOS.
- El plano móvil conserva cuatro ambientes por fila; al 200 % se reorganiza para preservar espacio de lectura. La leyenda incluye las necesidades y las posiciones son de muestra.
- La emisión utiliza opciones de selección con apariencia de botones y radios accesibles, conservando tipo, alcance y mensaje adaptativo del original. La confirmación requiere un modal.
- Se incorporaron el icono de confirmación del SOS y el fondo verde pálido original `#EAF4EE`. El registro QR conserva el panel informativo azul y el icono individual del diseño.
- Los aforos del plano se muestran en tinta: el verde original sobre azul pálido no pasó la prueba de contraste de texto pequeño. Las etiquetas siguen comunicando disponibilidad mediante texto.

## Diferencias que se conservan y límites

La implementación no se declara idéntica píxel por píxel. Los formularios editables, controles de ensayo, barras de progreso y datos calculados amplían el prototipo; algunas tarjetas y alturas difieren. La tabla del censo muestra las personas reales del estado, en lugar de una pantalla fija de muestra. Las solicitudes varían con la prioridad activada; las fotos y la asignación solo aparecen cuando la misión existe.

La navegación ofrece un menú móvil operable y acceso a controles del escenario. En brigada se ofrece chat funcional en lugar de aparentar una comunicación de voz en red. El dashboard representa los cuatro brigadistas detallados en el modelo, por lo que no reproduce el dato fijo «6 de 8» sin respaldo en registros. Las zonas y contadores siempre se obtienen del estado actual.

La composición no se rediseñó con una dirección artística aleatoria. Se mantuvo la referencia proporcionada. El inspector estético genérico se ejecutó y observó la tipografía cargada y los títulos principales. Sus condiciones de varias fotografías y movimiento no se aplican frente a la solicitud de conservar el diseño y evitar animaciones innecesarias. La landing contiene un fragmento real de la aplicación y fotografías únicamente donde existen en el Figma de la aplicación; no se inventaron retratos de integrantes.

Esta revisión técnica no sustituye la aceptación visual del propietario del diseño ni la validación con personas usuarias. Las capturas permiten continuar una revisión detallada sin inventar una cifra de fidelidad.
