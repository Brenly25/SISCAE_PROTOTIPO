/* =========================================================
   SISCAE - VISTA AUTOR / EDITOR

   Funciones del rol:
   - Crear o subir activos
   - Actualizar archivos y generar versiones
   - Firmar cada versión (firma SIMULADA para el prototipo)
   - Registrar sus intervenciones (trazabilidad)

   La huella SHA-256 del archivo es REAL (se calcula en el
   navegador). Lo simulado es la firma: en producción se
   haría con la llave privada del usuario en el backend.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       USUARIO ACTUAL
       Con Firebase Auth estos datos vendrán del token.
    ====================================================== */

    const USER = {
        id: "usr-0142",
        nombre: "Ana Martínez",
        corto: "Ana",
        rol: "Autor / Editor",
        correo: "ana.martinez@mined.gob.sv"
    };

    const DEMO_PIN = "123456";
    const MAX_ATTEMPTS = 3;


    /* =====================================================
       SHA-256
       Usa Web Crypto cuando está disponible (Live Server,
       localhost, https). Si no, usa una implementación
       propia para que el prototipo funcione igual.
    ====================================================== */

    const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0xfc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x6ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);

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

        view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
        view.setUint32(paddedLength - 4, bitLength >>> 0);

        const W = new Uint32Array(64);
        const rotr = (x, n) => (x >>> n) | (x << (32 - n));

        for (let offset = 0; offset < paddedLength; offset += 64) {

            for (let i = 0; i < 16; i++) {
                W[i] = view.getUint32(offset + i * 4);
            }

            for (let i = 16; i < 64; i++) {
                const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
                const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
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

                h = g; g = f; f = e;
                e = (d + t1) | 0;
                d = c; c = b; b = a;
                a = (t1 + t2) | 0;
            }

            H[0] += a; H[1] += b; H[2] += c; H[3] += d;
            H[4] += e; H[5] += f; H[6] += g; H[7] += h;
        }

        return Array.from(H, x => x.toString(16).padStart(8, "0")).join("");
    }

    async function sha256(bytes) {

        if (window.crypto?.subtle) {
            try {
                const digest = await crypto.subtle.digest("SHA-256", bytes);
                return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
            } catch (error) {
                // cae a la implementación propia
            }
        }

        return sha256Fallback(bytes);
    }

    const sha256Text = text => sha256(new TextEncoder().encode(text));

    async function sha256File(file) {
        return sha256(new Uint8Array(await file.arrayBuffer()));
    }


    /* =====================================================
       FIRMA SIMULADA
       firma = SHA-256(huella | usuario | versión | fecha)
       Sirve para demostrar el concepto: la firma depende
       del archivo exacto y de quién lo firmó.
    ====================================================== */

    let signatureCounter = 214;

    async function createSignature(hash, versionNumber, assetId) {

        const date = new Date();
        const iso = date.toISOString();

        signatureCounter += 1;

        return {
            id: `FIR-${date.getFullYear()}-${String(signatureCounter).padStart(5, "0")}`,
            valor: await sha256Text(`${hash}|${USER.id}|${assetId}|v${versionNumber}|${iso}`),
            firmante: USER.nombre,
            rol: USER.rol,
            correo: USER.correo,
            algoritmo: "SHA-256 con RSA-2048 (simulado)",
            certificado: `CN=${USER.nombre}, O=MINEDUCYT, C=SV (simulado)`,
            iso,
            fecha: formatDateTime(date)
        };
    }


    /* =====================================================
       FECHAS
    ====================================================== */

    function formatTime(date) {
        return new Intl.DateTimeFormat("es-SV", { hour: "numeric", minute: "2-digit" }).format(date);
    }

    function formatDateTime(date) {
        const day = new Intl.DateTimeFormat("es-SV", { day: "numeric", month: "short", year: "numeric" }).format(date);
        return `${day}, ${formatTime(date)}`;
    }

    const nowLabel = () => `Hoy, ${formatTime(new Date())}`;

    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }


    /* =====================================================
       DATOS DE DEMOSTRACIÓN
       Con Firebase serán documentos en Firestore:
       activos/{id}/versiones/{n}
    ====================================================== */

    const seed = [
        {
            id: "act-001", nombre: "Libro de Matemática", tipo: "Libro", estado: "revision",
            versiones: [
                ["matematica_4g_v1.pdf", 2400000, "Primera entrega del libro.", "10 sept 2026, 9:10 a. m."],
                ["matematica_4g_v2.pdf", 2460000, "Ajustes de diagramación en unidades 1 y 2.", "17 sept 2026, 2:45 p. m."],
                ["matematica_4g_v3.pdf", 2510000, "Se agregaron ejercicios de repaso.", "24 sept 2026, 10:42 a. m."]
            ],
            observaciones: []
        },
        {
            id: "act-002", nombre: "Guía docente", tipo: "Documento", estado: "cambios",
            versiones: [
                ["guia_docente_v1.docx", 820000, "Versión inicial de la guía.", "12 sept 2026, 11:20 a. m."],
                ["guia_docente_v2.docx", 845000, "Se incorporaron secuencias didácticas.", "22 sept 2026, 9:15 a. m."]
            ],
            observaciones: [
                { texto: "Los indicadores de logro de la unidad 3 no coinciden con el programa oficial.", revisor: "Carlos Pérez", fecha: "Hoy, 8:35 a. m." },
                { texto: "Falta la bibliografía al final del documento.", revisor: "Carlos Pérez", fecha: "Hoy, 8:37 a. m." }
            ]
        },
        {
            id: "act-003", nombre: "Ciencias Naturales", tipo: "Libro", estado: "edicion",
            versiones: [
                ["ciencias_naturales_v1.pdf", 3120000, "Borrador completo del libro.", "23 sept 2026, 11:08 a. m."]
            ],
            observaciones: []
        },
        {
            id: "act-004", nombre: "Portada Unidad 4", tipo: "Imagen", estado: "aprobado",
            versiones: [
                ["portada_u4_v1.png", 1200000, "Propuesta inicial de portada.", "5 sept 2026, 3:00 p. m."],
                ["portada_u4_v2.png", 1180000, "Cambio de paleta según manual de marca.", "15 sept 2026, 10:20 a. m."],
                ["portada_u4_v3.png", 1210000, "Versión final aprobada.", "23 sept 2026, 3:30 p. m."]
            ],
            observaciones: []
        },
        {
            id: "act-005", nombre: "Cuadernillo de Lenguaje", tipo: "Documento", estado: "cambios",
            versiones: [
                ["cuadernillo_lenguaje_v1.docx", 960000, "Primera versión del cuadernillo.", "21 sept 2026, 2:20 p. m."]
            ],
            observaciones: [
                { texto: "Las lecturas de la página 12 no tienen fuente citada.", revisor: "Carlos Pérez", fecha: "Ayer, 4:10 p. m." }
            ]
        },
        {
            id: "act-006", nombre: "Video: El ciclo del agua", tipo: "Multimedia", estado: "aprobado",
            versiones: [
                ["ciclo_agua_v1.mp4", 48200000, "Edición inicial del video.", "8 sept 2026, 9:00 a. m."],
                ["ciclo_agua_v2.mp4", 47900000, "Se agregó subtitulado.", "18 sept 2026, 8:50 a. m."]
            ],
            observaciones: []
        }
    ];

    // Construye las versiones con huella y firma reales del
    // prototipo (la huella de los datos semilla se calcula
    // sobre el nombre del archivo, porque no hay archivo real)
    async function buildSeed() {

        const assets = [];

        for (const item of seed) {

            const versiones = [];

            for (const [index, [archivo, tamano, nota, fecha]] of item.versiones.entries()) {

                const numero = index + 1;
                const hash = await sha256Text(`${item.id}:${archivo}`);

                signatureCounter += 1;

                versiones.push({
                    numero, archivo, tamano, nota, fecha, hash,
                    firma: {
                        id: `FIR-2026-${String(signatureCounter).padStart(5, "0")}`,
                        valor: await sha256Text(`${hash}|${USER.id}|${item.id}|v${numero}`),
                        firmante: USER.nombre,
                        rol: USER.rol,
                        correo: USER.correo,
                        algoritmo: "SHA-256 con RSA-2048 (simulado)",
                        certificado: `CN=${USER.nombre}, O=MINEDUCYT, C=SV (simulado)`,
                        fecha
                    }
                });
            }

            assets.push({ ...item, versiones });
        }

        return assets;
    }

    const assets = await buildSeed();

    const activity = [
        { accion: "Versión firmada", detalle: "v3 · FIR-2026-00217", icono: "sign", recurso: "Libro de Matemática", fecha: "Hoy, 10:42 a. m." },
        { accion: "Enviado a revisión", detalle: "Asignado a Carlos Pérez", icono: "send", recurso: "Libro de Matemática", fecha: "Hoy, 10:45 a. m." },
        { accion: "Observaciones recibidas", detalle: "2 observaciones del revisor", icono: "comment", recurso: "Guía docente", fecha: "Hoy, 8:37 a. m." },
        { accion: "Integridad verificada", detalle: "Coincide con v2", icono: "check", recurso: "Portada Unidad 4", fecha: "Ayer, 3:32 p. m." }
    ];

    const statusLabels = {
        edicion: "En edición",
        cambios: "Cambios solicitados",
        revision: "En revisión",
        aprobado: "Aprobado"
    };

    const icons = {
        Libro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
        Documento: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line>',
        Imagen: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
        Multimedia: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2"></rect>',
        sign: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>',
        send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
        comment: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
        check: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 3 3 5-6"></path>',
        alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
        add: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
        upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
        history: '<path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><path d="M12 7v5l4 2"></path>'
    };

    let currentFilter = "todos";


    /* =====================================================
       UTILIDADES
    ====================================================== */

    const $ = id => document.getElementById(id);

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    const shortHash = hash => `${hash.slice(0, 10)}…${hash.slice(-6)}`;
    const findAsset = id => assets.find(asset => asset.id === id);
    const lastVersion = asset => asset.versiones[asset.versiones.length - 1];

    function logActivity(entry) {
        activity.unshift({ ...entry, fecha: nowLabel() });
        renderActivity();
    }


    /* =====================================================
       FECHA Y SALUDO
    ====================================================== */

    $("currentDate").textContent = new Intl.DateTimeFormat("es-SV", {
        day: "numeric", month: "long", year: "numeric"
    }).format(new Date());

    const hour = new Date().getHours();
    const saludo = hour >= 5 && hour < 12 ? "Buenos días" : hour < 18 && hour >= 12 ? "Buenas tardes" : "Buenas noches";

    $("greeting").textContent = `${saludo}, ${USER.corto}`;


    /* =====================================================
       RENDER: MIS ACTIVOS
    ====================================================== */

    function actionsFor(asset) {

        const buttons = [];

        if (asset.estado === "edicion" || asset.estado === "cambios") {
            buttons.push(`<button type="button" class="row-action" data-action="version" data-id="${asset.id}">${asset.estado === "cambios" ? "Atender cambios" : "Nueva versión"}</button>`);
        }

        if (asset.estado === "edicion") {
            buttons.push(`<button type="button" class="row-action row-action--primary" data-action="send" data-id="${asset.id}">Enviar a revisión</button>`);
        }

        buttons.push(`<button type="button" class="row-action row-action--ghost" data-action="history" data-id="${asset.id}">Historial</button>`);

        return buttons.join("");
    }

    function renderAssets() {

        const visible = currentFilter === "todos"
            ? assets
            : assets.filter(asset => asset.estado === currentFilter);

        if (visible.length === 0) {
            $("assetsList").innerHTML = '<div class="activity-empty">No tiene activos con este estado.</div>';
            return;
        }

        $("assetsList").innerHTML = visible.map(asset => {

            const version = lastVersion(asset);

            return `
                <div class="activity-row">
                    <div class="activity-event">
                        <div class="event-icon">
                            <svg viewBox="0 0 24 24">${icons[asset.tipo] || icons.Documento}</svg>
                        </div>
                        <div>
                            <strong>${escapeHTML(asset.nombre)}</strong>
                            <span>${asset.tipo} · ${version.fecha}</span>
                        </div>
                    </div>
                    <span>
                        <span class="status-pill status-pill--${asset.estado}">${statusLabels[asset.estado]}</span>
                    </span>
                    <div class="version-cell">
                        <strong>v${version.numero}</strong>
                        <span class="signed-tag">
                            <svg viewBox="0 0 24 24">${icons.sign}</svg>
                            Firmada
                        </span>
                        <small title="${version.hash}">${shortHash(version.hash)}</small>
                    </div>
                    <div class="row-actions">${actionsFor(asset)}</div>
                </div>
            `;
        }).join("");
    }


    /* =====================================================
       RENDER: OBSERVACIONES
    ====================================================== */

    function renderObservations() {

        const pending = assets.filter(asset => asset.observaciones.length > 0);

        if (pending.length === 0) {
            $("observationsList").innerHTML = `
                <div class="indicator-row">
                    <div>
                        <strong>Sin observaciones pendientes</strong>
                        <span>El revisor no ha solicitado cambios.</span>
                    </div>
                    <span class="indicator-value">0</span>
                </div>
            `;
            return;
        }

        $("observationsList").innerHTML = pending.map(asset => `
            <div class="indicator-row">
                <div>
                    <strong>${escapeHTML(asset.nombre)}</strong>
                    <span>${escapeHTML(asset.observaciones[0].texto)}</span>
                    <button type="button" class="indicator-link" data-action="version" data-id="${asset.id}">
                        Atender con nueva versión
                    </button>
                </div>
                <span class="indicator-value">${asset.observaciones.length}</span>
            </div>
        `).join("");
    }


    /* =====================================================
       RENDER: INTERVENCIONES
    ====================================================== */

    function renderActivity() {

        $("activityList").innerHTML = activity.slice(0, 6).map(item => `
            <div class="activity-row">
                <div class="activity-event">
                    <div class="event-icon${item.icono === "alert" ? " event-icon--alert" : ""}">
                        <svg viewBox="0 0 24 24">${icons[item.icono]}</svg>
                    </div>
                    <div>
                        <strong>${item.accion}</strong>
                        <span>${USER.nombre}</span>
                    </div>
                </div>
                <span>${escapeHTML(item.recurso)}</span>
                <span>${escapeHTML(item.detalle)}</span>
                <span>${item.fecha}</span>
            </div>
        `).join("");
    }


    /* =====================================================
       CONTADORES
    ====================================================== */

    function updateStats() {

        const counts = {
            total: assets.length,
            edicion: assets.filter(a => a.estado === "edicion").length,
            cambios: assets.filter(a => a.estado === "cambios").length,
            firmas: assets.reduce((sum, a) => sum + a.versiones.length, 0),
            observaciones: assets.reduce((sum, a) => sum + a.observaciones.length, 0)
        };

        document.querySelectorAll("[data-stat]").forEach(element => {
            element.textContent = counts[element.dataset.stat];
        });
    }

    function renderAll() {
        renderAssets();
        renderObservations();
        updateStats();
    }

    renderAll();
    renderActivity();


    /* =====================================================
       FILTROS
    ====================================================== */

    function setFilter(filter) {

        currentFilter = filter;

        document.querySelectorAll(".filter-tab").forEach(tab => {
            const active = tab.dataset.filter === filter;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });

        renderAssets();
    }

    document.querySelectorAll(".filter-tab").forEach(tab => {
        tab.addEventListener("click", () => setFilter(tab.dataset.filter));
    });


    /* =====================================================
       MODALES
    ====================================================== */

    function openModal(modal) {
        document.querySelectorAll(".modal.active").forEach(m => m.classList.remove("active"));
        modal.classList.add("active");
        document.body.classList.add("locked");
        $("profile")?.classList.remove("open");
    }

    function closeModal(modal) {
        modal?.classList.remove("active");
        if (!document.querySelector(".modal.active")) {
            document.body.classList.remove("locked");
        }
    }

    document.querySelectorAll("[data-close-modal]").forEach(element => {
        element.addEventListener("click", () => closeModal(element.closest(".modal")));
    });


    /* =====================================================
       ACCIONES DE LAS FILAS (delegación de eventos)
    ====================================================== */

    document.addEventListener("click", event => {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const asset = findAsset(button.dataset.id);

        if (!asset) return;

        if (button.dataset.action === "version") openUpload(asset);
        if (button.dataset.action === "history") openHistory(asset);
        if (button.dataset.action === "send") sendToReview(asset);
    });


    /* =====================================================
       PASO 1: ARCHIVO (activo nuevo o nueva versión)
    ====================================================== */

    let pending = null; // lo que se va a firmar

    function setError(field, message) {
        const error = document.querySelector(`[data-error="${field}"]`);
        if (error) error.textContent = message;
        $(field)?.classList.toggle("invalid", Boolean(message));
    }

    function clearErrors() {
        ["assetName", "assetFile", "assetNote", "signPin"].forEach(field => setError(field, ""));
    }

    function openUpload(asset = null) {

        $("uploadForm").reset();
        clearErrors();

        pending = { asset };

        const isNew = !asset;

        $("newAssetFields").hidden = !isNew;
        $("uploadTitle").textContent = isNew
            ? "Registrar activo"
            : `Nueva versión de ${asset.nombre}`;
        $("uploadDescription").textContent = isNew
            ? "Suba el archivo y describa su intervención. En el siguiente paso firmará la versión v1."
            : `Se registrará como v${asset.versiones.length + 1}. En el siguiente paso firmará la versión.`;

        const box = $("uploadObservations");

        if (asset && asset.observaciones.length) {
            box.hidden = false;
            box.innerHTML = `
                <strong>Observaciones de ${asset.observaciones[0].revisor}</strong>
                <ul>${asset.observaciones.map(o => `<li>${escapeHTML(o.texto)}</li>`).join("")}</ul>
            `;
        } else {
            box.hidden = true;
        }

        openModal($("uploadModal"));
        setTimeout(() => (isNew ? $("assetName") : $("assetFile")).focus(), 60);
    }

    $("openRegister").addEventListener("click", () => openUpload());

    $("uploadForm").addEventListener("submit", event => {

        event.preventDefault();
        clearErrors();

        const isNew = !pending.asset;
        const name = $("assetName").value.trim();
        const file = $("assetFile").files[0];
        const note = $("assetNote").value.trim();

        let valid = true;

        if (isNew && name.length < 3) {
            setError("assetName", "Escriba un nombre de al menos 3 caracteres.");
            valid = false;
        }

        if (!file) {
            setError("assetFile", "Seleccione el archivo de esta versión.");
            valid = false;
        }

        if (note.length < 10) {
            setError("assetNote", "Describa brevemente su intervención (mínimo 10 caracteres).");
            valid = false;
        }

        if (!valid) return;

        pending = {
            ...pending,
            file,
            note,
            name: isNew ? name : pending.asset.nombre,
            type: isNew ? $("assetType").value : pending.asset.tipo,
            versionNumber: isNew ? 1 : pending.asset.versiones.length + 1,
            hash: null,
            attempts: 0
        };

        openSign();
    });


    /* =====================================================
       PASO 2: FIRMA
    ====================================================== */

    async function openSign() {

        $("signForm").reset();
        $("signSubmit").disabled = true;
        $("signHash").textContent = "Calculando…";
        $("signHash").classList.remove("ready");

        $("signSummary").innerHTML = `
            <div><dt>Activo</dt><dd>${escapeHTML(pending.name)}</dd></div>
            <div><dt>Versión</dt><dd>v${pending.versionNumber}</dd></div>
            <div><dt>Archivo</dt><dd>${escapeHTML(pending.file.name)} · ${formatSize(pending.file.size)}</dd></div>
            <div><dt>Firmante</dt><dd>${USER.nombre} · ${USER.rol}</dd></div>
        `;

        openModal($("signModal"));

        pending.hash = await sha256File(pending.file);

        $("signHash").textContent = pending.hash;
        $("signHash").classList.add("ready");
        updateSignButton();
    }

    function updateSignButton() {
        $("signSubmit").disabled = !(pending?.hash && $("signConsent").checked);
    }

    $("signConsent").addEventListener("change", updateSignButton);

    $("signPin").addEventListener("input", () => {
        $("signPin").value = $("signPin").value.replace(/\D/g, "");
        setError("signPin", "");
    });

    $("signForm").addEventListener("submit", async event => {

        event.preventDefault();

        if ($("signPin").value !== DEMO_PIN) {

            pending.attempts += 1;

            logActivity({
                accion: "Intento de firma fallido",
                detalle: `PIN incorrecto (${pending.attempts} de ${MAX_ATTEMPTS})`,
                icono: "alert",
                recurso: pending.name
            });

            if (pending.attempts >= MAX_ATTEMPTS) {
                closeModal($("signModal"));
                showToast("Firma bloqueada por intentos fallidos. Quedó registrado en su historial.");
                pending = null;
                return;
            }

            setError("signPin", `PIN incorrecto. Le quedan ${MAX_ATTEMPTS - pending.attempts} intentos.`);
            $("signPin").value = "";
            $("signPin").focus();
            return;
        }

        $("signSubmit").disabled = true;
        $("signSubmit").textContent = "Firmando…";

        let asset = pending.asset;

        if (!asset) {
            asset = {
                id: `act-${String(assets.length + 1).padStart(3, "0")}-${Date.now().toString(36)}`,
                nombre: pending.name,
                tipo: pending.type,
                estado: "edicion",
                versiones: [],
                observaciones: []
            };
            assets.unshift(asset);
        }

        const firma = await createSignature(pending.hash, pending.versionNumber, asset.id);

        const version = {
            numero: pending.versionNumber,
            archivo: pending.file.name,
            tamano: pending.file.size,
            nota: pending.note,
            fecha: nowLabel(),
            hash: pending.hash,
            firma
        };

        asset.versiones.push(version);

        const attendedChanges = asset.estado === "cambios";

        // Al subir una versión con cambios, las observaciones
        // quedan atendidas y el activo vuelve a edición
        asset.estado = "edicion";
        asset.observaciones = [];

        logActivity({
            accion: pending.versionNumber === 1 ? "Activo registrado" : "Nueva versión firmada",
            detalle: `v${version.numero} · ${firma.id}`,
            icono: pending.versionNumber === 1 ? "add" : "sign",
            recurso: asset.nombre
        });

        if (attendedChanges) {
            logActivity({
                accion: "Observaciones atendidas",
                detalle: `Resueltas en v${version.numero}`,
                icono: "check",
                recurso: asset.nombre
            });
        }

        $("signSubmit").textContent = "Firmar y registrar versión";

        pending = null;

        setFilter("todos");
        renderAll();
        showReceipt(asset, version);
    });


    /* =====================================================
       COMPROBANTE
    ====================================================== */

    let receiptData = null;

    function showReceipt(asset, version) {

        receiptData = { asset, version };

        const f = version.firma;

        $("receiptTitle").textContent = `${asset.nombre} · v${version.numero}`;

        $("receiptBody").innerHTML = `
            <div><dt>ID de firma</dt><dd>${f.id}</dd></div>
            <div><dt>Fecha y hora</dt><dd>${f.fecha}</dd></div>
            <div><dt>Firmante</dt><dd>${f.firmante} · ${f.rol}</dd></div>
            <div><dt>Archivo</dt><dd>${escapeHTML(version.archivo)} · ${formatSize(version.tamano)}</dd></div>
            <div class="full"><dt>Intervención</dt><dd>${escapeHTML(version.nota)}</dd></div>
            <div class="full"><dt>Huella SHA-256</dt><dd><code>${version.hash}</code></dd></div>
            <div class="full"><dt>Valor de firma</dt><dd><code>${f.valor}</code></dd></div>
            <div><dt>Algoritmo</dt><dd>${f.algoritmo}</dd></div>
            <div><dt>Certificado</dt><dd>${f.certificado}</dd></div>
        `;

        openModal($("receiptModal"));
    }

    $("downloadReceipt").addEventListener("click", () => {

        if (!receiptData) return;

        const { asset, version } = receiptData;
        const f = version.firma;

        const text = [
            "SISCAE - COMPROBANTE DE FIRMA (SIMULADA)",
            "Ministerio de Educación, Ciencia y Tecnología",
            "",
            `ID de firma:      ${f.id}`,
            `Fecha y hora:     ${f.fecha}`,
            `Firmante:         ${f.firmante} (${f.correo})`,
            `Rol:              ${f.rol}`,
            "",
            `Activo:           ${asset.nombre}`,
            `Versión:          v${version.numero}`,
            `Archivo:          ${version.archivo} (${formatSize(version.tamano)})`,
            `Intervención:     ${version.nota}`,
            "",
            `Huella SHA-256:   ${version.hash}`,
            `Valor de firma:   ${f.valor}`,
            `Algoritmo:        ${f.algoritmo}`,
            `Certificado:      ${f.certificado}`,
            "",
            "Documento generado por un prototipo con fines de demostración."
        ].join("\n");

        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        link.download = `comprobante-${f.id}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    });


    /* =====================================================
       HISTORIAL E INTEGRIDAD
    ====================================================== */

    let historyAsset = null;

    function openHistory(asset) {

        historyAsset = asset;

        $("historyTitle").textContent = asset.nombre;
        $("historyMeta").textContent =
            `${asset.tipo} · ${statusLabels[asset.estado]} · ${asset.versiones.length} versiones firmadas`;

        $("versionList").innerHTML = [...asset.versiones].reverse().map(v => `
            <li class="version-item">
                <span class="version-badge">v${v.numero}</span>
                <div class="version-info">
                    <strong>${escapeHTML(v.nota)}</strong>
                    <span>${escapeHTML(v.archivo)} · ${formatSize(v.tamano)} · ${v.fecha}</span>
                    <code title="${v.hash}">SHA-256 ${shortHash(v.hash)}</code>
                </div>
                <button type="button" class="row-action row-action--ghost" data-receipt="${v.numero}">
                    Comprobante
                </button>
            </li>
        `).join("");

        $("verifyFile").value = "";
        $("verifyResult").hidden = true;

        openModal($("historyModal"));
    }

    $("versionList").addEventListener("click", event => {

        const button = event.target.closest("[data-receipt]");

        if (!button || !historyAsset) return;

        const version = historyAsset.versiones.find(v => v.numero === Number(button.dataset.receipt));

        showReceipt(historyAsset, version);
    });

    $("verifyFile").addEventListener("change", async () => {

        const file = $("verifyFile").files[0];
        const result = $("verifyResult");

        if (!file || !historyAsset) return;

        result.hidden = false;
        result.className = "verify-result";
        result.textContent = "Calculando huella…";

        const hash = await sha256File(file);
        const match = historyAsset.versiones.find(v => v.hash === hash);

        if (match) {
            result.classList.add("verify-result--ok");
            result.innerHTML = `<strong>Íntegro.</strong> Coincide con la v${match.numero}, firmada por ${match.firma.firmante} (${match.firma.id}).`;
        } else {
            result.classList.add("verify-result--fail");
            result.innerHTML = `<strong>No coincide.</strong> Este archivo no corresponde a ninguna versión firmada; pudo haber sido modificado.`;
        }

        result.insertAdjacentHTML("beforeend", `<code>${hash}</code>`);

        logActivity({
            accion: match ? "Integridad verificada" : "Integridad no coincide",
            detalle: match ? `Coincide con v${match.numero}` : `Archivo: ${file.name}`,
            icono: match ? "check" : "alert",
            recurso: historyAsset.nombre
        });
    });


    /* =====================================================
       ENVIAR A REVISIÓN
    ====================================================== */

    function sendToReview(asset) {

        asset.estado = "revision";

        logActivity({
            accion: "Enviado a revisión",
            detalle: `v${lastVersion(asset).numero} · asignado a Carlos Pérez`,
            icono: "send",
            recurso: asset.nombre
        });

        renderAll();
        showToast(`${asset.nombre} se envió a revisión.`);
    }


    /* =====================================================
       AVISO
    ====================================================== */

    let toastTimer;

    function showToast(message) {
        const toast = $("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    $("requestAccess").addEventListener("click", event => {
        event.preventDefault();
        showToast("Solicitud de acceso enviada al administrador.");
    });


    /* =====================================================
       SIDEBAR, PERFIL, CAMPANA Y SESIÓN
    ====================================================== */

    const sidebar = $("sidebar");
    const overlay = $("mobileOverlay");

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
        document.body.classList.add("locked");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
        if (!document.querySelector(".modal.active")) {
            document.body.classList.remove("locked");
        }
    }

    $("menuButton").addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 950) closeSidebar();
        });
    });

    $("profileButton").addEventListener("click", event => {
        event.stopPropagation();
        $("profile").classList.toggle("open");
    });

    document.addEventListener("click", event => {
        if (!$("profile").contains(event.target)) {
            $("profile").classList.remove("open");
        }
    });

    $("notificationButton").addEventListener("click", () => {
        $("observaciones").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("sidebarLogout").addEventListener("click", () => openModal($("logoutModal")));
    $("profileLogout").addEventListener("click", () => openModal($("logoutModal")));

    $("confirmLogout").addEventListener("click", () => {
        // Con Firebase Auth: signOut()
        window.location.href = "login.html";
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        document.querySelectorAll(".modal.active").forEach(closeModal);
        $("profile").classList.remove("open");
        if (window.innerWidth <= 950) closeSidebar();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 950) closeSidebar();
    });

});