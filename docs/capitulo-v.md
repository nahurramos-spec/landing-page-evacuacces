# Capítulo V · Implementación de EvacuAccess

## 5.1. Landing Page web · Desktop

La entrada index.html carga módulos nativos de JavaScript y hojas CSS. La landing presenta encabezado, hero, problemática, solución, funcionalidades, perfiles, demostración, equipo y pie de página. El fragmento de ruta del hero es DOM real con el recurso direccional individual de Figma; abre el recorrido de movilidad. Las funcionalidades enlazan situaciones completas, no 30 aplicaciones separadas.

El sistema visual procede del archivo oficial: Atkinson Hyperlegible local, cabecera #2264BC, tinta #111111, fondo #F6F7F8, superficies blancas, información #EAF3FF, bordes #D7DBDF y radio 10 px. La landing es una extensión del sistema, no una pantalla original de Figma. Las 30 HU y sus 90 CA oficiales están en la matriz, con interacción, soporte y evidencia por fila.

La estructura de Equipo permanece editable en js/team.js. La sección y su enlace solo se publican si existen integrantes con nombre y rol completos; no se muestran fichas vacías ni se inventan nombres o fotografías.

## 5.2. Adaptación responsive

Una misma implementación adapta Desktop, Tablet y Mobile. Desktop mantiene navegación de 224 px, cabecera de 64 px y paneles paralelos; Mobile parte de la referencia 390 × 844, cabecera de 56 px y márgenes de contenido de 24 px. El menú abre la navegación por rol desde el teclado o un botón táctil. Los contadores pasan de cuatro columnas a dos; los paneles se apilan cuando sus anchos mínimos dejan de caber. El plano conserva los cuatro ambientes por fila del Figma móvil y se reorganiza al 200 % de texto.

Se comprobaron 390, 768, 1024 y 1440 px, con evidencia de landing y dashboard. La matriz de capturas incluye las interfaces principales Desktop/Mobile y el formulario de visitante. La tabla de censo se transforma en filas legibles, manteniendo sus datos.

## 5.3. Interacciones con el usuario

La navegación usa hash y funciona en subdirectorios estáticos. Los módulos renderizan componentes semánticos sobre un estado central. transition clona el estado, valida invariantes y registra auditoría antes de guardar en localStorage. Los contadores se calculan a partir de personas; las misiones enlazan solicitudes, personas y brigadistas. Ninguna vista conserva un segundo contador independiente.

Los formularios aplican preferencias, PPE, mensajes, registro de visitantes y alcance de alerta. Las alertas masivas y el SOS se revisan en un modal antes de confirmar, con un aviso explícito de que no existe transmisión real. Un aviso global identifica el entorno de prueba. Los controles de fallo/reintento, sensores, bloqueo y desconexión permanecen en paneles secundarios. El SOS conserva fallo/reintento. El chat conserva mensajes pendientes. Los rescates necesitan misiones y confirmación deliberada; su repetición no cambia el censo. El despeje exige slider, verificación y ausencia de personas pendientes. El paquete externo expira al cerrar el evento.

## 5.4. Accesibilidad

Se implementaron HTML semántico, idioma español, etiquetas de formulario, foco visible de 3 px, salto al contenido, modales nativos, anuncio aria-live y estados identificados con texto. Se usa una alerta estática y una transcripción visible para la voz. El modo negro mate/amarillo se aplica sin recarga, persiste y elimina animaciones; se respeta prefers-reduced-motion.

Los controles principales tienen mínimos de 48–64 px. Los marcadores pequeños disponen de un área táctil ampliada y nombre accesible. El slider permite flechas/Fin y una confirmación adicional. Las pruebas ejercitan teclado, menú, Escape y persistencia, e incluyen auditorías axe. No se declara conformidad WCAG integral ni pruebas humanas que no se hayan ejecutado. Véase resultados-qa.md para resultados y límites.

## 5.5. Repositorio del proyecto

Repositorio público existente: [nahurramos-spec/landing-page-evacuacces](https://github.com/nahurramos-spec/landing-page-evacuacces), rama main. Se reutilizó origin. El código se organiza en js/ (entrada main.js y módulos), css/, assets/images/, assets/icons/, assets/fonts/, docs/ y tests/. README.md contiene el árbol, instalación, 30 HU y comandos. node_modules y dist no se versionan. Las evidencias se conservan en docs/evidencias/; véase organizacion-repositorio.md para traslados y limpieza.

## 5.6. Despliegue en GitHub Pages

El workflow pages.yml instala Node.js y Chromium, ejecuta pruebas de estado, navegador, producto y comprobaciones puntuales, genera dist/, verifica sus recursos bajo un subdirectorio y publica el artefacto estático mediante GitHub Actions. Las evidencias de CI se conservan como artefacto. Los recursos son relativos y la navegación por hash evita reescrituras de servidor. El directorio publicado incorpora .nojekyll.

Pages configurado con origen GitHub Actions. URL asignada por GitHub: [EvacuAccess](https://nahurramos-spec.github.io/landing-page-evacuacces/). Estado verificado: Publicado y comprobado: Actions finalizó correctamente y las suites se repitieron sobre la URL pública. Comprobación pública: 2026-11-23T01:08:12.990Z. Commit comprobado en esa fecha: 994dd33c1acc10a7e8119de677d5af073abc6af7. [Ejecución](https://github.com/nahurramos-spec/landing-page-evacuacces/actions/runs/45092436191). Se verificaron carga, recursos y recorridos locales sobre la URL publicada; el detalle figura en despliegue.json y sus evidencias.
