
/* =========================================================
   SISCAE - APROBACIÓN DEL REVISOR
   Decisiones y datos simulados
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

    iniciarAprobacionRevisor();
});

function iniciarAprobacionRevisor() {

    const $ = id => document.getElementById(id);

    const STORAGE_KEY = "siscae_revisor_aprobaciones_v1";
    const OBSERVATIONS_KEY = "siscae_revisor_observaciones_v1";

    const activosIniciales = [
        {
            codigo: "ACT-001",
            nombre: "Guía docente de Matemática",
            proyecto: "Materiales de Matemática",
            autor: "Ana Martínez",
            version: 3,
            tipo: "Documento",
            fecha: "2026-10-07",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-002",
            nombre: "Cuaderno de ejercicios de Matemática",
            proyecto: "Materiales de Matemática",
            autor: "Ana Martínez",
            version: 1,
            tipo: "Documento",
            fecha: "2026-10-06",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-008",
            nombre: "Cuadernillo de Lenguaje",
            proyecto: "Recursos de Lenguaje",
            autor: "Laura Gómez",
            version: 1,
            tipo: "Documento",
            fecha: "2026-10-06",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-011",
            nombre: "Lecturas complementarias",
            proyecto: "Recursos de Lenguaje",
            autor: "Laura Gómez",
            version: 2,
            tipo: "Documento",
            fecha: "2026-10-06",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-007",
            nombre: "Guía metodológica de Ciencias",
            proyecto: "Ciencias Naturales",
            autor: "María López",
            version: 2,
            tipo: "Documento",
            fecha: "2026-10-05",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-009",
            nombre: "Video de fracciones",
            proyecto: "Ciencias Naturales",
            autor: "José Ramírez",
            version: 2,
            tipo: "Video",
            fecha: "2026-10-05",
            estado: "En revisión",
            historial: []
        },
        {
            codigo: "ACT-010",
            nombre: "Portada de Estudios Sociales",
            proyecto: "Estudios Sociales",
            autor: "Sofía Castro",
            version: 2,
            tipo: "Imagen",
            fecha: "2026-10-04",
            estado: "En revisión",
            historial: []
        }
    ];

    const observacionesDemo = [
        {
            id: "OBS-001",
            codigo: "ACT-001",
            version: 3,
            estado: "Pendiente del autor",
            prioridad: "Alta",
            mensaje: "Corregir la numeración de las actividades y verificar las ilustraciones."
        },
        {
            id: "OBS-002",
            codigo: "ACT-008",
            version: 1,
            estado: "Pendiente del autor",
            prioridad: "Media",
            mensaje: "Revisar la redacción de las instrucciones y unificar los títulos."
        },
        {
            id: "OBS-003",
            codigo: "ACT-009",
            version: 2,
            estado: "Corrección recibida",
            prioridad: "Alta",
            mensaje: "Ajustar el audio y corregir los subtítulos."
        },
        {
            id: "OBS-004",
            codigo: "ACT-010",
            version: 2,
            estado: "Resuelta",
            prioridad: "Baja",
            mensaje: "Ajustar la alineación y mejorar el contraste."
        }
    ];

    function cargarActivos() {
        try {
            const guardados = localStorage.getItem(STORAGE_KEY);

            if (guardados !== null) {
                const datos = JSON.parse(guardados);
                if (Array.isArray(datos)) return datos;
            }
        } catch (error) {
            console.warn("Error recuperando aprobaciones:", error);
        }

        return structuredClone(activosIniciales);
    }

    let activos = cargarActivos();
    let activoActual = null;
    let decisionPendiente = null;
    let toastTimer = null;
    let ultimoFoco = null;

    function guardarActivos() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activos));
            return true;
        } catch (error) {
            console.error("No se pudieron guardar las decisiones:", error);
            mostrarToast("No se pudieron guardar los cambios.");
            return false;
        }
    }

    function obtenerObservaciones() {
        try {
            const guardadas = localStorage.getItem(OBSERVATIONS_KEY);

            if (guardadas !== null) {
                const datos = JSON.parse(guardadas);
                if (Array.isArray(datos)) return datos;
            }
        } catch (error) {
            console.warn("Error recuperando observaciones:", error);
        }

        return observacionesDemo;
    }

    function observacionesDelActivo(activo) {
        return obtenerObservaciones().filter(item =>
            item.codigo === activo.codigo &&
            Number(item.version) === Number(activo.version)
        );
    }

    function observacionesPendientes(activo) {
        return observacionesDelActivo(activo).filter(
            item => item.estado !== "Resuelta"
        );
    }

    function escaparHTML(valor) {
        const div = document.createElement("div");
        div.textContent = String(valor ?? "");
        return div.innerHTML;
    }

    function fechaActual() {
        return new Date().toLocaleString("es-SV", {
            dateStyle: "short",
            timeStyle: "short"
        });
    }

    function mostrarToast(mensaje) {
        const toast = $("approvalToast");
        toast.textContent = mensaje;
        toast.classList.add("visible");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove("visible");
        }, 3500);
    }

    function claseEstado(estado) {
        return {
            "En revisión": "review",
            "Aprobado": "approved",
            "Rechazado": "rejected"
        }[estado] || "review";
    }

    function actualizarEstadisticas() {
        const revision = activos.filter(
            item => item.estado === "En revisión"
        ).length;

        const observados = activos.filter(
            item => observacionesPendientes(item).length > 0
        ).length;

        const aprobados = activos.filter(
            item => item.estado === "Aprobado"
        ).length;

        const rechazados = activos.filter(
            item => item.estado === "Rechazado"
        ).length;

        $("statReview").textContent = revision;
        $("statObserved").textContent = observados;
        $("statApproved").textContent = aprobados;
        $("statRejected").textContent = rechazados;

        document.querySelectorAll("[data-sidebar-count]").forEach(el => {
            if (el.dataset.sidebarCount === "cola") {
                el.textContent = revision;
            }
        });
    }

    function obtenerFiltrados() {
        const busqueda = $("searchAsset").value
            .trim()
            .toLocaleLowerCase("es");

        const estado = $("filterStatus").value;
        const tipo = $("filterType").value;

        return activos.filter(item => {
            const texto = [
                item.codigo,
                item.nombre,
                item.autor,
                item.proyecto
            ].join(" ").toLocaleLowerCase("es");

            return texto.includes(busqueda) &&
                (estado === "todos" || item.estado === estado) &&
                (tipo === "todos" || item.tipo === tipo);
        });
    }

    function renderizarTabla() {
        const registros = obtenerFiltrados();

        $("assetsBody").innerHTML = registros.map(item => {
            const observaciones = observacionesDelActivo(item);
            const pendientes = observacionesPendientes(item).length;

            return `
                <tr>
                    <td>
                        <span class="aprobacion-code">
                            ${escaparHTML(item.codigo)}
                        </span>
                    </td>

                    <td class="aprobacion-asset">
                        <strong>${escaparHTML(item.nombre)}</strong>
                        <small>
                            ${escaparHTML(item.proyecto)} ·
                            ${escaparHTML(item.tipo)}
                        </small>
                    </td>

                    <td>${escaparHTML(item.autor)}</td>

                    <td>V${escaparHTML(item.version)}</td>

                    <td>
                        <span class="aprobacion-observation-count">
                            ${observaciones.length} registrada(s)
                            ${pendientes > 0
                                ? ` · ${pendientes} pendiente(s)`
                                : ""}
                        </span>
                    </td>

                    <td>
                        <span class="aprobacion-pill ${claseEstado(item.estado)}">
                            ${escaparHTML(item.estado)}
                        </span>
                    </td>

                    <td>
                        <button type="button"
                                class="aprobacion-view"
                                data-review="${escaparHTML(item.codigo)}">
                            ${item.estado === "En revisión"
                                ? "Revisar"
                                : "Ver decisión"}
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        $("assetsEmpty").hidden = registros.length > 0;

        $("resultsCount").textContent =
            `${registros.length} activo${registros.length === 1 ? "" : "s"}`;

        $("tableSummary").textContent =
            `Mostrando ${registros.length} de ${activos.length} activos`;
    }

    function renderizarRecientes() {
        const decisiones = activos.flatMap(activo =>
            (activo.historial || []).map(evento => ({
                ...evento,
                activo: activo.nombre
            }))
        ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        $("recentDecisions").innerHTML = decisiones.length
            ? decisiones.slice(0, 4).map(item => `
                <div class="aprobacion-recent-item">
                    <strong>
                        ${escaparHTML(item.accion)} ·
                        ${escaparHTML(item.activo)}
                    </strong>
                    <span>${escaparHTML(item.fecha)}</span>
                </div>
            `).join("")
            : `
                <div class="aprobacion-none">
                    Todavía no hay decisiones registradas en
                    este navegador.
                </div>
            `;
    }

    function actualizarVista() {
        actualizarEstadisticas();
        renderizarTabla();
        renderizarRecientes();
    }

    function abrirModal(id) {
        const modal = $(id);
        ultimoFoco = document.activeElement;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("aprobacion-modal-open");

        modal.querySelector("button")?.focus();
    }

    function cerrarModal(id) {
        const modal = $(id);

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".aprobacion-modal.active")) {
            document.body.classList.remove("aprobacion-modal-open");
        }

        if (ultimoFoco?.isConnected) {
            ultimoFoco.focus();
        }
    }

    function abrirRevision(codigo) {
        const item = activos.find(activo => activo.codigo === codigo);
        if (!item) return;

        activoActual = codigo;
        $("decisionReason").value = "";
        $("decisionWarning").hidden = true;

        $("reviewModalTitle").textContent = item.nombre;

        $("reviewModalSubtitle").textContent =
            `${item.codigo} · Versión ${item.version} · ${item.tipo}`;

        const campos = [
            ["Proyecto", item.proyecto],
            ["Código", item.codigo],
            ["Autor", item.autor],
            ["Versión", `Versión ${item.version}`],
            ["Tipo de recurso", item.tipo],
            ["Fecha de entrega", item.fecha],
            ["Estado editorial", item.estado]
        ];

        $("assetDetails").innerHTML = campos.map(([titulo, valor]) => `
            <div class="aprobacion-detail-field">
                <span>${escaparHTML(titulo)}</span>
                <strong>${escaparHTML(valor)}</strong>
            </div>
        `).join("");

        const observaciones = observacionesDelActivo(item);
        const pendientes = observacionesPendientes(item);

        $("observationCount").textContent = observaciones.length;

        $("assetObservations").innerHTML = observaciones.length
            ? observaciones.map(obs => `
                <div class="aprobacion-observation">
                    <strong>
                        ${escaparHTML(obs.id)} ·
                        ${escaparHTML(obs.estado)}
                    </strong>
                    <p>${escaparHTML(obs.mensaje)}</p>
                    <small>
                        Prioridad: ${escaparHTML(obs.prioridad)}
                    </small>
                </div>
            `).join("")
            : `
                <div class="aprobacion-none">
                    No hay observaciones registradas para esta versión.
                </div>
            `;

        $("assetHistory").innerHTML =
            (item.historial || []).length
                ? item.historial.map(evento => `
                    <div class="aprobacion-history-item">
                        <strong>${escaparHTML(evento.accion)}</strong>
                        <p>${escaparHTML(evento.motivo)}</p>
                        <small>
                            ${escaparHTML(evento.fecha)} ·
                            ${escaparHTML(evento.usuario)}
                        </small>
                    </div>
                `).join("")
                : `
                    <div class="aprobacion-none">
                        Esta versión todavía no tiene decisiones registradas.
                    </div>
                `;

        const editable = item.estado === "En revisión";

        $("decisionSection").hidden = !editable;

        $("approveButton").disabled =
            !editable || pendientes.length > 0;

        if (editable && pendientes.length > 0) {
            $("decisionWarning").textContent =
                `No se puede aprobar esta versión porque tiene ` +
                `${pendientes.length} observación(es) sin resolver. ` +
                `Primero debe completarse su seguimiento.`;

            $("decisionWarning").hidden = false;
        }

        abrirModal("reviewModal");
    }

    function prepararDecision(tipo) {
        const item = activos.find(
            activo => activo.codigo === activoActual
        );

        if (!item || item.estado !== "En revisión") return;

        const motivo = $("decisionReason").value.trim();

        if (motivo.length < 10) {
            $("decisionWarning").textContent =
                "Escriba una justificación de al menos 10 caracteres.";

            $("decisionWarning").hidden = false;
            $("decisionReason").focus();
            return;
        }

        if (
            tipo === "Aprobar" &&
            observacionesPendientes(item).length > 0
        ) {
            $("decisionWarning").textContent =
                "No se puede aprobar mientras existan observaciones sin resolver.";

            $("decisionWarning").hidden = false;
            return;
        }

        decisionPendiente = { tipo, motivo };

        const titulos = {
            "Aprobar": "Confirmar aprobación",
            "Rechazar": "Confirmar rechazo",
            "Solicitar correcciones": "Confirmar solicitud"
        };

        $("confirmTitle").textContent = titulos[tipo];

        $("confirmMessage").textContent =
            `¿Desea registrar la decisión "${tipo}" para ` +
            `"${item.nombre}", versión ${item.version}? ` +
            `Esta acción quedará registrada en el historial del prototipo.`;

        abrirModal("confirmModal");
    }

    function confirmarDecision() {
        if (!decisionPendiente || !activoActual) return;

        const item = activos.find(
            activo => activo.codigo === activoActual
        );

        if (!item || item.estado !== "En revisión") {
            cerrarModal("confirmModal");
            return;
        }

        const { tipo, motivo } = decisionPendiente;

        if (
            tipo === "Aprobar" &&
            observacionesPendientes(item).length > 0
        ) {
            cerrarModal("confirmModal");
            mostrarToast("Existen observaciones pendientes.");
            return;
        }

        const estadoAnterior = item.estado;

        if (tipo === "Aprobar") {
            item.estado = "Aprobado";
        } else if (tipo === "Rechazar") {
            item.estado = "Rechazado";
        } else {
            // Solicitar correcciones no constituye aprobación
            // ni rechazo. El activo permanece En revisión.
            item.estado = "En revisión";
        }

        const evento = {
            accion: tipo,
            motivo,
            usuario: "Carlos Pérez",
            fecha: fechaActual(),
            timestamp: Date.now(),
            version: item.version
        };

        item.historial.push(evento);

        if (!guardarActivos()) {
            item.estado = estadoAnterior;
            item.historial.pop();
            cerrarModal("confirmModal");
            return;
        }

        decisionPendiente = null;

        cerrarModal("confirmModal");
        cerrarModal("reviewModal");

        actualizarVista();

        mostrarToast(
            tipo === "Aprobar"
                ? "Versión aprobada correctamente (simulación)."
                : tipo === "Rechazar"
                    ? "Versión rechazada correctamente (simulación)."
                    : "Solicitud de correcciones registrada."
        );
    }

    function configurarEventos() {
        ["searchAsset", "filterStatus", "filterType"].forEach(id => {
            $(id).addEventListener(
                id === "searchAsset" ? "input" : "change",
                renderizarTabla
            );
        });

        $("clearFilters").addEventListener("click", () => {
            $("searchAsset").value = "";
            $("filterStatus").value = "todos";
            $("filterType").value = "todos";
            renderizarTabla();
        });

        $("approveButton").addEventListener("click", () => {
            prepararDecision("Aprobar");
        });

        $("changesButton").addEventListener("click", () => {
            prepararDecision("Solicitar correcciones");
        });

        $("rejectButton").addEventListener("click", () => {
            prepararDecision("Rechazar");
        });

        $("confirmDecision").addEventListener(
            "click",
            confirmarDecision
        );

        document.addEventListener("click", event => {
            const boton = event.target.closest("[data-review]");

            if (boton) {
                abrirRevision(boton.dataset.review);
                return;
            }

            if (event.target.closest("[data-cancel-decision]")) {
                decisionPendiente = null;
                cerrarModal("confirmModal");
                return;
            }

            if (event.target.closest("[data-close-review]")) {
                cerrarModal("reviewModal");
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;

            if ($("confirmModal").classList.contains("active")) {
                decisionPendiente = null;
                cerrarModal("confirmModal");
            } else if ($("reviewModal").classList.contains("active")) {
                cerrarModal("reviewModal");
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
                destino === "aprobacionRevisor.html" ||
                pagina === "aprobacionRevisor" ||
                pagina === "aprobacionRevisor.html";

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

                menuButton?.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        }
    }

    actualizarVista();
    configurarEventos();
    configurarSidebar();

    // Actualizar las observaciones si se vuelve a esta pestaña
    // después de registrar correcciones en otra vista.
    window.addEventListener("focus", () => {
        actualizarVista();
    });

    window.addEventListener("storage", event => {
        if (event.key === OBSERVATIONS_KEY) {
            actualizarVista();
        }
    });
}
