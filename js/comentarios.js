/* OBSERVACIONES — AUTOR / EDITOR */

window.AutorStore = (() => {
  const DB_NAME = "siscae-autor-v1";
  const USER = { id: "usr-0142", nombre: "Ana Martínez" };

  let connection;

  function db() {
    if (!connection) {
      connection = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
          request.result.createObjectStore("activos", {
            keyPath: "id"
          });

          request.result.createObjectStore("observaciones", {
            keyPath: "id"
          });
        };

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => {
          reject(
            new Error("No se pudo abrir el almacenamiento del navegador.")
          );
        };
      });
    }

    return connection;
  }

  async function all(store) {
    const database = await db();

    return new Promise((resolve, reject) => {
      const request = database
        .transaction(store)
        .objectStore(store)
        .getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return { USER, all };
})();

document.addEventListener("DOMContentLoaded", async () => {
  const $ = id => document.getElementById(id);

  const escapeHTML = value => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return String(value ?? "").replace(
      /[&<>"']/g,
      character => characters[character]
    );
  };

  const formatDate = value => {
    return new Date(value).toLocaleString("es-SV");
  };

  let assets = [];
  let observations = [];

  /* MENÚ Y FECHA */

  function toggleMenu(open) {
    $("sidebar").classList.toggle("active", open);
    $("mobileOverlay").classList.toggle("active", open);
    $("menuButton").setAttribute("aria-expanded", String(open));
  }

  $("menuButton").addEventListener("click", () => {
    const open = $("menuButton").getAttribute("aria-expanded") !== "true";
    toggleMenu(open);
  });

  $("mobileOverlay").addEventListener("click", () => {
    toggleMenu(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });

  $("currentDate").textContent = new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  function showMessage(text, error = false) {
    $("feedback").hidden = false;
    $("feedback").className = error
      ? "author-feedback error"
      : "author-feedback";

    $("feedback").textContent = text;
  }

  /* LEER ACTIVOS Y OBSERVACIONES */

  async function loadData() {
    [assets, observations] = await Promise.all([
      AutorStore.all("activos"),
      AutorStore.all("observaciones")
    ]);

    assets = assets
      .filter(asset => asset.autorId === AutorStore.USER.id)
      .sort((a, b) => b.actualizado.localeCompare(a.actualizado));

    observations = observations.filter(observation => {
      return assets.some(asset => asset.id === observation.activoId);
    });
  }

  /* FILTRO POR ACTIVO */

  function renderOptions() {
    $("asset-filter").innerHTML = `
      <option value="">Todos los activos</option>

      ${assets.map(asset => `
        <option value="${escapeHTML(asset.id)}">
          ${escapeHTML(asset.nombre)}
        </option>
      `).join("")}
    `;
  }

  /* LISTADO DE OBSERVACIONES */

  function renderObservations() {
    const selectedAsset = $("asset-filter").value;

    const filtered = observations
      .filter(observation => {
        return !selectedAsset ||
          observation.activoId === selectedAsset;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (!filtered.length) {
      $("observation-list").innerHTML = `
        <div class="author-empty">
          <span aria-hidden="true">▤</span>

          <h3>Sin observaciones del revisor</h3>

          <p>
            Aquí aparecerán los comentarios sobre cada activo y su versión
            cuando se conecte el rol de revisor.
          </p>
        </div>
      `;

      return;
    }

    $("observation-list").innerHTML = filtered.map(observation => {
      const asset = assets.find(asset => {
        return asset.id === observation.activoId;
      });

      return `
        <article class="author-version">
          <span class="author-badge">
            ${escapeHTML(observation.estado || "Pendiente")}
          </span>

          <h2>${escapeHTML(asset.nombre)}</h2>

          <p class="author-muted">
            Versión ${escapeHTML(observation.version)}
            · ${escapeHTML(observation.revisor)}
            · ${formatDate(observation.fecha)}
          </p>

          <p class="author-version-note">${escapeHTML(observation.texto)}</p>
        </article>
      `;
    }).join("");
  }

  /* INICIALIZACIÓN */

  try {
    await loadData();
    renderOptions();
    renderObservations();

    $("asset-filter").addEventListener("change", renderObservations);
  } catch (error) {
    showMessage(error.message, true);
  }
});