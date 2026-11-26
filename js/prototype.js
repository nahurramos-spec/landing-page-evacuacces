import { mockups } from "./mockups.js";

const variants = {
  desktop: { page: "0:1", start: "2:9141" },
  mobile: { page: "36:5913", start: "65:8131" },
};

export function openPrototype(root) {
  root.innerHTML = `<main id="main-content" class="prototype-view">
    <nav aria-label="Controles del prototipo">
      <a href="#landing">Volver a la portada</a>
      <label>Pantalla <select aria-label="Pantalla del prototipo"></select></label>
      <a href="#/recorridos">Usar la aplicación local</a>
      <a class="prototype-original" target="_blank" rel="noopener">Abrir en Figma</a>
    </nav>
    <iframe title="EvacuAccess · Prototipo interactivo" allowfullscreen></iframe>
  </main>`;
  const media = matchMedia("(max-width: 767px)");
  const select = root.querySelector("select");
  const frame = root.querySelector("iframe");
  const original = root.querySelector(".prototype-original");
  function show() {
    const variant = variants[media.matches ? "mobile" : "desktop"];
    const params = new URLSearchParams({
      "page-id": variant.page, "node-id": select.value,
      "starting-point-node-id": variant.start, scaling: "scale-down",
      "embed-host": "EvacuAccess", "hide-ui": "1",
    });
    const path = "/proto/vNZs4J1ms6hxHErWETquDB/EvacuAccess?" + params;
    frame.src = "https://embed.figma.com" + path;
    original.href = "https://www.figma.com" + path;
  }
  function populate() {
    const key = media.matches ? "mobile" : "desktop";
    const previous = select.selectedOptions[0]?.textContent;
    const options = mockups[key].map(({name, id}) =>
      new Option((name.split("|")[1] || name).trim(), id));
    select.replaceChildren(new Option("Elegir recorrido", variants[key].start), ...options);
    const matching = options.find(option => option.textContent === previous);
    if (matching) select.value = matching.value;
    show();
  }
  select.addEventListener("change", show);
  media.addEventListener("change", populate);
  window.addEventListener("hashchange", () => media.removeEventListener("change", populate), { once: true });
  populate();
}
