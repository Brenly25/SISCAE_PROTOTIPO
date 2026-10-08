
/* =========================================================
   SISCAE - AUDITORÍA DEL REVISOR
   Registro consolidado del prototipo
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

    iniciarAuditoriaRevisor();
});

function iniciarAuditoriaRevisor() {

    const $ = id => document.getElementById(id);

    const OBSERVATIONS_KEY =
        "siscae_revisor_observaciones_v1";

    const APPROVALS_KEY =
        "siscae_revisor_aprobaciones_v1";

    const eventosDemo = [
        {
            id: "AUD-DEMO-001",
            fecha: "2026-10-07",
            hora: "09:30",
            accion: "Activo enviado a revisión",
            tipo: "Revisión",
            codigo: "ACT-001",
            activo: "Guía docente de Matemática",
            version: 3,
            usuario: "Ana Martínez",
            descripcion:
                "La versión 3 del activo editorial fue enviada a revisión."
        },
        {
            id: "AUD-DEMO-002",
            fecha: "2026-10-06",
            hora: "11:15",
            accion: "Activo enviado a revisión",
            tipo: "Revisión",
            codigo: "ACT-008",
            activo: "Cuadernillo de Lenguaje",
            version: 1,
            usuario: "Laura Gómez",
            descripcion:
                "El cuadernillo fue enviado a la bandeja de revisión."
        },
        {
            id: "AUD-DEMO-003",
            fecha: "2026-10-05",
            hora: "08:45",
            accion: "Activo enviado a revisión",
            tipo: "Revisión",
            codigo: "ACT-009",
            activo: "Video de fracciones",
            version: 2,
            usuario: "José Ramírez",
            descripcion:
                "El recurso multimedia fue enviado para revisión editorial."
        }
    ];

    const observacionesDemo = [
        {
            id: "OBS-001",
            fecha: "2026-10-07",
            codigo: "ACT-001",
            activo: "Guía docente de Matemática",
            version: 3,
            autor: "Ana Martínez",
            mensaje:
                "Corregir la numeración de las actividades.",
            historial: [
                {
                    accion: "Observación registrada por el Revisor",
                    fecha: "07/10/2026"
                }
            ]
        },
        {
            id: "OBS-002",
            fecha: "2026-10-06",
            codigo: "ACT-008",
            activo: "Cuadernillo de Lenguaje",
            version: 1,
            autor: "Laura Gómez",
            mensaje:
                "Revisar la redacción de las instrucciones.",
            historial: [
                {
                    accion: "Observación registrada",
                    fecha: "06/10/2026"
                }
            ]
        },
        {
            id: "OBS-003",
            fecha: "2026-10-05",
            codigo: "ACT-009",
            activo: "Video de fracciones",
            version: 2,
            autor: "José Ramírez",
            mensaje:
                "Ajustar el audio y corregir los subtítulos.",
            historial: [
                {
                    accion: "Observación registrada",
                    fecha: "05/10/2026"
                },
                {
                    accion: "Corrección recibida del autor (simulación)",
                    fecha: "07/10/2026"
                }
            ]
        },
        {
            id: "OBS-004",
            fecha: "2026-10-04",
            codigo: "ACT-010",
            activo: "Portada de Estudios Sociales",
            version: 2,
            autor: "Sofía Castro",
            mensaje:
                "Ajustar la alineación del título.",
            historial: [
                {
                    accion: "Observación registrada",
                    fecha: "04/10/2026"
                },
                {
                    accion: "Corrección recibida",
                    fecha: "06/10/2026"
                },
                {
                    accion: "Observación resuelta",
                    fecha: "07/10/2026"
                }
            ]
        }
    ];

    let eventos = [];
    let toastTimer = null;
    let ultimoFoco = null;

    function escaparHTML(valor) {
        const div = document.createElement("div");
        div.textContent = String(valor ?? "");
        return div.innerHTML;
    }

    function leerAlmacenamiento(clave) {
        try {
            const texto = localStorage.getItem(clave);

            if (texto === null) return null;

            const datos = JSON.parse(texto);

            return Array.isArray(datos) ? datos : null;
        } catch (error) {
            console.warn("No se pudo leer:", clave, error);
            return null;
        }
    }

    function normalizarFecha(fecha) {
        if (!fecha) return "";

        const texto = String(fecha).trim();

        if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
            return texto;
        }

        const coincidencia = texto.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );

        if (coincidencia) {
            const dia = coincidencia[1].padStart(2, "0");
            const mes = coincidencia[2].padStart(2, "0");
            const anio = coincidencia[3];

            return `${anio}-${mes}-${dia}`;
        }

        return "";
    }

    function extraerHora(fecha) {
        if (!fecha) return "—";

        const coincidencia = String(fecha).match(
            /(\d{1,2}):(\d{2})/
        );

        if (!coincidencia) return "—";

        return `${coincidencia[1].padStart(2, "0")}:${coincidencia[2]}`;
    }

    function fechaLegible(fecha) {
        if (!fecha) return "—";

        const partes = fecha.split("-");

        if (partes.length !== 3) return fecha;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function tipoDesdeAccion(accion) {
        const texto = String(accion || "").toLowerCase();

        if (texto.includes("aprobar") ||
            texto.includes("aprobación") ||
            texto.includes("aprobada")) {
            return "Aprobación";
        }

        if (texto.includes("rechazar") ||
            texto.includes("rechazo") ||
            texto.includes("rechazada")) {
            return "Rechazo";
        }

        if (texto.includes("corrección") ||
            texto.includes("correcciones") ||
            texto.includes("resuelta")) {
            return "Corrección";
        }

        if (texto.includes("observación")) {
            return "Observación";
        }

        return "Revisión";
    }

    function construirEventos() {
        const resultado = [...eventosDemo];

        const observaciones =
            leerAlmacenamiento(OBSERVATIONS_KEY) ??
            observacionesDemo;

        observaciones.forEach(obs => {
            const historial = Array.isArray(obs.historial)
                ? obs.historial
                : [];

            if (!historial.length) {
                resultado.push({
                    id: `AUD-${obs.id}`,
                    fecha: normalizarFecha(obs.fecha),
                    hora: "—",
                    accion: "Observación registrada",
                    tipo: "Observación",
                    codigo: obs.codigo,
                    activo: obs.activo,
                    version: obs.version,
                    usuario: "Carlos Pérez",
                    descripcion: obs.mensaje
                });

                return;
            }

            historial.forEach((movimiento, indice) => {
                const tipo = tipoDesdeAccion(movimiento.accion);

                resultado.push({
                    id: `AUD-${obs.id}-${indice + 1}`,
                    fecha: normalizarFecha(
                        movimiento.fecha || obs.fecha
                    ),
                    hora: extraerHora(movimiento.fecha),
                    accion: movimiento.accion,
                    tipo,
                    codigo: obs.codigo,
                    activo: obs.activo,
                    version: obs.version,
                    usuario: tipo === "Corrección" &&
                        String(movimiento.accion)
                            .toLowerCase()
                            .includes("recibida")
                            ? obs.autor
                            : "Carlos Pérez",
                    descripcion:
                        `${obs.id}: ${obs.mensaje}`
                });
            });
        });

        const activos =
            leerAlmacenamiento(APPROVALS_KEY) ?? [];

        activos.forEach(activo => {
            const historial = Array.isArray(activo.historial)
                ? activo.historial
                : [];

            historial.forEach((movimiento, indice) => {
                resultado.push({
                    id: `AUD-${activo.codigo}-${indice + 1}`,
                    fecha: normalizarFecha(movimiento.fecha),
                    hora: extraerHora(movimiento.fecha),
                    accion: movimiento.accion,
                    tipo: tipoDesdeAccion(movimiento.accion),
                    codigo: activo.codigo,
                    activo: activo.nombre,
                    version: activo.version,
                    usuario: movimiento.usuario || "Carlos Pérez",
                    descripcion: movimiento.motivo || "Sin descripción",
                    timestamp: movimiento.timestamp || 0
                });
            });
        });

        return resultado.sort((a, b) => {
            const claveA =
                `${a.fecha || "0000-00-00"} ${a.hora === "—" ? "00:00" : a.hora}`;

            const claveB =
                `${b.fecha || "0000-00-00"} ${b.hora === "—" ? "00:00" : b.hora}`;

            return claveB.localeCompare(claveA);
        });
    }

    function claseTipo(tipo) {
        return {
            "Observación": "observacion",
            "Aprobación": "aprobacion",
            "Rechazo": "rechazo",
            "Corrección": "correccion",
            "Revisión": "revision"
        }[tipo] || "revision";
    }

    function actualizarEstadisticas() {
        $("statTotal").textContent = eventos.length;

        $("statObservations").textContent =
            eventos.filter(e => e.tipo === "Observación").length;

        $("statApprovals").textContent =
            eventos.filter(e => e.tipo === "Aprobación").length;

        $("statRejections").textContent =
            eventos.filter(e => e.tipo === "Rechazo").length;
    }

    function obtenerFiltrados() {
        const busqueda = $("searchAudit").value
            .trim()
            .toLocaleLowerCase("es");

        const tipo = $("filterType").value;
        const desde = $("filterFrom").value;
        const hasta = $("filterTo").value;

        return eventos.filter(evento => {
            const contenido = [
                evento.id,
                evento.accion,
                evento.codigo,
                evento.activo,
                evento.usuario,
                evento.descripcion
            ].join(" ").toLocaleLowerCase("es");

            return contenido.includes(busqueda) &&
                (tipo === "todos" || evento.tipo === tipo) &&
                (!desde || evento.fecha >= desde) &&
                (!hasta || evento.fecha <= hasta);
        });
    }

    function renderizarTabla() {
        const registros = obtenerFiltrados();

        $("auditBody").innerHTML = registros.map(evento => `
            <tr>
                <td class="auditoria-date">
                    <strong>${escaparHTML(fechaLegible(evento.fecha))}</strong>
                    <small>${escaparHTML(evento.hora)}</small>
                </td>

                <td class="auditoria-event">
                    <strong>${escaparHTML(evento.accion)}</strong>
                    <small>${escaparHTML(evento.id)}</small>
                </td>

                <td class="auditoria-asset">
                    <strong>${escaparHTML(evento.activo)}</strong>
                    <small>
                        ${escaparHTML(evento.codigo)} ·
                        Versión ${escaparHTML(evento.version)}
                    </small>
                </td>

                <td>${escaparHTML(evento.usuario)}</td>

                <td>
                    <span class="auditoria-pill ${claseTipo(evento.tipo)}">
                        ${escaparHTML(evento.tipo)}
                    </span>
                </td>

                <td>
                    <button type="button"
                            class="auditoria-view"
                            data-event="${escaparHTML(evento.id)}">
                        Ver detalle
                    </button>
                </td>
            </tr>
        `).join("");

        $("auditEmpty").hidden = registros.length > 0;

        $("resultsCount").textContent =
            `${registros.length} evento${registros.length === 1 ? "" : "s"}`;

        $("tableSummary").textContent =
            `Mostrando ${registros.length} de ${eventos.length} eventos`;
    }

    function renderizarRecientes() {
        $("recentActivity").innerHTML = eventos.length
            ? eventos.slice(0, 4).map(evento => `
                <div class="auditoria-recent-item">
                    <strong>
                        ${escaparHTML(evento.accion)} ·
                        ${escaparHTML(evento.activo)}
                    </strong>

                    <span>
                        ${escaparHTML(evento.usuario)} ·
                        ${escaparHTML(fechaLegible(evento.fecha))}
                    </span>
                </div>
            `).join("")
            : `
                <div class="auditoria-empty">
                    No hay movimientos registrados.
                </div>
            `;
    }

    function actualizarVista() {
        eventos = construirEventos();

        actualizarEstadisticas();
        renderizarTabla();
        renderizarRecientes();
    }

    function abrirDetalle(id) {
        const evento = eventos.find(item => item.id === id);
        if (!evento) return;

        ultimoFoco = document.activeElement;

        $("detailTitle").textContent = evento.accion;

        const campos = [
            ["Identificador", evento.id],
            ["Fecha", fechaLegible(evento.fecha)],
            ["Hora", evento.hora],
            ["Tipo de evento", evento.tipo],
            ["Usuario", evento.usuario],
            ["Activo editorial", evento.activo],
            ["Código del activo", evento.codigo],
            ["Versión", `Versión ${evento.version}`]
        ];

        $("auditDetails").innerHTML = campos.map(([titulo, valor]) => `
            <div class="auditoria-detail-field">
                <span>${escaparHTML(titulo)}</span>
                <strong>${escaparHTML(valor)}</strong>
            </div>
        `).join("");

        $("auditDescription").textContent = evento.descripcion;

        const modal = $("detailModal");
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("auditoria-modal-open");

        modal.querySelector("button")?.focus();
    }

    function cerrarDetalle() {
        const modal = $("detailModal");

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("auditoria-modal-open");

        if (ultimoFoco?.isConnected) {
            ultimoFoco.focus();
        }
    }

    function mostrarToast(mensaje) {
        const toast = $("auditToast");

        toast.textContent = mensaje;
        toast.classList.add("visible");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("visible");
        }, 3500);
    }

    function exportarCSV() {
        const registros = obtenerFiltrados();

        if (!registros.length) {
            mostrarToast("No hay eventos para exportar.");
            return;
        }

        const columnas = [
            "Identificador",
            "Fecha",
            "Hora",
            "Acción",
            "Tipo",
            "Código de activo",
            "Activo editorial",
            "Versión",
            "Usuario",
            "Descripción"
        ];

        function celdaCSV(valor) {
            let texto = String(valor ?? "");

            // Evitar que las hojas de cálculo interpreten
            // valores externos como fórmulas.
            if (/^[\s]*[=+\-@]/.test(texto)) {
                texto = "'" + texto;
            }

            return `"${texto.replace(/"/g, '""')}"`;
        }

        const filas = registros.map(evento => [
            evento.id,
            evento.fecha,
            evento.hora,
            evento.accion,
            evento.tipo,
            evento.codigo,
            evento.activo,
            evento.version,
            evento.usuario,
            evento.descripcion
        ].map(celdaCSV).join(","));

        const contenido = "\uFEFF" + [
            columnas.map(celdaCSV).join(","),
            ...filas
        ].join("\r\n");

        const blob = new Blob(
            [contenido],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "SISCAE_Auditoria_Revisor.csv";

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        URL.revokeObjectURL(url);

        mostrarToast("Registros exportados correctamente.");
    }

    function configurarEventos() {
        ["searchAudit", "filterType", "filterFrom", "filterTo"]
            .forEach(id => {
                $(id).addEventListener(
                    id === "searchAudit" ? "input" : "change",
                    renderizarTabla
                );
            });

        $("clearFilters").addEventListener("click", () => {
            $("searchAudit").value = "";
            $("filterType").value = "todos";
            $("filterFrom").value = "";
            $("filterTo").value = "";

            renderizarTabla();
        });

        $("exportAudit").addEventListener("click", exportarCSV);

        document.addEventListener("click", event => {
            const boton = event.target.closest("[data-event]");

            if (boton) {
                abrirDetalle(boton.dataset.event);
                return;
            }

            if (event.target.closest("[data-close-detail]")) {
                cerrarDetalle();
            }
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                $("detailModal").classList.contains("active")
            ) {
                cerrarDetalle();
            }
        });

        window.addEventListener("focus", actualizarVista);

        window.addEventListener("storage", event => {
            if (
                event.key === OBSERVATIONS_KEY ||
                event.key === APPROVALS_KEY
            ) {
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
                destino === "auditoriaRevisor.html" ||
                pagina === "auditoriaRevisor" ||
                pagina === "auditoriaRevisor.html";

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
