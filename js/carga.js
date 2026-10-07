/* REGISTRAR ACTIVO — AUTOR / EDITOR */

window.AutorStore = (() => {
  const DB_NAME = "siscae-autor-v1";
  const USER = { id: "usr-0142", nombre: "Ana Martínez" };

  /* SHA-256 */

  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);

  function sha256Fallback(bytes) {
    const H = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    const length = bytes.length;
    const paddedLength = ((length + 9 + 63) >> 6) << 6;
    const buffer = new Uint8Array(paddedLength);

    buffer.set(bytes);
    buffer[length] = 0x80;

    const view = new DataView(buffer.buffer);
    const bitLength = length * 8;

    view.setUint32(
      paddedLength - 8,
      Math.floor(bitLength / 0x100000000)
    );

    view.setUint32(paddedLength - 4, bitLength >>> 0);

    const W = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));

    for (let offset = 0; offset < paddedLength; offset += 64) {
      for (let i = 0; i < 16; i++) {
        W[i] = view.getUint32(offset + i * 4);
      }

      for (let i = 16; i < 64; i++) {
        const s0 =
          rotr(W[i - 15], 7) ^
          rotr(W[i - 15], 18) ^
          (W[i - 15] >>> 3);

        const s1 =
          rotr(W[i - 2], 17) ^
          rotr(W[i - 2], 19) ^
          (W[i - 2] >>> 10);

        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }

      let [a, b, c, d, e, f, g, h] = H;

      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + W[i]) | 0;

        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
      }

      H[0] += a;
      H[1] += b;
      H[2] += c;
      H[3] += d;
      H[4] += e;
      H[5] += f;
      H[6] += g;
      H[7] += h;
    }

    return Array.from(
      H,
      value => value.toString(16).padStart(8, "0")
    ).join("");
  }

  async function sha256File(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());

    if (window.crypto?.subtle) {
      try {
        const digest = await crypto.subtle.digest("SHA-256", bytes);

        return Array.from(
          new Uint8Array(digest),
          byte => byte.toString(16).padStart(2, "0")
        ).join("");
      } catch (error) {
        // Utiliza la alternativa si Web Crypto no está disponible.
      }
    }

    return sha256Fallback(bytes);
  }

  /* ALMACENAMIENTO */

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

  async function saveVersion({
    assetId,
    nombre,
    file,
    nota = ""
  }) {
    if (!file || !file.size) {
      throw new Error("Seleccione un archivo que no esté vacío.");
    }

    if (!/\.(pdf|doc|docx|epub)$/i.test(file.name)) {
      throw new Error("Seleccione un libro en PDF, DOC, DOCX o EPUB.");
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error("El archivo debe pesar como máximo 50 MB.");
    }

    if (!assetId && (!nombre || !nombre.trim())) {
      throw new Error("Escriba el nombre del libro.");
    }

    const hash = await sha256File(file);
    const database = await db();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction("activos", "readwrite");
      const store = transaction.objectStore("activos");

      let saved;
      let reason;

      function write(asset) {
        if (!asset) {
          reason = new Error("No se encontró el activo seleccionado.");
          transaction.abort();
          return;
        }

        if (asset.versiones.some(version => version.hash === hash)) {
          reason = new Error(
            "Este archivo ya está registrado en una versión del activo. " +
            "Seleccione un archivo actualizado."
          );

          transaction.abort();
          return;
        }

        const fecha = new Date().toISOString();

        const version = {
          numero: `1.${asset.versiones.length + 1}`,
          archivo: file.name,
          tamano: file.size,
          tipo: file.type,
          file,
          hash,
          fecha,
          nota: nota.trim(),

          firma: {
            algoritmo: "SHA-256",
            firmante: USER.nombre,
            autorId: USER.id,
            fecha
          }
        };

        asset.versiones.push(version);
        asset.actualizado = fecha;
        asset.estado = "Registrado";

        store.put(asset);
        saved = { asset, version };
      }

      if (assetId) {
        const request = store.get(assetId);
        request.onsuccess = () => write(request.result);
      } else {
        const bytes = crypto.getRandomValues(new Uint8Array(16));

        const id = Array.from(
          bytes,
          byte => byte.toString(16).padStart(2, "0")
        ).join("");

        write({
          id,
          nombre: nombre.trim(),
          autorId: USER.id,
          versiones: []
        });
      }

      transaction.oncomplete = () => resolve(saved);

      transaction.onabort = () => {
        reject(
          reason ||
          new Error(
            "No se guardó el archivo. " +
            "Revise el espacio disponible en el navegador."
          )
        );
      };

      transaction.onerror = () => {};
    });
  }

  return { USER, saveVersion, sha256File };
})();

document.addEventListener("DOMContentLoaded", () => {
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

  /* REGISTRAR LIBRO */

  $("register-form").addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Calculando SHA-256 y guardando…";

    try {
      const result = await AutorStore.saveVersion({
        assetId: null,
        nombre: $("nombre").value,
        file: $("archivo").files[0],
        nota: $("nota").value
      });

      form.reset();

      $("registered").innerHTML = `
        <div class="author-success">
          <h3>Libro registrado correctamente</h3>

          <p>
            ${escapeHTML(result.asset.nombre)}
            · Versión ${escapeHTML(result.version.numero)}
          </p>

          <div class="author-hash">
            <span>Huella SHA-256</span>
            <code>${result.version.hash}</code>
          </div>

          <a href="versiones.html?activo=${encodeURIComponent(result.asset.id)}">
            Ver versiones del libro →
          </a>
        </div>
      `;

      showMessage(
        `Se guardó ${result.asset.nombre}, ` +
        `versión ${result.version.numero}, con su huella SHA-256.`
      );
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});