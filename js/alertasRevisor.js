
/* =========================================================
   SISCAE - ALERTAS DEL REVISOR
   Prototipo con persistencia local
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (typeof loadRevisorSidebar === "function") {
            await loadRevisorSidebar();
        } else {
            console.error("No se encontró loadRevisorSidebar()");
        }
    } catch (error) {
        console.error("Error cargando sidebar:", error);
    }

    iniciarAlertasRevisor();
});

function iniciarAlertasRevisor() {

    const $ = id => document.getElementById(id);

    const ALERTS_KEY = "siscae_revisor_alertas_v1";
    const OBSERVATIONS_KEY = "siscae_revisor_observaciones_v1";
    const APPROVALS_KEY = "siscae_revisor_aprobaciones_v1";

    const alertasDemo = [
        {
            id: "ALR-001",
            tipo: "Revisión",
            prioridad: "Alta",
            titulo: "Revisión editorial pendiente",
            descripcion:
                "La Guía docente de Matemática, versión 3, requiere una decisión editorial.",
            codigo: "ACT-001",
            activo: "Guía docente de Matemática",
            fecha: "2026-10-07",
            accion:
                "Consultar la versión asignada y verificar sus observaciones antes de tomar una decisión.",
            destino: "aprobacionRevisor.html"
        },
        {
            id: "ALR-002",
            tipo: "Observación",
            prioridad: "Media",
            titulo: "Observaciones pendientes de seguimiento",
            descripcion:
                "El Cuadernillo de Lenguaje tiene observaciones que requieren seguimiento.",
            codigo: "ACT-008",
            activo: "Cuadernillo de Lenguaje",
            fecha: "2026-10-06",
            accion:
                "Ingresar a Observaciones y consultar el estado de las correcciones.",
            destino: "observacionesRevisor.html"
        },
        {
            id: "ALR-003",
            tipo: "Corrección",
            prioridad: "Alta",
            titulo: "Corrección recibida para revisión",
            descripcion:
                "Se recibió una corrección del Video de fracciones, versión 2, pendiente de validación editorial.",
            codigo: "ACT-009",
            activo: "Video de fracciones",
            fecha: "2026-10-07",
            accion:
                "Revisar la corrección y determinar si la observación puede resolverse.",
            destino: "observacionesRevisor.html"
        },
        {
            id: "ALR-004",
            tipo: "Revisión",
            prioridad: "Media",
            titulo: "Nuevo recurso asignado",
            descripcion:
                "La Portada de Estudios Sociales está disponible para revisión.",
            codigo: "ACT-010",
            activo: "Portada de Estudios Sociales",
            fecha: "2026-10-04",
            accion:
                "Consultar los datos de la versión y realizar la revisión correspondiente.",
            destino: "aprobacionRevisor.html"
        }
    ];

    let alertas = [];
    let alertaActual = null;
    let toastTimer = null;
    let ultimoFoco = null;

    function escaparHTML(valor) {
        const div = document.createElement("div");
        div.textContent = String(valor ?? "");
        return div.innerHTML;
    }

    function leerArray(clave) {
        try {
            const texto = localStorage.getItem(clave);
            if (texto === null) return null;

            const datos = JSON.parse(texto);
            return Array.isArray(datos) ? datos : null;
        } catch (error) {
            console.warn("Error leyendo:", clave, error);
            return null;
        }
    }

    function leerEstadoAlertas() {
        try {
            const texto = localStorage.getItem(ALERTS_KEY);
            if (!texto) return {};

            const datos = JSON.parse(texto);
            return datos && typeof datos === "object" &&
                !Array.isArray(datos) ? datos : {};
        } catch (error) {
            console.warn("Error recuperando alertas:", error);
            return {};
        }
    }

    let estadoAlertas = leerEstadoAlertas();

    function guardarEstado() {
        try {
            localStorage.setItem(
                ALERTS_KEY,
                JSON.stringify(estadoAlertas)
            );
            return true;
        } catch (error) {
            console.error("Error guardando alertas:", error);
            mostrarToast("No se pudieron guardar los cambios.");
            return false;
        }
    }

    function construirAlertas() {
        const resultado = [...alertasDemo];

        const observaciones =
            leerArray(OBSERVATIONS_KEY) ?? [];

        observaciones.forEach(obs => {
            if (obs.estado === "Resuelta") return;

            const correccion =
                obs.estado === "Corrección recibida";

            resultado.push({
                id: `ALR-OBS-${obs.id}`,
                tipo: correccion ? "Corrección" : "Observación",
                prioridad: obs.prioridad || "Media",
                titulo: correccion
                    ? "Corrección recibida para validar"
                    : "Observación pendiente de seguimiento",
                descripcion: correccion
                    ? `La observación ${obs.id} recibió una corrección que requiere validación.`
                    : `La observación ${obs.id} continúa pendiente de resolución.`,
                codigo: obs.codigo,
                activo: obs.activo || obs.codigo,
                fecha: obs.fecha || "2026-10-07",
                accion: correccion
                    ? "Revisar la corrección recibida y actualizar el seguimiento."
                    : "Consultar la observación y verificar su estado.",
                destino: "observacionesRevisor.html"
            });
        });

        const activos = leerArray(APPROVALS_KEY) ?? [];

        activos.forEach(activo => {
            if (activo.estado === "En revisión") {
                resultado.push({
                    id: `ALR-REV-${activo.codigo}`,
                    tipo: "Revisión",
                    prioridad: "Media",
                    titulo: "Activo pendiente de aprobación",
                    descripcion:
                        `El activo "${activo.nombre}" está pendiente de decisión editorial.`,
                    codigo: activo.codigo,
                    activo: activo.nombre,
                    fecha: activo.fecha,
                    accion:
                        "Ingresar a Aprobación y revisar la versión asignada.",
                    destino: "aprobacionRevisor.html"
                });
            }

            (activo.historial || []).forEach((evento, indice) => {
                resultado.push({
                    id: `ALR-DEC-${activo.codigo}-${indice}`,
                    tipo: "Decisión",
                    prioridad: "Baja",
                    titulo: `Decisión registrada: ${evento.accion}`,
                    descripcion:
                        `Se registró "${evento.accion}" para "${activo.nombre}", versión ${activo.version}.`,
                    codigo: activo.codigo,
                    activo: activo.nombre,
                    fecha: evento.fecha,
                    accion:
                        "Consultar el historial de decisiones en Auditoría.",
                    destino: "auditoriaRevisor.html"
                });
            });
        });

        return resultado.map(alerta => ({
            ...alerta,
            leida: Boolean(estadoAlertas[alerta.id]?.leida),
            atendida: Boolean(estadoAlertas[alerta.id]?.atendida)
        }));
    }

    function normalizarFecha(fecha) {
        const texto = String(fecha || "");

        if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
            return texto.slice(0, 10);
        }

        const coincidencia = texto.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );

        if (coincidencia) {
            return `${coincidencia[3]}-` +
                `${coincidencia[2].padStart(2, "0")}-` +
                `${coincidencia[1].padStart(2, "0")}`;
        }

        return "0000-00-00";
    }

    function fechaLegible(fecha) {
        const valor = normalizarFecha(fecha);
        if (valor === "0000-00-00") return "Fecha no disponible";

        const [anio, mes, dia] = valor.split("-");
        return `${dia}/${mes}/${anio}`;
    }

    function iconoTipo(tipo) {
        if (tipo === "Observación") {
            return `
                <svg viewBox="0 0 24 24">
                    <path d="M4 5h16v11H8l-4 4z"/>
                    <path d="M8 9h8M8 12h6"/>
                </svg>
            `;
        }

        if (tipo === "Corrección") {
            return `
                <svg viewBox="0 0 24 24">
                    <path d="M20 7v5h-5"/>
                    <path d="M4 17v-5h5"/>
                    <path d="M6 9a7 7 0 0 1 12-2l2 5"/>
                    <path d="M18 15a7 7 0 0 1-12 2l-2-5"/>
                </svg>
            `;
        }

        if (tipo === "Decisión") {
            return `
                <svg viewBox="0 0 24 24">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            `;
        }

        return `
            <svg viewBox="0 0 24 24">
                <rect x="5" y="4" width="14" height="16" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
        `;
    }

    function claseTipo(tipo) {
        return {
            "Observación": "observacion",
            "Corrección": "correccion",
            "Decisión": "decision",
            "Revisión": "revision"
        }[tipo] || "revision";
    }

    function clasePrioridad(prioridad) {
        return {
            "Alta": "high",
            "Media": "medium",
            "Baja": "low"
        }[prioridad] || "medium";
    }

    function actualizarEstadisticas() {
        $("statTotal").textContent = alertas.length;

        $("statUnread").textContent =
            alertas.filter(a => !a.leida).length;

        $("statHigh").textContent =
            alertas.filter(a =>
                a.prioridad === "Alta" && !a.atendida
            ).length;

        $("statAttended").textContent =
            alertas.filter(a => a.atendida).length;

        document.querySelectorAll("[data-sidebar-count]").forEach(el => {
            if (el.dataset.sidebarCount === "urgentes") {
                el.textContent = alertas.filter(a =>
                    a.prioridad === "Alta" && !a.atendida
                ).length;
            }
        });
    }

    function obtenerFiltradas() {
        const busqueda = $("searchAlert").value
            .trim()
            .toLocaleLowerCase("es");

        const tipo = $("filterType").value;
        const prioridad = $("filterPriority").value;
        const lectura = $("filterRead").value;

        return alertas.filter(alerta => {
            const contenido = [
                alerta.titulo,
                alerta.descripcion,
                alerta.codigo,
                alerta.activo
            ].join(" ").toLocaleLowerCase("es");

            return contenido.includes(busqueda) &&
                (tipo === "todos" || alerta.tipo === tipo) &&
                (prioridad === "todos" ||
                    alerta.prioridad === prioridad) &&
                (
                    lectura === "todos" ||
                    (lectura === "leida" && alerta.leida) ||
                    (lectura === "no-leida" && !alerta.leida)
                );
        });
    }

    function renderizarAlertas() {
        const registros = obtenerFiltradas();

        $("alertsList").innerHTML = registros.map(alerta => `
            <article class="alertas-item ${alerta.leida ? "" : "unread"}">

                <div class="alertas-item-icon ${claseTipo(alerta.tipo)}">
                    ${iconoTipo(alerta.tipo)}
                </div>

                <div class="alertas-item-content">

                    <div class="alertas-item-title">
                        <h3>${escaparHTML(alerta.titulo)}</h3>

                        ${alerta.leida
                            ? ""
                            : '<span class="alertas-unread-dot"></span>'}

                        <span class="alertas-priority ${clasePrioridad(alerta.prioridad)}">
                            ${escaparHTML(alerta.prioridad)}
                        </span>

                        ${alerta.atendida
                            ? '<span class="alertas-attended">Atendida</span>'
                            : ""}
                    </div>

                    <p>${escaparHTML(alerta.descripcion)}</p>

                    <div class="alertas-item-meta">
                        <span>${escaparHTML(alerta.tipo)}</span>
                        <span class="separator">·</span>
                        <span>${escaparHTML(alerta.codigo)}</span>
                        <span class="separator">·</span>
                        <span>${escaparHTML(fechaLegible(alerta.fecha))}</span>
                    </div>

                </div>

                <div class="alertas-item-actions">
                    <button type="button"
                            class="alertas-view"
                            data-view-alert="${escaparHTML(alerta.id)}">
                        Ver detalle
                    </button>

                    ${alerta.atendida
                        ? ""
                        : `
                            <button type="button"
                                    class="alertas-attend"
                                    data-attend-alert="${escaparHTML(alerta.id)}">
                                Marcar atendida
                            </button>
                        `}
                </div>

            </article>
        `).join("");

        $("alertsEmpty").hidden = registros.length > 0;

        $("resultsCount").textContent =
            `${registros.length} alerta${registros.length === 1 ? "" : "s"}`;

        $("listSummary").textContent =
            `Mostrando ${registros.length} de ${alertas.length} alertas`;
    }

    function actualizarVista() {
        alertas = construirAlertas().sort((a, b) =>
            normalizarFecha(b.fecha)
                .localeCompare(normalizarFecha(a.fecha))
        );

        actualizarEstadisticas();
        renderizarAlertas();
    }

    function actualizarEstado(id, cambios) {
        const alerta = alertas.find(a => a.id === id);
        if (!alerta) return false;

        const anterior = estadoAlertas[id] || {};

        estadoAlertas[id] = {
            ...anterior,
            ...cambios
        };

        if (!guardarEstado()) {
            estadoAlertas[id] = anterior;
            return false;
        }

        actualizarVista();
        return true;
    }

    function mostrarToast(mensaje) {
        const toast = $("alertToast");
        toast.textContent = mensaje;
        toast.classList.add("visible");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("visible");
        }, 3200);
    }

    function abrirDetalle(id) {
        const alerta = alertas.find(a => a.id === id);
        if (!alerta) return;

        ultimoFoco = document.activeElement;
        alertaActual = id;

        if (!alerta.leida) {
            actualizarEstado(id, { leida: true });
        }

        const actualizada = alertas.find(a => a.id === id);
        if (!actualizada) return;

        $("alertDetailTitle").textContent = actualizada.titulo;

        $("alertDetailSubtitle").textContent =
            `${actualizada.tipo} · ${actualizada.codigo}`;

        const campos = [
            ["Código de alerta", actualizada.id],
            ["Activo editorial", actualizada.activo],
            ["Código de activo", actualizada.codigo],
            ["Tipo", actualizada.tipo],
            ["Prioridad", actualizada.prioridad],
            ["Fecha", fechaLegible(actualizada.fecha)],
            ["Lectura", actualizada.leida ? "Leída" : "Sin leer"],
            ["Gestión", actualizada.atendida ? "Atendida" : "Pendiente"]
        ];

        $("alertDetailFields").innerHTML = campos.map(([titulo, valor]) => `
            <div class="alertas-detail-field">
                <span>${escaparHTML(titulo)}</span>
                <strong>${escaparHTML(valor)}</strong>
            </div>
        `).join("");

        $("alertDetailDescription").textContent =
            actualizada.descripcion;

        $("alertDetailAction").textContent =
            actualizada.accion;

        $("attendAlert").disabled = actualizada.atendida;

        $("attendAlert").textContent = actualizada.atendida
            ? "Alerta atendida"
            : "Marcar como atendida";

        const modal = $("alertDetailModal");
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("alertas-modal-open");

        modal.querySelector("button")?.focus();
    }

    function cerrarDetalle() {
        const modal = $("alertDetailModal");

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("alertas-modal-open");

        if (ultimoFoco?.isConnected) {
            ultimoFoco.focus();
        }
    }

    function marcarAtendida(id) {
        if (!actualizarEstado(id, {
            leida: true,
            atendida: true
        })) return;

        mostrarToast("Alerta marcada como atendida.");

        if (
            $("alertDetailModal").classList.contains("active") &&
            alertaActual === id
        ) {
            abrirDetalle(id);
        }
    }

    function marcarTodasLeidas() {
        let cambios = 0;

        alertas.forEach(alerta => {
            if (!alerta.leida) {
                estadoAlertas[alerta.id] = {
                    ...(estadoAlertas[alerta.id] || {}),
                    leida: true
                };
                cambios++;
            }
        });

        if (!cambios) {
            mostrarToast("Todas las alertas ya están leídas.");
            return;
        }

        if (!guardarEstado()) return;

        actualizarVista();
        mostrarToast(`${cambios} alerta(s) marcadas como leídas.`);
    }

    function irASeccion() {
        const alerta = alertas.find(a => a.id === alertaActual);
        if (!alerta) return;

        const destinosPermitidos = [
            "observacionesRevisor.html",
            "aprobacionRevisor.html",
            "auditoriaRevisor.html"
        ];

        if (!destinosPermitidos.includes(alerta.destino)) return;

        window.location.href = alerta.destino;
    }

    function configurarEventos() {
        ["searchAlert", "filterType", "filterPriority", "filterRead"]
            .forEach(id => {
                $(id).addEventListener(
                    id === "searchAlert" ? "input" : "change",
                    renderizarAlertas
                );
            });

        $("clearFilters").addEventListener("click", () => {
            $("searchAlert").value = "";
            $("filterType").value = "todos";
            $("filterPriority").value = "todos";
            $("filterRead").value = "todos";

            renderizarAlertas();
        });

        $("markAllRead").addEventListener(
            "click",
            marcarTodasLeidas
        );

        $("attendAlert").addEventListener("click", () => {
            if (alertaActual) marcarAtendida(alertaActual);
        });

        $("goToAlert").addEventListener("click", irASeccion);

        document.addEventListener("click", event => {
            const ver = event.target.closest("[data-view-alert]");

            if (ver) {
                abrirDetalle(ver.dataset.viewAlert);
                return;
            }

            const atender = event.target.closest("[data-attend-alert]");

            if (atender) {
                marcarAtendida(atender.dataset.attendAlert);
                return;
            }

            if (event.target.closest("[data-close-alert]")) {
                cerrarDetalle();
            }
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                $("alertDetailModal").classList.contains("active")
            ) {
                cerrarDetalle();
            }
        });

        window.addEventListener("focus", actualizarVista);

        window.addEventListener("storage", event => {
            if (
                [
                    ALERTS_KEY,
                    OBSERVATIONS_KEY,
                    APPROVALS_KEY
                ].includes(event.key)
            ) {
                if (event.key === ALERTS_KEY) {
                    estadoAlertas = leerEstadoAlertas();
                }

                actualizarVista();
            }
        });
    }

    function configurarSidebar() {
        const sidebar = $("sidebar");
        const overlay = $("mobileOverlay");
        const menuButton = $("menuButton");

        if (!sidebar) return;

        document.querySelectorAll("#sidebar .nav-item").forEach(enlace => {
            const destino = (
                enlace.getAttribute("href") || ""
            ).split("?")[0].split("#")[0].split("/").pop();

            const pagina = enlace.dataset.page || "";

            const activo =
                destino === "alertasRevisor.html" ||
                pagina === "alertasRevisor" ||
                pagina === "alertasRevisor.html";

            enlace.classList.toggle("active", activo);

            if (activo) {
                enlace.setAttribute("aria-current", "page");
            } else {
                enlace.removeAttribute("aria-current");
            }
        });

        if (menuButton) {
            menuButton.addEventListener("click", () => {
                const abierto = sidebar.classList.toggle("open");

                overlay?.classList.toggle("active", abierto);

                menuButton.setAttribute(
                    "aria-expanded",
                    String(abierto)
                );
            });
        }

        if (overlay) {
            overlay.addEventListener("click", () => {
                sidebar.classList.remove("open");
                overlay.classList.remove("active");

                menuButton?.setAttribute("aria-expanded", "false");
            });
        }
    }

    actualizarVista();
    configurarEventos();
    configurarSidebar();
}
