/* =========================================================
   SISCAE - VISTA REVISOR

   Funciones del rol:
   - Revisar activos y versiones enviados por los autores
   - Agregar observaciones
   - Solicitar cambios
   - Aprobar o rechazar dentro del flujo editorial

   Cada decisión queda FIRMADA por el revisor (firma
   simulada con PIN, igual que en la vista del autor).
   La huella SHA-256 sí se calcula de verdad: si el archivo
   almacenado no coincide con la huella que firmó el autor,
   la versión no se puede aprobar.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* Primero el componente reutilizable (js/components.js) */
    await loadRevisorSidebar();

    /* Después lo propio de esta vista */
    initRevisor();

});


async function initRevisor() {

    /* =====================================================
       USUARIO ACTUAL
       Con Firebase Auth estos datos vendrán del token.
    ====================================================== */

    const USER = {
        id: "usr-0087",
        nombre: "Carlos Pérez",
        corto: "Carlos",
        rol: "Revisor editorial",
        correo: "carlos.perez@mined.gob.sv"
    };

    const DEMO_PIN = "123456";
    const MAX_ATTEMPTS = 3;

    const CRITERIA = [
        "Contenido alineado al programa de estudio oficial",
        "Redacción y ortografía revisadas",
        "Fuentes, créditos y derechos de imágenes verificados",
        "Formato conforme al manual institucional"
    ];


    /* =====================================================
       SHA-256
       Web Crypto cuando está disponible; si no (por ejemplo
       al abrir el prototipo desde otro equipo por IP), usa
       una implementación propia.
    ====================================================== */

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

    async function sha256Text(text) {

        const bytes = new TextEncoder().encode(text);

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


    /* =====================================================
       FECHAS
       Todo es relativo a hoy para que el prototipo se vea
       vigente el día de la presentación.
    ====================================================== */

    const TODAY = new Date();

    const fmtTime = date =>
        new Intl.DateTimeFormat("es-SV", { hour: "numeric", minute: "2-digit" }).format(date);

    const fmtDay = date =>
        new Intl.DateTimeFormat("es-SV", { day: "numeric", month: "short", year: "numeric" }).format(date);

    const fmtLong = date =>
        new Intl.DateTimeFormat("es-SV", { weekday: "long", day: "numeric", month: "long" }).format(date);

    // [díasAtrás, "HH:MM"] -> Date
    function at([daysAgo, time]) {
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date(TODAY);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function label(date) {

        const start = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = Math.round((start(TODAY) - start(date)) / 86400000);

        if (diff === 0) return `Hoy, ${fmtTime(date)}`;
        if (diff === 1) return `Ayer, ${fmtTime(date)}`;
        return `${fmtDay(date)}, ${fmtTime(date)}`;
    }

    function due(days) {

        const date = new Date(TODAY);
        date.setDate(date.getDate() + days);

        let text;
        let level;

        if (days < 0) {
            text = `Vencido hace ${-days} ${-days === 1 ? "día" : "días"}`;
            level = "overdue";
        } else if (days === 0) {
            text = "Vence hoy";
            level = "overdue";
        } else if (days === 1) {
            text = "Vence mañana";
            level = "soon";
        } else {
            text = `Vence en ${days} días`;
            level = days <= 3 ? "soon" : "ok";
        }

        return { text, level, date: fmtLong(date) };
    }

    function formatSize(bytes) {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }


    /* =====================================================
       UTILIDADES
    ====================================================== */

    const $ = id => document.getElementById(id);

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    const initials = name =>
        name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();

    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;


    /* =====================================================
       ÍCONOS (mismo trazo que el resto del sitio)
    ====================================================== */

    const icons = {
        Libro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
        Documento: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line>',
        Imagen: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
        Multimedia: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2"></rect>',
        shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>',
        shieldAlert: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
        check: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 3 3 5-6"></path>',
        comment: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
        reject: '<circle cx="12" cy="12" r="9"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
        alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
        clipboard: '<path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"></path><rect x="9" y="2.5" width="6" height="3.5" rx="1"></rect><path d="m9 13 2 2 4-4"></path>',
        trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>'
    };

    const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.Documento}</svg>`;


    /* =====================================================
       DATOS DE DEMOSTRACIÓN
       Con Firebase: activos/{id}/versiones/{n} con estado
       "revision" y revisor asignado = usuario actual.

       La huella se calcula sobre "id:archivo", igual que en
       la vista del autor (js/dashboard.js), así el Libro de
       Matemática muestra la misma huella en ambas vistas.
    ====================================================== */

    const queueSeed = [
        {
            id: "act-001", nombre: "Libro de Matemática", tipo: "Libro", area: "Educación Básica · 4.° grado",
            autor: "Ana Martínez", enviado: [0, "10:45"], plazo: 2, firmaId: "FIR-2026-00217",
            versiones: [
                ["matematica_4g_v1.pdf", 2400000, "Primera entrega del libro.", [21, "09:10"],
                    { obs: [["Los ejercicios de la unidad 1 no incluyen solucionario.", "Unidad 1"]] }],
                ["matematica_4g_v2.pdf", 2460000, "Ajustes de diagramación en unidades 1 y 2.", [14, "14:45"],
                    { obs: [["Faltan ejercicios de repaso al cierre de cada unidad.", "Todas las unidades"]] }],
                ["matematica_4g_v3.pdf", 2510000, "Se agregaron ejercicios de repaso al cierre de cada unidad.", [0, "10:42"]]
            ]
        },
        {
            id: "act-007", nombre: "Guía metodológica de Ciencias", tipo: "Documento", area: "Formación docente",
            autor: "María López", enviado: [1, "15:20"], plazo: 4,
            versiones: [
                ["guia_ciencias_v1.docx", 1340000, "Versión inicial con 12 experimentos guiados.", [9, "08:30"],
                    { obs: [["Las actividades experimentales no indican medidas de seguridad.", "Experimentos 3 al 7"]] }],
                ["guia_ciencias_v2.docx", 1385000, "Se añadieron medidas de seguridad en cada experimento.", [1, "15:12"]]
            ]
        },
        {
            id: "act-008", nombre: "Cuaderno de actividades de Lenguaje", tipo: "Documento", area: "Primer ciclo",
            autor: "Laura Gómez", enviado: [0, "08:20"], plazo: 6,
            versiones: [
                ["cuaderno_lenguaje_v1.pdf", 3870000, "Primera versión del cuaderno, unidades 1 a 3.", [0, "08:14"]]
            ]
        },
        {
            // Caso de demostración: el archivo almacenado NO coincide
            // con la huella firmada (fue modificado después de firmar)
            id: "act-009", nombre: "Video: Fracciones en la vida diaria", tipo: "Multimedia", area: "Educación Básica · 5.° grado",
            autor: "José Ramírez", enviado: [2, "11:05"], plazo: 1, alterado: true,
            versiones: [
                ["fracciones_v1.mp4", 52400000, "Edición inicial del video.", [8, "10:00"],
                    { obs: [["El audio se desfasa a partir del minuto 3.", "Minuto 3:00"]] }],
                ["fracciones_v2.mp4", 52100000, "Se corrigió la sincronización del audio.", [2, "10:58"]]
            ]
        },
        {
            id: "act-010", nombre: "Portada Guía de Estudios Sociales", tipo: "Imagen", area: "Segundo ciclo",
            autor: "Sofía Castro", enviado: [4, "09:40"], plazo: -1,
            versiones: [
                ["portada_sociales_v1.png", 1420000, "Propuesta inicial de portada.", [12, "13:15"],
                    { obs: [["El título no cumple el contraste mínimo del manual de marca.", "Título"]] }],
                ["portada_sociales_v2.png", 1405000, "Se cambió la paleta del título.", [4, "09:33"]]
            ]
        }
    ];

    const decisionSeed = [
        {
            id: "REV-2026-00131", tipo: "cambios", fecha: [0, "08:37"], abierto: true,
            activo: "Guía docente", tipoActivo: "Documento", autor: "Ana Martínez",
            version: 2, archivo: "guia_docente_v2.docx", assetId: "act-002",
            observaciones: [
                ["Los indicadores de logro de la unidad 3 no coinciden con el programa oficial.", "Unidad 3"],
                ["Falta la bibliografía al final del documento.", "Final del documento"]
            ]
        },
        {
            id: "REV-2026-00129", tipo: "cambios", fecha: [1, "16:10"], abierto: true,
            activo: "Cuadernillo de Lenguaje", tipoActivo: "Documento", autor: "Ana Martínez",
            version: 1, archivo: "cuadernillo_lenguaje_v1.docx", assetId: "act-005",
            observaciones: [
                ["Las lecturas de la página 12 no tienen fuente citada.", "Pág. 12"]
            ]
        },
        {
            id: "REV-2026-00127", tipo: "aprobado", fecha: [2, "15:28"],
            activo: "Portada Unidad 4", tipoActivo: "Imagen", autor: "Ana Martínez",
            version: 3, archivo: "portada_u4_v3.png", assetId: "act-004"
        },
        {
            id: "REV-2026-00124", tipo: "rechazado", fecha: [4, "11:05"],
            activo: "Afiche Día del Maestro", tipoActivo: "Imagen", autor: "José Ramírez",
            version: 1, archivo: "afiche_maestro_v1.png", assetId: "act-011",
            motivo: "Usa logotipos que no pertenecen al manual de marca institucional y el contenido no corresponde a un recurso educativo."
        }
    ];

    let decisionCounter = 131;
    let firmaCounter = 240;


    /* =====================================================
       CONSTRUCCIÓN DE DATOS (calcula huellas reales)
    ====================================================== */

    async function buildQueue() {

        const queue = [];

        for (const item of queueSeed) {

            const versiones = [];

            for (const [index, [archivo, tamano, nota, fecha, revision]] of item.versiones.entries()) {

                const numero = index + 1;
                const hash = await sha256Text(`${item.id}:${archivo}`);
                const isCurrent = index === item.versiones.length - 1;

                firmaCounter += 1;

                versiones.push({
                    numero, archivo, tamano, nota, hash,
                    fecha: label(at(fecha)),
                    firmaId: isCurrent && item.firmaId ? item.firmaId : `FIR-2026-${String(firmaCounter).padStart(5, "0")}`,
                    revision: revision
                        ? {
                            revisor: USER.nombre,
                            observaciones: revision.obs.map(([texto, ubicacion]) => ({ texto, ubicacion })),
                            atendidaEn: numero + 1
                        }
                        : null
                });
            }

            const actual = versiones[versiones.length - 1];

            // Lo que hay guardado hoy en el almacenamiento
            const almacenado = item.alterado
                ? await sha256Text(`${item.id}:${actual.archivo}:modificado`)
                : await sha256Text(`${item.id}:${actual.archivo}`);

            queue.push({
                ...item,
                enviadoTs: at(item.enviado),
                enviado: label(at(item.enviado)),
                versiones,
                actual,
                hashAlmacenado: almacenado,
                integra: almacenado === actual.hash,
                integridadRegistrada: false,
                criterios: new Set(),
                borrador: []
            });
        }

        return queue;
    }

    async function buildDecisions() {

        const list = [];

        for (const seed of decisionSeed) {

            const hash = await sha256Text(`${seed.assetId}:${seed.archivo}`);
            const ts = at(seed.fecha);

            list.push({
                ...seed,
                ts,
                fecha: label(ts),
                hash,
                revisor: USER.nombre,
                valor: await sha256Text(`${hash}|${USER.id}|${seed.tipo}|${ts.toISOString()}`),
                observaciones: (seed.observaciones || []).map(([texto, ubicacion]) => ({ texto, ubicacion }))
            });
        }

        return list;
    }

    const queue = await buildQueue();
    const decisions = await buildDecisions();

    const events = [
        { accion: "Integridad verificada", icono: "shield", recurso: "Guía docente", detalle: "v2 · la huella coincide", ts: at([0, "08:12"]) },
        ...decisions.map(eventFromDecision)
    ];

    function eventFromDecision(decision) {

        const map = {
            aprobado: { accion: "Versión aprobada", icono: "check", variante: "ok" },
            cambios: { accion: "Cambios solicitados", icono: "comment", variante: "warn" },
            rechazado: { accion: "Versión rechazada", icono: "reject", variante: "danger" }
        };

        const detalle = decision.tipo === "cambios"
            ? `v${decision.version} · ${plural(decision.observaciones.length, "observación", "observaciones")}`
            : `v${decision.version} · firmada`;

        return {
            ...map[decision.tipo],
            recurso: decision.activo,
            detalle,
            decisionId: decision.id,
            ts: decision.ts
        };
    }

    function logEvent(entry) {
        events.push({ ...entry, ts: new Date() });
        renderHistory();
    }


    /* =====================================================
       ESTADO DE LA PANTALLA
    ====================================================== */

    const filters = { search: "", tipo: "todos", plazo: "todos" };

    const sortedQueue = () =>
        [...queue].sort((a, b) => a.plazo - b.plazo || a.enviadoTs - b.enviadoTs);

    const findAsset = id => queue.find(asset => asset.id === id);
    const findDecision = id => decisions.find(decision => decision.id === id);


    /* =====================================================
       ENCABEZADO
    ====================================================== */

    $("currentDate").textContent = new Intl.DateTimeFormat("es-SV", {
        day: "numeric", month: "long", year: "numeric"
    }).format(TODAY);

    const hour = TODAY.getHours();
    const saludo = hour >= 5 && hour < 12 ? "Buenos días" : hour >= 12 && hour < 18 ? "Buenas tardes" : "Buenas noches";

    $("greeting").textContent = `${saludo}, ${USER.corto}`;


    /* =====================================================
       CONTADORES
    ====================================================== */

    function updateStats() {

        const counts = {
            cola: queue.length,
            urgentes: queue.filter(a => a.plazo <= 0).length,
            seguimiento: decisions.filter(d => d.tipo === "cambios" && d.abierto).length,
            decisiones: decisions.length,
            aprobados: decisions.filter(d => d.tipo === "aprobado").length,
            cambios: decisions.filter(d => d.tipo === "cambios").length,
            rechazados: decisions.filter(d => d.tipo === "rechazado").length
        };

        document.querySelectorAll("[data-stat]").forEach(element => {
            element.textContent = counts[element.dataset.stat];
        });

        document.querySelectorAll("[data-show-if]").forEach(element => {
            element.hidden = counts[element.dataset.showIf] === 0;
        });

        // Badge rojo de la campana solo si hay urgentes
        const bellCount = document.querySelector(".notification [data-stat]");
        if (bellCount) bellCount.hidden = counts.urgentes === 0;

        // Contadores del sidebar (components/sidebar_revisor.txt)
        document.querySelectorAll("[data-sidebar-count]").forEach(element => {
            const value = counts[element.dataset.sidebarCount] ?? 0;
            element.textContent = value;
            element.dataset.empty = String(value === 0);
        });

        $("queueCount").textContent = counts.cola;
    }


    /* =====================================================
       SIGUIENTE EN LA COLA
    ====================================================== */

    function renderBanner() {

        const next = sortedQueue()[0];
        const banner = $("nextBanner");

        if (!next) {
            banner.classList.add("next-banner--empty");
            banner.innerHTML = `
                <div class="next-banner__intro">
                    <div class="next-banner__icon">${svg("check")}</div>
                    <div>
                        <span class="next-banner__eyebrow">COLA AL DÍA</span>
                        <h2>No tiene versiones pendientes de revisión</h2>
                        <p>Las nuevas entregas de los autores aparecerán aquí.</p>
                    </div>
                </div>
            `;
            return;
        }

        banner.classList.remove("next-banner--empty");

        const info = due(next.plazo);
        const urgentes = queue.filter(a => a.plazo <= 0).length;

        banner.innerHTML = `
            <div class="next-banner__intro">
                <div class="next-banner__icon">${svg(next.tipo)}</div>
                <div>
                    <span class="next-banner__eyebrow">SIGUIENTE EN LA COLA</span>
                    <h2>${escapeHTML(next.nombre)}</h2>
                    <p>
                        v${next.actual.numero} · ${next.tipo} · enviado por ${escapeHTML(next.autor)}
                        <span class="next-banner__due next-banner__due--${info.level}">${info.text}</span>
                    </p>
                </div>
            </div>
            <div class="next-banner__side">
                <div class="next-banner__stats">
                    <div><span>En cola</span><strong>${queue.length}</strong></div>
                    <div><span>Urgentes</span><strong>${urgentes}</strong></div>
                </div>
                <button type="button" class="btn-banner" data-review="${next.id}">
                    Revisar ahora
                </button>
            </div>
        `;
    }


    /* =====================================================
       COLA DE REVISIÓN
    ====================================================== */

    function renderQueue() {

        const term = filters.search.trim().toLowerCase();

        const visible = sortedQueue().filter(asset => {

            if (term && !`${asset.nombre} ${asset.autor}`.toLowerCase().includes(term)) return false;
            if (filters.tipo !== "todos" && asset.tipo !== filters.tipo) return false;
            if (filters.plazo === "urgentes" && asset.plazo > 0) return false;
            if (filters.plazo === "proximos" && asset.plazo > 3) return false;

            return true;
        });

        if (visible.length === 0) {
            $("queueList").innerHTML = `
                <div class="activity-empty">
                    ${queue.length === 0
                        ? "No hay versiones pendientes de revisión."
                        : "Ningún activo coincide con los filtros."}
                </div>
            `;
            return;
        }

        $("queueList").innerHTML = visible.map(asset => {

            const info = due(asset.plazo);

            return `
                <div class="activity-row">
                    <div class="activity-event">
                        <div class="event-icon">${svg(asset.tipo)}</div>
                        <div>
                            <strong>${escapeHTML(asset.nombre)}</strong>
                            <span>${asset.tipo} · ${escapeHTML(asset.area)}</span>
                        </div>
                    </div>
                    <div class="version-cell">
                        <strong>v${asset.actual.numero}</strong>
                        ${asset.integra
                            ? `<span class="signed-tag">${svg("shield")} Firma íntegra</span>`
                            : `<span class="signed-tag signed-tag--alert">${svg("shieldAlert")} Huella no coincide</span>`}
                    </div>
                    <div class="author-cell">
                        <span class="author-avatar">${initials(asset.autor)}</span>
                        <div>
                            <strong>${escapeHTML(asset.autor)}</strong>
                            <span>${asset.enviado}</span>
                        </div>
                    </div>
                    <div>
                        <span class="due-pill due-pill--${info.level}" title="Plazo: ${info.date}">${info.text}</span>
                    </div>
                    <div class="row-end">
                        <button type="button" class="row-action row-action--primary" data-review="${asset.id}">
                            Revisar
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    $("queueSearch").addEventListener("input", event => {
        filters.search = event.target.value;
        renderQueue();
    });

    $("queueType").addEventListener("change", event => {
        filters.tipo = event.target.value;
        renderQueue();
    });

    $("queueDue").addEventListener("change", event => {
        filters.plazo = event.target.value;
        renderQueue();
    });

    $("queueClear").addEventListener("click", () => {
        filters.search = "";
        filters.tipo = "todos";
        filters.plazo = "todos";
        $("queueSearch").value = "";
        $("queueType").value = "todos";
        $("queueDue").value = "todos";
        renderQueue();
    });


    /* =====================================================
       ESPERANDO AL AUTOR
    ====================================================== */

    function renderWaiting() {

        const waiting = decisions
            .filter(d => d.tipo === "cambios" && d.abierto)
            .sort((a, b) => b.ts - a.ts);

        if (waiting.length === 0) {
            $("waitingList").innerHTML = `
                <div class="indicator-row">
                    <div>
                        <strong>Sin observaciones abiertas</strong>
                        <span>Ningún autor tiene cambios pendientes de su parte.</span>
                    </div>
                    <span class="indicator-value">0</span>
                </div>
            `;
            return;
        }

        $("waitingList").innerHTML = waiting.slice(0, 3).map(decision => `
            <div class="indicator-row">
                <div>
                    <strong>${escapeHTML(decision.activo)}</strong>
                    <span>${escapeHTML(decision.autor)} · v${decision.version} · devuelto ${decision.fecha.toLowerCase()}</span>
                    <button type="button" class="indicator-link" data-receipt="${decision.id}">
                        Ver observaciones enviadas
                    </button>
                </div>
                <span class="indicator-value">${decision.observaciones.length}</span>
            </div>
        `).join("");
    }


    /* =====================================================
       HISTORIAL DE REVISIÓN
    ====================================================== */

    function renderHistory() {

        const latest = [...events].sort((a, b) => b.ts - a.ts).slice(0, 7);

        $("historyList").innerHTML = latest.map(event => `
            <div class="activity-row">
                <div class="activity-event">
                    <div class="event-icon event-icon--${event.variante || "info"}">${svg(event.icono)}</div>
                    <div>
                        <strong>${event.accion}</strong>
                        <span>${USER.nombre}</span>
                    </div>
                </div>
                <span>${escapeHTML(event.recurso)}</span>
                <span class="history-detail">
                    ${escapeHTML(event.detalle)}
                    ${event.decisionId
                        ? `<button type="button" class="history-link" data-receipt="${event.decisionId}">${event.decisionId}</button>`
                        : ""}
                </span>
                <span>${label(event.ts)}</span>
            </div>
        `).join("");
    }


    /* =====================================================
       RENDER GENERAL
    ====================================================== */

    function renderAll() {
        updateStats();
        renderBanner();
        renderQueue();
        renderWaiting();
        renderHistory();
    }

    renderAll();


    /* =====================================================
       BLOQUEO DE SCROLL (drawer + modales)
    ====================================================== */

    const drawer = $("reviewDrawer");
    const overlay = $("drawerOverlay");

    function syncLock() {
        const open =
            drawer.classList.contains("active") ||
            document.querySelector(".modal.active");
        document.body.classList.toggle("locked", Boolean(open));
    }

    function openModal(modal) {
        modal.classList.add("active");
        $("profile")?.classList.remove("open");
        syncLock();
    }

    function closeModal(modal) {
        modal?.classList.remove("active");
        syncLock();
    }

    document.querySelectorAll("[data-close-modal]").forEach(element => {
        element.addEventListener("click", () => closeModal(element.closest(".modal")));
    });


    /* =====================================================
       MESA DE REVISIÓN (drawer)
    ====================================================== */

    let current = null;      // activo abierto
    let lastFocus = null;

    function openReview(asset) {

        current = asset;
        lastFocus = document.activeElement;

        $("drawerEyebrow").textContent = `REVISIÓN · VERSIÓN ${asset.actual.numero}`;
        $("drawerTitle").textContent = asset.nombre;

        renderDrawer();

        drawer.classList.add("active");
        drawer.setAttribute("aria-hidden", "false");
        overlay.classList.add("active");
        syncLock();

        $("drawerBody").scrollTop = 0;
        setTimeout(() => $("drawerClose").focus(), 80);

        verifyIntegrity(asset);
    }

    function closeReview() {

        drawer.classList.remove("active");
        drawer.setAttribute("aria-hidden", "true");
        overlay.classList.remove("active");
        syncLock();

        current = null;
        lastFocus?.focus?.();
    }

    $("drawerClose").addEventListener("click", closeReview);
    overlay.addEventListener("click", closeReview);


    function renderDrawer() {

        const asset = current;
        const v = asset.actual;
        const info = due(asset.plazo);
        const anteriores = asset.versiones.slice(0, -1).reverse();

        $("drawerBody").innerHTML = `

            <div class="review-intro">
                <div class="review-intro__chips">
                    <span class="type-chip">${svg(asset.tipo)} ${asset.tipo}</span>
                    <span class="due-pill due-pill--${info.level}">${info.text}</span>
                </div>
                <p>
                    Enviado por <strong>${escapeHTML(asset.autor)}</strong> · ${asset.enviado.toLowerCase()}<br>
                    Plazo de revisión: ${info.date}
                </p>
            </div>


            <section class="review-block">

                <h3>Versión enviada</h3>

                <div class="file-card">
                    <span class="file-card__badge">v${v.numero}</span>
                    <div>
                        <strong>${escapeHTML(v.archivo)}</strong>
                        <span>${formatSize(v.tamano)} · ${escapeHTML(asset.area)}</span>
                    </div>
                </div>

                <blockquote class="author-note">
                    <span>Intervención declarada por el autor</span>
                    ${escapeHTML(v.nota)}
                </blockquote>

            </section>


            <section class="review-block">

                <h3>Firma e integridad</h3>

                <div class="integrity-result integrity-result--checking" id="integrityResult">
                    <div class="integrity-result__icon">${svg("shield")}</div>
                    <div>
                        <strong>Verificando huella…</strong>
                        <span>Se recalcula SHA-256 del archivo almacenado.</span>
                    </div>
                </div>

                <dl class="detail-list">
                    <div><dt>ID de firma</dt><dd>${v.firmaId}</dd></div>
                    <div><dt>Firmado por</dt><dd>${escapeHTML(asset.autor)} · Autor / Editor</dd></div>
                    <div><dt>Fecha de firma</dt><dd>${v.fecha}</dd></div>
                </dl>

                <div class="hash-compare">
                    <div>
                        <span>Huella firmada por el autor</span>
                        <code>${v.hash}</code>
                    </div>
                    <div>
                        <span>Huella del archivo almacenado</span>
                        <code id="storedHash">Calculando…</code>
                    </div>
                </div>

            </section>


            ${anteriores.length ? `
                <section class="review-block">

                    <h3>Versiones anteriores <small>${anteriores.length}</small></h3>

                    <ol class="prev-versions">
                        ${anteriores.map(prev => `
                            <li>
                                <span class="prev-versions__badge">v${prev.numero}</span>
                                <div>
                                    <strong>${escapeHTML(prev.nota)}</strong>
                                    <span>${escapeHTML(prev.archivo)} · ${prev.fecha}</span>
                                    ${prev.revision ? `
                                        <div class="prev-review">
                                            <span class="prev-review__title">
                                                Cambios solicitados por ${escapeHTML(prev.revision.revisor)}
                                            </span>
                                            <ul>
                                                ${prev.revision.observaciones.map(o => `
                                                    <li>
                                                        ${escapeHTML(o.texto)}
                                                        ${o.ubicacion ? `<em>${escapeHTML(o.ubicacion)}</em>` : ""}
                                                    </li>
                                                `).join("")}
                                            </ul>
                                            <span class="prev-review__status">
                                                ${svg("check")} Atendida en v${prev.revision.atendidaEn}
                                            </span>
                                        </div>
                                    ` : ""}
                                </div>
                            </li>
                        `).join("")}
                    </ol>

                </section>
            ` : ""}


            <section class="review-block">

                <h3>Criterios de revisión <small id="criteriaCount"></small></h3>

                <div class="criteria">
                    ${CRITERIA.map((text, index) => `
                        <label class="criterion">
                            <input type="checkbox" data-criterion="${index}" ${asset.criterios.has(index) ? "checked" : ""}>
                            <span>${text}</span>
                        </label>
                    `).join("")}
                </div>

            </section>


            <section class="review-block">

                <h3>Observaciones <small id="obsCount"></small></h3>

                <ul class="obs-list" id="obsList"></ul>

                <form class="obs-composer" id="obsForm" novalidate>

                    <label class="form-field">
                        <span>Nueva observación</span>
                        <textarea id="obsText" rows="3" placeholder="Describa qué debe corregir el autor y por qué."></textarea>
                        <small class="form-error" data-error="obsText"></small>
                    </label>

                    <div class="obs-composer__row">
                        <label class="form-field">
                            <span>Ubicación <em>(opcional)</em></span>
                            <input type="text" id="obsWhere" placeholder="Ej. Pág. 12, Unidad 3, minuto 2:40" autocomplete="off">
                        </label>
                        <button type="submit" class="btn-secondary btn-inline">Agregar observación</button>
                    </div>

                </form>

            </section>
        `;

        renderObservations();
        updateCriteriaCount();
        updateDecisionState();
    }


    /* INTEGRIDAD */

    async function verifyIntegrity(asset) {

        // Pequeña pausa para que se note el cálculo en la demo
        await new Promise(resolve => setTimeout(resolve, 450));

        if (current !== asset) return;

        const result = $("integrityResult");
        const stored = $("storedHash");

        stored.textContent = asset.hashAlmacenado;
        stored.classList.add(asset.integra ? "match" : "mismatch");

        result.classList.remove("integrity-result--checking");

        if (asset.integra) {
            result.classList.add("integrity-result--ok");
            result.innerHTML = `
                <div class="integrity-result__icon">${svg("shield")}</div>
                <div>
                    <strong>Firma íntegra</strong>
                    <span>El archivo almacenado es exactamente el que firmó ${escapeHTML(asset.autor)}.</span>
                </div>
            `;
        } else {
            result.classList.add("integrity-result--fail");
            result.innerHTML = `
                <div class="integrity-result__icon">${svg("shieldAlert")}</div>
                <div>
                    <strong>La huella no coincide</strong>
                    <span>El archivo fue modificado después de la firma. No se puede aprobar esta versión.</span>
                </div>
            `;
        }

        asset.integridadVerificada = true;

        if (!asset.integridadRegistrada) {

            asset.integridadRegistrada = true;

            logEvent(asset.integra
                ? { accion: "Integridad verificada", icono: "shield", recurso: asset.nombre, detalle: `v${asset.actual.numero} · la huella coincide` }
                : { accion: "Integridad no coincide", icono: "shieldAlert", variante: "danger", recurso: asset.nombre, detalle: `v${asset.actual.numero} · archivo alterado` });
        }

        updateDecisionState();
    }


    /* CRITERIOS */

    function updateCriteriaCount() {
        const counter = $("criteriaCount");
        if (counter) counter.textContent = `${current.criterios.size} de ${CRITERIA.length}`;
    }

    $("drawerBody").addEventListener("change", event => {

        const box = event.target.closest("[data-criterion]");

        if (!box || !current) return;

        const index = Number(box.dataset.criterion);

        box.checked ? current.criterios.add(index) : current.criterios.delete(index);

        updateCriteriaCount();
        updateDecisionState();
    });


    /* OBSERVACIONES */

    function renderObservations() {

        const list = $("obsList");
        const count = current.borrador.length;

        $("obsCount").textContent = count ? String(count) : "";

        if (!count) {
            list.innerHTML = `
                <li class="obs-empty">
                    Aún no ha agregado observaciones a esta versión.
                </li>
            `;
            return;
        }

        list.innerHTML = current.borrador.map((obs, index) => `
            <li class="obs-item">
                <span class="obs-item__number">${index + 1}</span>
                <div>
                    <p>${escapeHTML(obs.texto)}</p>
                    ${obs.ubicacion ? `<em>${escapeHTML(obs.ubicacion)}</em>` : ""}
                </div>
                <button type="button" class="obs-item__remove" data-remove-obs="${index}" aria-label="Eliminar observación ${index + 1}">
                    ${svg("trash")}
                </button>
            </li>
        `).join("");
    }

    $("drawerBody").addEventListener("submit", event => {

        if (event.target.id !== "obsForm") return;

        event.preventDefault();

        const text = $("obsText").value.trim();
        const where = $("obsWhere").value.trim();
        const error = document.querySelector('[data-error="obsText"]');

        if (text.length < 10) {
            error.textContent = "Escriba una observación de al menos 10 caracteres.";
            $("obsText").classList.add("invalid");
            $("obsText").focus();
            return;
        }

        current.borrador.push({ texto: text, ubicacion: where });

        $("obsText").value = "";
        $("obsWhere").value = "";

        renderObservations();
        updateDecisionState();

        $("obsText").focus();
    });

    $("drawerBody").addEventListener("input", event => {
        if (event.target.id === "obsText") {
            event.target.classList.remove("invalid");
            document.querySelector('[data-error="obsText"]').textContent = "";
        }
    });

    $("drawerBody").addEventListener("click", event => {

        const remove = event.target.closest("[data-remove-obs]");

        if (!remove || !current) return;

        current.borrador.splice(Number(remove.dataset.removeObs), 1);

        renderObservations();
        updateDecisionState();
    });


    /* ESTADO DE LOS BOTONES DE DECISIÓN */

    function updateDecisionState() {

        if (!current) return;

        const hint = $("decisionHint");
        const pendingCriteria = CRITERIA.length - current.criterios.size;
        const drafts = current.borrador.length;

        let message = "";
        let tone = "";
        let canApprove = false;

        if (!current.integridadVerificada) {
            message = "Verificando la integridad del archivo…";
        } else if (!current.integra) {
            message = "La huella no coincide con la firmada: solo puede solicitar cambios o rechazar.";
            tone = "danger";
        } else if (drafts > 0) {
            message = `Tiene ${plural(drafts, "observación", "observaciones")}. Envíelas con «Solicitar cambios» o elimínelas para aprobar.`;
            tone = "warn";
        } else if (pendingCriteria > 0) {
            message = `Marque ${pendingCriteria === 1 ? "el criterio restante" : `los ${pendingCriteria} criterios restantes`} para poder aprobar.`;
        } else {
            message = "Todos los criterios cumplidos. Puede aprobar la versión.";
            tone = "ok";
            canApprove = true;
        }

        hint.textContent = message;
        hint.dataset.tone = tone;

        $("approveButton").disabled = !canApprove;
        $("changesButton").disabled = drafts === 0;
        $("changesButton").title = drafts === 0 ? "Agregue al menos una observación" : "";
    }


    /* =====================================================
       DECISIÓN + FIRMA DEL REVISOR
    ====================================================== */

    let pendingDecision = null;

    const decisionCopy = {
        aprobado: {
            eyebrow: "FIRMAR APROBACIÓN",
            title: "Aprobar versión",
            text: v => `La versión v${v} quedará como versión oficial del activo. Su firma queda asociada a la huella del archivo.`,
            consent: "Declaro que revisé esta versión, que cumple los criterios institucionales y que la apruebo bajo mi responsabilidad.",
            submit: "Firmar aprobación"
        },
        cambios: {
            eyebrow: "FIRMAR SOLICITUD DE CAMBIOS",
            title: "Solicitar cambios",
            text: v => `El activo vuelve al autor con sus observaciones. Deberá subir y firmar una versión nueva (v${v + 1}).`,
            consent: "Declaro que las observaciones reflejan mi revisión de esta versión.",
            submit: "Firmar y devolver al autor"
        },
        rechazado: {
            eyebrow: "FIRMAR RECHAZO",
            title: "Rechazar versión",
            text: () => "La versión sale del flujo editorial. Indique el motivo: el autor lo verá en su historial.",
            consent: "Declaro que revisé esta versión y la rechazo bajo mi responsabilidad.",
            submit: "Firmar rechazo"
        }
    };

    function openDecision(tipo) {

        if (!current) return;

        const asset = current;
        const copy = decisionCopy[tipo];
        const v = asset.actual.numero;

        pendingDecision = { tipo, asset, attempts: 0 };

        $("decisionForm").reset();
        $("decisionPin").classList.remove("invalid");
        $("rejectReason").classList.remove("invalid");
        document.querySelectorAll("#decisionForm .form-error").forEach(e => (e.textContent = ""));

        $("decisionEyebrow").textContent = copy.eyebrow;
        $("decisionTitle").textContent = copy.title;
        $("decisionText").textContent = copy.text(v);
        $("decisionConsentText").textContent = copy.consent;
        $("decisionSubmit").textContent = copy.submit;
        $("decisionSubmit").disabled = true;
        $("decisionSubmit").classList.toggle("btn-primary--danger", tipo === "rechazado");
        $("rejectReasonField").hidden = tipo !== "rechazado";

        const rows = [
            ["Activo", `${escapeHTML(asset.nombre)} · v${v}`],
            ["Autor", escapeHTML(asset.autor)],
            ["Integridad", asset.integra ? "La huella coincide" : '<span class="text-danger">La huella no coincide</span>'],
            ["Criterios", `${asset.criterios.size} de ${CRITERIA.length} cumplidos`]
        ];

        let html = rows.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join("");

        if (tipo === "cambios") {
            html += `
                <div class="full">
                    <dt>Observaciones que se enviarán (${asset.borrador.length})</dt>
                    <dd>
                        <ol class="summary-obs">
                            ${asset.borrador.map(o => `
                                <li>${escapeHTML(o.texto)}${o.ubicacion ? ` <em>${escapeHTML(o.ubicacion)}</em>` : ""}</li>
                            `).join("")}
                        </ol>
                    </dd>
                </div>
            `;
        }

        $("decisionSummary").innerHTML = html;

        openModal($("decisionModal"));

        setTimeout(() => (tipo === "rechazado" ? $("rejectReason") : $("decisionConsent")).focus(), 60);
    }

    $("approveButton").addEventListener("click", () => openDecision("aprobado"));
    $("changesButton").addEventListener("click", () => openDecision("cambios"));
    $("rejectButton").addEventListener("click", () => openDecision("rechazado"));

    $("decisionConsent").addEventListener("change", () => {
        $("decisionSubmit").disabled = !$("decisionConsent").checked;
    });

    $("decisionPin").addEventListener("input", () => {
        $("decisionPin").value = $("decisionPin").value.replace(/\D/g, "");
        $("decisionPin").classList.remove("invalid");
        document.querySelector('[data-error="decisionPin"]').textContent = "";
    });

    $("rejectReason").addEventListener("input", () => {
        $("rejectReason").classList.remove("invalid");
        document.querySelector('[data-error="rejectReason"]').textContent = "";
    });

    $("decisionForm").addEventListener("submit", async event => {

        event.preventDefault();

        if (!pendingDecision) return;

        const { tipo, asset } = pendingDecision;
        const reason = $("rejectReason").value.trim();

        if (tipo === "rechazado" && reason.length < 15) {
            document.querySelector('[data-error="rejectReason"]').textContent =
                "Explique el motivo del rechazo (mínimo 15 caracteres).";
            $("rejectReason").classList.add("invalid");
            $("rejectReason").focus();
            return;
        }

        if ($("decisionPin").value !== DEMO_PIN) {

            pendingDecision.attempts += 1;

            logEvent({
                accion: "Intento de firma fallido",
                icono: "alert",
                variante: "danger",
                recurso: asset.nombre,
                detalle: `PIN incorrecto (${pendingDecision.attempts} de ${MAX_ATTEMPTS})`
            });

            if (pendingDecision.attempts >= MAX_ATTEMPTS) {
                closeModal($("decisionModal"));
                pendingDecision = null;
                showToast("Firma bloqueada por intentos fallidos. Quedó registrado en su historial.");
                return;
            }

            document.querySelector('[data-error="decisionPin"]').textContent =
                `PIN incorrecto. Le quedan ${MAX_ATTEMPTS - pendingDecision.attempts} intentos.`;
            $("decisionPin").classList.add("invalid");
            $("decisionPin").value = "";
            $("decisionPin").focus();
            return;
        }

        $("decisionSubmit").disabled = true;
        $("decisionSubmit").textContent = "Firmando…";

        const ts = new Date();

        decisionCounter += 1;

        const decision = {
            id: `REV-${ts.getFullYear()}-${String(decisionCounter).padStart(5, "0")}`,
            tipo,
            ts,
            fecha: label(ts),
            activo: asset.nombre,
            tipoActivo: asset.tipo,
            autor: asset.autor,
            version: asset.actual.numero,
            archivo: asset.actual.archivo,
            hash: asset.actual.hash,
            revisor: USER.nombre,
            valor: await sha256Text(`${asset.actual.hash}|${USER.id}|${tipo}|${ts.toISOString()}`),
            observaciones: tipo === "cambios" ? [...asset.borrador] : [],
            motivo: tipo === "rechazado" ? reason : "",
            abierto: tipo === "cambios"
        };

        decisions.unshift(decision);
        events.push(eventFromDecision(decision));

        // Sale de la cola del revisor
        queue.splice(queue.indexOf(asset), 1);

        pendingDecision = null;

        closeModal($("decisionModal"));
        closeReview();
        renderAll();

        const toastText = {
            aprobado: `${asset.nombre} v${decision.version} aprobado.`,
            cambios: `Observaciones enviadas a ${asset.autor}.`,
            rechazado: `${asset.nombre} v${decision.version} rechazado.`
        };

        showToast(toastText[tipo]);
        showReceipt(decision);
    });


    /* =====================================================
       COMPROBANTE
    ====================================================== */

    let receiptDecision = null;

    const decisionNames = {
        aprobado: "Aprobada",
        cambios: "Cambios solicitados",
        rechazado: "Rechazada"
    };

    function showReceipt(decision) {

        receiptDecision = decision;

        const dialog = $("receiptDialog");

        dialog.classList.remove("receipt--aprobado", "receipt--cambios", "receipt--rechazado");
        dialog.classList.add(`receipt--${decision.tipo}`);

        $("receiptEyebrow").textContent = {
            aprobado: "APROBACIÓN FIRMADA",
            cambios: "SOLICITUD DE CAMBIOS FIRMADA",
            rechazado: "RECHAZO FIRMADO"
        }[decision.tipo];

        $("receiptTitle").textContent = `${decision.activo} · v${decision.version}`;

        let extra = "";

        if (decision.observaciones.length) {
            extra = `
                <div class="full">
                    <dt>Observaciones (${decision.observaciones.length})</dt>
                    <dd>
                        <ol class="summary-obs">
                            ${decision.observaciones.map(o => `
                                <li>${escapeHTML(o.texto)}${o.ubicacion ? ` <em>${escapeHTML(o.ubicacion)}</em>` : ""}</li>
                            `).join("")}
                        </ol>
                    </dd>
                </div>
            `;
        }

        if (decision.motivo) {
            extra = `<div class="full"><dt>Motivo del rechazo</dt><dd>${escapeHTML(decision.motivo)}</dd></div>`;
        }

        $("receiptBody").innerHTML = `
            <div><dt>ID de decisión</dt><dd>${decision.id}</dd></div>
            <div><dt>Decisión</dt><dd>${decisionNames[decision.tipo]}</dd></div>
            <div><dt>Revisor</dt><dd>${decision.revisor} · ${USER.rol}</dd></div>
            <div><dt>Fecha y hora</dt><dd>${decision.fecha}</dd></div>
            <div><dt>Autor</dt><dd>${escapeHTML(decision.autor)}</dd></div>
            <div><dt>Archivo</dt><dd>${escapeHTML(decision.archivo)}</dd></div>
            ${extra}
            <div class="full"><dt>Huella SHA-256 de la versión</dt><dd><code>${decision.hash}</code></dd></div>
            <div class="full"><dt>Valor de firma del revisor</dt><dd><code>${decision.valor}</code></dd></div>
            <div class="full"><dt>Algoritmo</dt><dd>SHA-256 con RSA-2048 (simulado) · CN=${USER.nombre}, O=MINEDUCYT, C=SV</dd></div>
        `;

        openModal($("receiptModal"));
    }

    $("downloadReceipt").addEventListener("click", () => {

        const d = receiptDecision;

        if (!d) return;

        const lines = [
            "SISCAE - COMPROBANTE DE DECISIÓN DE REVISIÓN (FIRMA SIMULADA)",
            "Ministerio de Educación, Ciencia y Tecnología",
            "",
            `ID de decisión:   ${d.id}`,
            `Decisión:         ${decisionNames[d.tipo]}`,
            `Fecha y hora:     ${d.fecha}`,
            `Revisor:          ${d.revisor} (${USER.correo})`,
            "",
            `Activo:           ${d.activo}`,
            `Versión:          v${d.version}`,
            `Archivo:          ${d.archivo}`,
            `Autor:            ${d.autor}`
        ];

        if (d.observaciones.length) {
            lines.push("", "Observaciones:");
            d.observaciones.forEach((o, i) => lines.push(`  ${i + 1}. ${o.texto}${o.ubicacion ? ` [${o.ubicacion}]` : ""}`));
        }

        if (d.motivo) {
            lines.push("", `Motivo:           ${d.motivo}`);
        }

        lines.push(
            "",
            `Huella SHA-256:   ${d.hash}`,
            `Firma revisor:    ${d.valor}`,
            "Algoritmo:        SHA-256 con RSA-2048 (simulado)",
            "",
            "Documento generado por un prototipo con fines de demostración."
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
        link.download = `comprobante-${d.id}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    });


    /* =====================================================
       CLICS DELEGADOS (revisar / comprobantes)
    ====================================================== */

    document.addEventListener("click", event => {

        const review = event.target.closest("[data-review]");

        if (review) {
            const asset = findAsset(review.dataset.review);
            if (asset) openReview(asset);
            return;
        }

        const receipt = event.target.closest("[data-receipt]");

        if (receipt) {
            const decision = findDecision(receipt.dataset.receipt);
            if (decision) showReceipt(decision);
        }
    });


    /* =====================================================
       AVISO
    ====================================================== */

    let toastTimer;

    function showToast(message) {
        const toast = $("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
    }


    /* =====================================================
       TOPBAR: PERFIL, CAMPANA Y SESIÓN
    ====================================================== */

    $("profileButton").addEventListener("click", event => {
        event.stopPropagation();
        $("profile").classList.toggle("open");
    });

    document.addEventListener("click", event => {
        if (!$("profile").contains(event.target)) {
            $("profile").classList.remove("open");
        }
    });

    // La campana lleva a la cola filtrada por urgentes
    $("notificationButton").addEventListener("click", () => {

        if (queue.some(a => a.plazo <= 0)) {
            filters.plazo = "urgentes";
            $("queueDue").value = "urgentes";
            renderQueue();
        }

        $("cola").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("sidebarLogout")?.addEventListener("click", () => openModal($("logoutModal")));
    $("profileLogout").addEventListener("click", () => openModal($("logoutModal")));

    $("confirmLogout").addEventListener("click", () => {
        // Con Firebase Auth: signOut()
        window.location.href = "login.html";
    });


    /* =====================================================
       TECLA ESCAPE
       Cierra primero el modal de arriba y luego el drawer.
    ====================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        const openModals = [...document.querySelectorAll(".modal.active")];

        if (openModals.length) {
            closeModal(openModals[openModals.length - 1]);
            return;
        }

        if (drawer.classList.contains("active")) {
            closeReview();
        }

        $("profile").classList.remove("open");
    });

}