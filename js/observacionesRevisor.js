
/* =========================================================
   SISCAE - OBSERVACIONES DEL REVISOR
   Prototipo con almacenamiento local
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (typeof loadRevisorSidebar === "function") {
            await loadRevisorSidebar();
        } else {
            console.error("No se encontró loadRevisorSidebar()");
        }
    } catch (error) {
        console.error("Error al cargar sidebar:", error);
    }

    iniciarObservacionesRevisor();
});

function iniciarObservacionesRevisor() {

    const $ = id => document.getElementById(id);

    const STORAGE_KEY = "siscae_revisor_observaciones_v1";

    const proyectos = {
        "Materiales de Matemática": [
            {
                codigo: "ACT-001",
                nombre: "Guía docente de Matemática",
                version: 3,
                autor: "Ana Martínez"
            },
            {
                codigo: "ACT-002",
                nombre: "Cuaderno de ejercicios de Matemática",
                version: 1,
                autor: "Ana Martínez"
            }
        ],
        "Recursos de Lenguaje": [
            {
                codigo: "ACT-008",
                nombre: "Cuadernillo de Lenguaje",
                version: 1,
                autor: "Laura Gómez"
            },
            {
                codigo: "ACT-011",
                nombre: "Lecturas complementarias",
                version: 2,
                autor: "Laura Gómez"
            }
        ],
        "Ciencias Naturales": [
            {
                codigo: "ACT-007",
                nombre: "Guía metodológica de Ciencias",
                version: 2,
                autor: "María López"
            },
            {
                codigo: "ACT-009",
                nombre: "Video de fracciones",
                version: 2,
                autor: "José Ramírez"
            }
        ],
        "Estudios Sociales": [
            {
                codigo: "ACT-010",
                nombre: "Portada de Estudios Sociales",
                version: 2,
                autor: "Sofía Castro"
            }
        ]
    };

    const datosIniciales = [
        {
            id: "OBS-001",
            proyecto: "Materiales de Matemática",
            codigo: "ACT-001",
            activo: "Guía docente de Matemática",
            version: 3,
            autor: "Ana Martínez",
            tipo: "Contenido",
            prioridad: "Alta",
            estado: "Pendiente del autor",
            fecha: "2026-10-07",
            mensaje: "Corregir la numeración de las actividades y verificar la correspondencia entre los contenidos y las ilustraciones.",
            historial: [
                {
                    accion: "Observación registrada por el Revisor",
                    fecha: "07/10/2026"
                },
                {
                    accion: "Corrección solicitada al autor",
                    fecha: "07/10/2026"
                }
            ]
        },
        {
            id: "OBS-002",
            proyecto: "Recursos de Lenguaje",
            codigo: "ACT-008",
            activo: "Cuadernillo de Lenguaje",
            version: 1,
            autor: "Laura Gómez",
            tipo: "Ortografía y redacción",
            prioridad: "Media",
            estado: "Pendiente del autor",
            fecha: "2026-10-06",
            mensaje: "Revisar la redacción de las instrucciones y unificar el formato de los títulos.",
            historial: [
                {
                    accion: "Observación registrada",
                    fecha: "06/10/2026"
                }
            ]
        },
        {
            id: "OBS-003",
            proyecto: "Ciencias Naturales",
            codigo: "ACT-009",
            activo: "Video de fracciones",
            version: 2,
            autor: "José Ramírez",
            tipo: "Multimedia",
            prioridad: "Alta",
            estado: "Corrección recibida",
            fecha: "2026-10-05",
            mensaje: "Ajustar el audio de la explicación y corregir los subtítulos del minuto 02:15.",
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
            proyecto: "Estudios Sociales",
            codigo: "ACT-010",
            activo: "Portada de Estudios Sociales",
            version: 2,
            autor: "Sofía Castro",
            tipo: "Diseño y formato",
            prioridad: "Baja",
            estado: "Resuelta",
            fecha: "2026-10-04",
            mensaje: "Ajustar la alineación del título y mejorar el contraste del texto secundario.",
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

    function cargarDatos() {
        try {
            const guardados = localStorage.getItem(STORAGE_KEY);

            if (guardados !== null) {
                const parsed = JSON.parse(guardados);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (error) {
            console.warn("No se pudieron recuperar las observaciones:", error);
        }

        return structuredClone(datosIniciales);
    }

    let observaciones = cargarDatos();
    let observacionActual = null;
    let toastTimer = null;
    let ultimoFoco = null;

    function guardarDatos() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(observaciones)
            );
            return true;
        } catch (error) {
            console.error("Error guardando observaciones:", error);
            mostrarToast("No se pudieron guardar los cambios.");
            return false;
        }
    }

    function escaparHTML(valor) {
        const div = document.createElement("div");
        div.textContent = String(valor ?? "");
        return div.innerHTML;
    }

    function fechaActual() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function fechaLegible(fecha) {
        if (!fecha) return "—";
        const partes = fecha.split("-");
        if (partes.length !== 3) return fecha;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function mostrarToast(mensaje) {
        const toast = $("observationToast");
        toast.textContent = mensaje;
        toast.classList.add("visible");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove("visible");
        }, 3500);
    }

    function siguienteCodigo() {
        const maximo = observaciones.reduce((max, item) => {
            const numero = Number(
                String(item.id).replace(/^OBS-/, "")
            );
            return Number.isFinite(numero)
                ? Math.max(max, numero)
                : max;
        }, 0);

        return `OBS-${String(maximo + 1).padStart(3, "0")}`;
    }

    function claseEstado(estado) {
        return {
            "Pendiente del autor": "pendiente",
            "Corrección recibida": "recibida",
            "Resuelta": "resuelta"
        }[estado] || "";
    }

    function actualizarEstadisticas() {
        const pendientes = observaciones.filter(
            item => item.estado === "Pendiente del autor"
        ).length;

        const recibidas = observaciones.filter(
            item => item.estado === "Corrección recibida"
        ).length;

        const resueltas = observaciones.filter(
            item => item.estado === "Resuelta"
        ).length;

        $("statTotal").textContent = observaciones.length;
        $("statPending").textContent = pendientes;
        $("statReceived").textContent = recibidas;
        $("statResolved").textContent = resueltas;

        document.querySelectorAll("[data-sidebar-count]").forEach(el => {
            if (el.dataset.sidebarCount === "seguimiento") {
                el.textContent = pendientes + recibidas;
            }
        });
    }

    function filtrarObservaciones() {
        const texto = $("searchObservation").value
            .trim()
            .toLocaleLowerCase("es");

        const estado = $("filterStatus").value;
        const prioridad = $("filterPriority").value;

        return observaciones.filter(item => {
            const contenido = [
                item.id,
                item.codigo,
                item.activo,
                item.autor,
                item.proyecto,
                item.tipo
            ].join(" ").toLocaleLowerCase("es");

            return contenido.includes(texto) &&
                (estado === "todos" || item.estado === estado) &&
                (prioridad === "todas" || item.prioridad === prioridad);
        });
    }

    function renderizarTabla() {
        const registros = filtrarObservaciones();
        const tbody = $("observationsBody");

        tbody.innerHTML = registros.map(item => `
            <tr>
                <td>
                    <span class="observaciones-code">
                        ${escaparHTML(item.id)}
                    </span>
                </td>

                <td class="observaciones-asset">
                    <strong>${escaparHTML(item.activo)}</strong>
                    <small>
                        ${escaparHTML(item.codigo)} ·
                        Versión ${escaparHTML(item.version)}
                    </small>
                </td>

                <td>${escaparHTML(item.autor)}</td>
                <td>${escaparHTML(fechaLegible(item.fecha))}</td>

                <td>
                    <span class="observaciones-pill ${item.prioridad.toLowerCase()}">
                        ${escaparHTML(item.prioridad)}
                    </span>
                </td>

                <td>
                    <span class="observaciones-pill ${claseEstado(item.estado)}">
                        ${escaparHTML(item.estado)}
                    </span>
                </td>

                <td>
                    <div class="observaciones-actions">
                        <button type="button"
                                class="observaciones-view"
                                data-view="${escaparHTML(item.id)}">
                            Ver
                        </button>

                        ${item.estado !== "Resuelta" ? `
                            <button type="button"
                                    class="observaciones-edit"
                                    data-edit="${escaparHTML(item.id)}">
                                Editar
                            </button>
                        ` : ""}
                    </div>
                </td>
            </tr>
        `).join("");

        $("observationsEmpty").hidden = registros.length > 0;

        $("resultsCount").textContent =
            `${registros.length} registro${registros.length === 1 ? "" : "s"}`;

        $("tableSummary").textContent =
            `Mostrando ${registros.length} de ${observaciones.length} observaciones`;
    }

    function actualizarVista() {
        actualizarEstadisticas();
        renderizarTabla();
    }

    function abrirModal(id) {
        const modal = $(id);
        ultimoFoco = document.activeElement;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("observaciones-modal-open");

        const primerControl = modal.querySelector(
            "input:not([type='hidden']):not([readonly]):not(:disabled), select:not(:disabled), button"
        );

        primerControl?.focus();
    }

    function cerrarModal(id) {
        const modal = $(id);

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".observaciones-modal.active")) {
            document.body.classList.remove("observaciones-modal-open");
        }

        if (ultimoFoco?.isConnected) {
            ultimoFoco.focus();
        }
    }

    function cargarActivos(proyecto, codigoSeleccionado = "") {
        const select = $("formAsset");
        const activos = proyectos[proyecto] || [];

        select.innerHTML = `
            <option value="">Seleccionar activo editorial</option>
            ${activos.map(item => `
                <option value="${escaparHTML(item.codigo)}">
                    ${escaparHTML(item.nombre)}
                </option>
            `).join("")}
        `;

        select.disabled = activos.length === 0;
        select.value = codigoSeleccionado;

        actualizarDatosActivo();
    }

    function actualizarDatosActivo() {
        const proyecto = $("formProject").value;
        const codigo = $("formAsset").value;

        const activo = (proyectos[proyecto] || []).find(
            item => item.codigo === codigo
        );

        $("formVersion").value = activo
            ? `Versión ${activo.version}`
            : "";

        $("formAuthor").value = activo
            ? activo.autor
            : "";
    }

    function abrirFormulario(id = null) {
        $("observationForm").reset();
        $("editingId").value = "";
        $("formProject").disabled = false;
        $("formAsset").disabled = true;

        $("formAsset").innerHTML = `
            <option value="">Seleccione un proyecto</option>
        `;

        $("formVersion").value = "";
        $("formAuthor").value = "";

        if (id) {
            const item = observaciones.find(obs => obs.id === id);
            if (!item || item.estado === "Resuelta") return;

            $("editingId").value = item.id;
            $("formModalTitle").textContent =
                `Editar observación ${item.id}`;

            $("formProject").value = item.proyecto;
            cargarActivos(item.proyecto, item.codigo);

            $("formType").value = item.tipo;
            $("formPriority").value = item.prioridad;
            $("formMessage").value = item.mensaje;

            // No se cambia el activo al editar una observación.
            $("formProject").disabled = true;
            $("formAsset").disabled = true;
        } else {
            $("formModalTitle").textContent = "Nueva observación";
        }

        abrirModal("formModal");
    }

    function guardarFormulario(event) {
        event.preventDefault();

        const id = $("editingId").value;
        const proyecto = $("formProject").value;
        const codigo = $("formAsset").value;
        const tipo = $("formType").value;
        const prioridad = $("formPriority").value;
        const mensaje = $("formMessage").value.trim();

        if (!proyecto || !codigo || !tipo || !prioridad || !mensaje) {
            mostrarToast("Complete todos los campos obligatorios.");
            return;
        }

        const activo = (proyectos[proyecto] || []).find(
            item => item.codigo === codigo
        );

        if (!activo) {
            mostrarToast("Seleccione un activo editorial válido.");
            return;
        }

        if (id) {
            const item = observaciones.find(obs => obs.id === id);
            if (!item || item.estado === "Resuelta") return;

            item.tipo = tipo;
            item.prioridad = prioridad;
            item.mensaje = mensaje;

            item.historial.push({
                accion: "Observación editada por el Revisor",
                fecha: fechaLegible(fechaActual())
            });

            if (!guardarDatos()) return;

            mostrarToast("Observación actualizada correctamente.");
        } else {
            const nuevo = {
                id: siguienteCodigo(),
                proyecto,
                codigo: activo.codigo,
                activo: activo.nombre,
                version: activo.version,
                autor: activo.autor,
                tipo,
                prioridad,
                estado: "Pendiente del autor",
                fecha: fechaActual(),
                mensaje,
                historial: [
                    {
                        accion: "Observación registrada por el Revisor",
                        fecha: fechaLegible(fechaActual())
                    },
                    {
                        accion: "Corrección solicitada al autor",
                        fecha: fechaLegible(fechaActual())
                    }
                ]
            };

            observaciones.unshift(nuevo);

            if (!guardarDatos()) {
                observaciones.shift();
                return;
            }

            mostrarToast(
                `Observación ${nuevo.id} registrada correctamente.`
            );
        }

        cerrarModal("formModal");
        actualizarVista();
    }

    function abrirDetalle(id) {
        const item = observaciones.find(obs => obs.id === id);
        if (!item) return;

        observacionActual = id;

        $("detailModalTitle").textContent =
            `Observación ${item.id}`;

        const campos = [
            ["Proyecto", item.proyecto],
            ["Activo editorial", item.activo],
            ["Código de activo", item.codigo],
            ["Autor", item.autor],
            ["Versión", `Versión ${item.version}`],
            ["Tipo", item.tipo],
            ["Prioridad", item.prioridad],
            ["Estado", item.estado],
            ["Fecha de registro", fechaLegible(item.fecha)]
        ];

        $("observationDetails").innerHTML = campos.map(([titulo, valor]) => `
            <div class="observaciones-detail-field">
                <span>${escaparHTML(titulo)}</span>
                <strong>${escaparHTML(valor)}</strong>
            </div>
        `).join("");

        $("observationMessage").textContent = item.mensaje;

        $("observationTimeline").innerHTML = item.historial.map(evento => `
            <div class="observaciones-timeline-item">
                <strong>${escaparHTML(evento.accion)}</strong>
                <span>${escaparHTML(evento.fecha)}</span>
            </div>
        `).join("");

        $("detailActionsSection").hidden = item.estado === "Resuelta";

        $("markReceived").disabled =
            item.estado !== "Pendiente del autor";

        $("markResolved").disabled =
            item.estado !== "Corrección recibida";

        abrirModal("detailModal");
    }

    function actualizarSeguimiento(nuevoEstado) {
        const item = observaciones.find(
            obs => obs.id === observacionActual
        );

        if (!item) return;

        if (
            nuevoEstado === "Corrección recibida" &&
            item.estado !== "Pendiente del autor"
        ) {
            return;
        }

        if (
            nuevoEstado === "Resuelta" &&
            item.estado !== "Corrección recibida"
        ) {
            return;
        }

        const estadoAnterior = item.estado;

        item.estado = nuevoEstado;

        item.historial.push({
            accion: nuevoEstado === "Corrección recibida"
                ? "Corrección recibida del autor (simulación)"
                : "Observación verificada y resuelta por el Revisor",
            fecha: fechaLegible(fechaActual())
        });

        if (!guardarDatos()) {
            item.estado = estadoAnterior;
            item.historial.pop();
            return;
        }

        cerrarModal("detailModal");
        actualizarVista();

        mostrarToast(
            `Seguimiento actualizado: ${nuevoEstado}.`
        );
    }

    function configurarEventos() {
        $("newObservation").addEventListener("click", () => {
            abrirFormulario();
        });

        $("formProject").addEventListener("change", () => {
            cargarActivos($("formProject").value);
        });

        $("formAsset").addEventListener(
            "change",
            actualizarDatosActivo
        );

        $("observationForm").addEventListener(
            "submit",
            guardarFormulario
        );

        ["searchObservation", "filterStatus", "filterPriority"]
            .forEach(id => {
                $(id).addEventListener(
                    id === "searchObservation" ? "input" : "change",
                    renderizarTabla
                );
            });

        $("clearFilters").addEventListener("click", () => {
            $("searchObservation").value = "";
            $("filterStatus").value = "todos";
            $("filterPriority").value = "todas";
            renderizarTabla();
        });

        $("markReceived").addEventListener("click", () => {
            actualizarSeguimiento("Corrección recibida");
        });

        $("markResolved").addEventListener("click", () => {
            actualizarSeguimiento("Resuelta");
        });

        document.addEventListener("click", event => {
            const ver = event.target.closest("[data-view]");
            const editar = event.target.closest("[data-edit]");

            if (ver) {
                abrirDetalle(ver.dataset.view);
                return;
            }

            if (editar) {
                abrirFormulario(editar.dataset.edit);
                return;
            }

            if (event.target.closest("[data-close-form]")) {
                cerrarModal("formModal");
                return;
            }

            if (event.target.closest("[data-close-detail]")) {
                cerrarModal("detailModal");
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;

            if ($("formModal").classList.contains("active")) {
                cerrarModal("formModal");
            } else if ($("detailModal").classList.contains("active")) {
                cerrarModal("detailModal");
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
                destino === "observacionesRevisor.html" ||
                pagina === "observacionesRevisor" ||
                pagina === "observacionesRevisor.html";

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
