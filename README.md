# EvacuAccess

Aplicación web responsive para explorar la evacuación inclusiva y la coordinación entre personas con necesidades de accesibilidad, brigadistas y administración. Implementada en HTML, CSS y JavaScript nativos sobre el [Figma oficial](https://www.figma.com/design/vNZs4J1ms6hxHErWETquDB/).

**Entorno de prueba · Servicios de emergencia no conectados.** Las interacciones funcionan en el navegador; no sustituyen un sistema operativo de emergencias.

Repositorio: [nahurramos-spec/landing-page-evacuacces](https://github.com/nahurramos-spec/landing-page-evacuacces).

GitHub Pages está configurado mediante Actions. La URL asignada es [EvacuAccess](https://nahurramos-spec.github.io/landing-page-evacuacces/); publicación y comprobación pendientes. El estado verificable se registra en [despliegue](docs/despliegue.json).

## Problema y propuesta

Una alerta basada únicamente en sonido, una ruta con escaleras o una solicitud sin contexto pueden dificultar la evacuación. La falta de un censo compartido también complica la coordinación de rescates.

EvacuAccess reúne alertas accesibles, preferencias, rutas, SOS, comunicación no verbal, refugios, asignaciones y reportes. El estado central relaciona personas, solicitudes y misiones para mantener consistentes los contadores y las vistas de cada perfil.

## Usuarios y funcionalidades

- Personas con discapacidad auditiva, visual, motriz o necesidades de comunicación: alertas, narración, contraste, PPE, orientación, SOS, chat y refugios.
- Visitantes: registro accesible y confirmación de llegada segura.
- Brigadistas: necesidades, asignaciones, misiones, rescates y despeje.
- Administración: dashboard, plano, censo, alertas, refugios y reportes.

La landing ofrece siete entradas. «Opciones del entorno» cambia el perfil o restablece los datos. Los controles secundarios permiten ensayar fallos, desconexión y sensores sin presentarlos como conexiones reales.

## Las 30 historias de usuario core

Se conserva el conjunto oficial de **30 HU y 90 criterios de aceptación**. La [matriz de trazabilidad](docs/hu-trazabilidad.md) relaciona cada criterio con fuentes, interacción, evidencia y límites. La presencia de una HU no implica que sus servicios físicos o externos estén implementados.

| HU | Funcionalidad del diseño oficial |
|---|---|
| HU-02 | Alertas por vibración háptica |
| HU-03 | Alertas estroboscópicas e indicadores visuales |
| HU-04 | Narración por síntesis de voz |
| HU-05 | Modo mate y antiparpadeo |
| HU-06 | Confirmación de recepción de alerta |
| HU-07 | Orientación direccional |
| HU-08 | Ayuda gestual / lengua de señas |
| HU-10 | A salvo en zona segura |
| HU-12 | Tarjetas de comunicación no verbal |
| HU-17 | Ruta totalmente accesible sin escaleras |
| HU-18 | Ascensores bloqueados y reenrutamiento |
| HU-21 | SOS y ubicación interior |
| HU-24 | Brigadista en camino |
| HU-25 | Tiempo de desplazamiento adaptado |
| HU-27 | Chat rápido de emergencia |
| HU-29 | Zona de Refugio Temporal |
| HU-31 | Dashboard administrativo responsive |
| HU-32 | Localización de personas en tiempo real |
| HU-33 | Alertas masivas o sectorizadas |
| HU-34 | Asignación de brigadistas |
| HU-36 | Necesidades de comunicación accesible |
| HU-37 | Registro manual de rescates |
| HU-39 | Estado de zonas de refugio |
| HU-40 | Reportes post-evento y auditoría |
| HU-41 | Brigadistas activos por sector |
| HU-42 | Eventos de sensores IoT |
| HU-43 | Manual de transferencia asistida |
| HU-44 | Usuario inmóvil o sin señal |
| HU-45 | Servicios de emergencia externos |
| HU-47 | Sector totalmente evacuado |

## Tecnologías y estructura

HTML semántico, CSS responsive, módulos ES, localStorage y APIs de voz/vibración cuando están disponibles. Node.js 22 para herramientas, Playwright y axe para pruebas, GitHub Actions/Pages para publicación. Sin dependencias de ejecución ni backend.

```text
evacuaccess/
├── .github/workflows/pages.yml
├── assets/
│   ├── images/                 Retratos ficticios del diseño
│   ├── icons/                  SVG originales; incluye favicon
│   └── fonts/                  Atkinson Hyperlegible y licencia
├── css/                        Estilos, responsive y accesibilidad
├── js/
│   ├── main.js                 Entrada, navegación, formularios y modales
│   ├── state.js                Estado, validación, transiciones y CSV
│   ├── landing.js              Landing y entradas por perfil
│   ├── evacuation.js           Recorridos de usuario y visitantes
│   ├── administration.js       Coordinación, censo y reportes
│   ├── brigadier.js            Misiones y rescates
│   ├── map.js                  Plano y estados compartidos
│   ├── ui.js                   Componentes reutilizables
│   └── team.js                 Integrantes editables
├── docs/
│   ├── hu-trazabilidad.md
│   ├── escenarios-prueba.md
│   ├── resultados-qa.md
│   ├── limitaciones-tecnicas.md
│   ├── capitulo-v.md
│   ├── organizacion-repositorio.md
│   ├── despliegue.json
│   ├── figma/                  Referencias oficiales
│   └── evidencias/             Resultados y capturas, incluidas históricas
├── tests/                      Pruebas y herramientas locales
├── index.html
├── .gitignore
├── .nojekyll
├── package.json
├── package-lock.json
└── README.md
```

Las vistas por hash no necesitan pages/. No hay vídeos; se omite assets/videos/. Se conserva el favicon SVG existente. node_modules/ y dist/ permanecen ignorados; dist/ se regenera desde los fuentes y no debe editarse.

## Instalación y ejecución local

Requisito: Node.js 22 o superior y npm.

```powershell
git clone https://github.com/nahurramos-spec/landing-page-evacuacces.git
cd landing-page-evacuacces
npm ci
npm start
```

Abrir **http://127.0.0.1:4173**. Los módulos requieren HTTP; no abrir index.html con file://. El sitio publicado no necesita Node.js.

## Pruebas reproducibles

Mantener npm start en otra terminal. Se utiliza Chrome instalado en Windows, si existe; en otros sistemas instalar Chromium de Playwright. CHROME_PATH permite indicar otro ejecutable. BASE_URL cambia el origen de las pruebas de navegador/producto y comparaciones; las comprobaciones puntuales y de dist/ usan el servidor local.

```powershell
npx playwright install chromium
npm test
npm run test:state:evidence
npm run test:browser
npm run test:product
node tests/targeted.mjs
npm run build
npm run test:static
node tests/visual-compare.mjs
node tests/documentation.mjs
```

El generador documental utiliza el TAP y los JSON guardados; no ejecuta pruebas ni transforma fallos en aprobaciones. Los [resultados de QA](docs/resultados-qa.md) y [escenarios](docs/escenarios-prueba.md) contienen las ejecuciones reales. Hay capturas de 390, 768, 1024 y 1440 px; las comparaciones con Figma no se presentan como porcentajes de fidelidad.

## Recorrido sugerido

1. Entrar por «Discapacidad auditiva», confirmar la alerta y seguir la ruta.
2. Abrir SOS y leer la confirmación local; ensayar fallo y reintento desde «Controles de prueba».
3. Cambiar a Administración, asignar un brigadista y revisar el censo.
4. Volver al usuario para consultar asignación, ETA y chat compartido.
5. Entrar como Brigadista, revisar necesidades y confirmar el rescate.
6. Consultar el dashboard y descargar el CSV o abrir impresión.

Los rescates requieren misiones válidas y confirmación. El despeje exige completar rescates y llegadas, además del deslizador y su casilla. Registrar un visitante incrementa el censo una sola vez.

## Accesibilidad

Atkinson Hyperlegible local, etiquetas y estructura semántica, salto al contenido, foco visible, teclado, anuncios de estado, texto ampliable al 200 %, contraste mate y respeto por movimiento reducido. La voz dispone de transcripción y la vibración de alternativa visible. Axe verifica reglas automatizables; no se afirma conformidad WCAG completa ni validación humana que no se haya realizado.

## Publicación

Se reutiliza origin y la rama main. La única estrategia es **GitHub Actions → artefacto dist/ → GitHub Pages**. El workflow instala dependencias y Chromium, ejecuta estado/navegador/producto/comprobaciones puntuales, genera y verifica el paquete, conserva evidencias de CI y publica. Pages usa GitHub Actions. Los recursos relativos y las rutas por hash permiten servir bajo el subdirectorio del repositorio.

Consultar las [ejecuciones](https://github.com/nahurramos-spec/landing-page-evacuacces/actions/workflows/pages.yml) y el [capítulo V](docs/capitulo-v.md). Cada push a main o ejecución manual vuelve a validar y desplegar. No se suben dependencias, credenciales ni carpetas generadas.

## Límites técnicos

Estado compartido entre módulos del mismo navegador, sin sincronización entre dispositivos, cuentas reales ni servidor. SOS, alertas y paquete externo no transmiten a servicios de emergencia. Ubicación interior, sensores, temporizadores externos y desconexiones usan datos o controles locales. El registro de visitantes no integra cámara. Voz y vibración dependen del navegador/hardware y no están certificadas físicamente. El manual de transferencia requiere contenido profesional aprobado. CSV genera un archivo real; PDF usa impresión del navegador, cuyo diálogo nativo no se valida en headless. Detalle por HU en [limitaciones técnicas](docs/limitaciones-tecnicas.md).

## Equipo

Los integrantes se incorporarán cuando se proporcionen nombres y roles reales. Editar js/team.js: la landing publica únicamente fichas completas. Esta entrega no inventa nombres, cargos ni fotografías.

## Fuentes y licencias

docs/figma/ conserva criterios y referencias del archivo oficial, consultado sin modificarlo. Los retratos son personajes ficticios del diseño, no integrantes del equipo. Atkinson Hyperlegible incluye su licencia en assets/fonts/OFL.txt. Conservar atribuciones y comprobar los permisos de recursos de Figma para usos ajenos a esta entrega.
