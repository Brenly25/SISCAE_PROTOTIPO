/* =========================================================
   SISCAE - DASHBOARD DEL REVISOR
   Prototipo con información simulada
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       CARGAR SIDEBAR COMPARTIDO
    ===================================================== */

    try {

        if (typeof loadRevisorSidebar === "function") {

            await loadRevisorSidebar();

        } else {

            console.error(
                "No se encontró loadRevisorSidebar() en components.js"
            );

        }

    } catch (error) {

        console.error(
            "Error al cargar el sidebar del Revisor:",
            error
        );

    }

    iniciarDashboardRevisor();

});


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function iniciarDashboardRevisor() {

    const obtener = id => document.getElementById(id);

    /* =====================================================
       DATOS DE DEMOSTRACIÓN
    ===================================================== */

    const datos = {

        revisiones: [

            {
                id: "ACT-010",
                nombre: "Portada de Estudios Sociales",
                autor: "Sofía Castro",
                version: 2,
                tipo: "Imagen",
                diasRestantes: -1
            },

            {
                id: "ACT-009",
                nombre: "Video de fracciones",
                autor: "José Ramírez",
                version: 2,
                tipo: "Video",
                diasRestantes: 1
            },

            {
                id: "ACT-001",
                nombre: "Libro de Matemática",
                autor: "Ana Martínez",
                version: 3,
                tipo: "Documento",
                diasRestantes: 2
            },

            {
                id: "ACT-007",
                nombre: "Guía metodológica de Ciencias",
                autor: "María López",
                version: 2,
                tipo: "Documento",
                diasRestantes: 4
            },

            {
                id: "ACT-008",
                nombre: "Cuaderno de Lenguaje",
                autor: "Laura Gómez",
                version: 1,
                tipo: "Documento",
                diasRestantes: 6
            }

        ],

        observaciones: [

            {
                id: "OBS-001",
                activo: "Guía docente",
                autor: "Ana Martínez",
                cantidad: 2,
                estado: "Pendiente del autor"
            },

            {
                id: "OBS-002",
                activo: "Cuadernillo de Lenguaje",
                autor: "Laura Gómez",
                cantidad: 1,
                estado: "Pendiente del autor"
            }

        ],

        decisiones: [

            {
                activo: "Guía docente",
                accion: "Cambios solicitados",
                fecha: "Hoy",
                tipo: "warning"
            },

            {
                activo: "Cuadernillo de Lenguaje",
                accion: "Cambios solicitados",
                fecha: "Ayer",
                tipo: "warning"
            },

            {
                activo: "Portada Unidad 4",
                accion: "Versión aprobada",
                fecha: "Hace 2 días",
                tipo: "success"
            },

            {
                activo: "Afiche Día del Maestro",
                accion: "Versión rechazada",
                fecha: "Hace 4 días",
                tipo: "danger"
            }

        ],

        alertas: 1

    };


    /* =====================================================
       FUNCIONES AUXILIARES
    ===================================================== */

    function establecerTexto(id, valor) {

        const elemento = obtener(id);

        if (elemento) {
            elemento.textContent = valor;
        }

    }


    function escaparHTML(valor) {

        const elemento = document.createElement("div");

        elemento.textContent = String(valor ?? "");

        return elemento.innerHTML;

    }


    function obtenerSaludo() {

        const hora = new Date().getHours();

        if (hora >= 5 && hora < 12) {
            return "Buenos días";
        }

        if (hora >= 12 && hora < 18) {
            return "Buenas tardes";
        }

        return "Buenas noches";

    }


    function obtenerVencimiento(dias) {

        if (dias < 0) {

            return {
                texto: "Vencido",
                clase: "danger"
            };

        }

        if (dias === 0) {

            return {
                texto: "Vence hoy",
                clase: "danger"
            };

        }

        if (dias === 1) {

            return {
                texto: "Vence mañana",
                clase: "warning"
            };

        }

        return {
            texto: `En ${dias} días`,
            clase: ""
        };

    }


    /* =====================================================
       BIENVENIDA
    ===================================================== */

    function mostrarBienvenida() {

        establecerTexto(
            "revisorGreeting",
            `${obtenerSaludo()}, Carlos`
        );

        const fecha = new Intl.DateTimeFormat("es-SV", {

            day: "numeric",
            month: "long",
            year: "numeric"

        }).format(new Date());

        establecerTexto(
            "revisorCurrentDate",
            fecha
        );

    }


    /* =====================================================
       ESTADÍSTICAS
    ===================================================== */

    function mostrarEstadisticas() {

        const urgentes = datos.revisiones.filter(
            revision => revision.diasRestantes <= 0
        ).length;

        const pendientes = datos.observaciones.filter(
            observacion => observacion.estado === "Pendiente del autor"
        ).length;

        establecerTexto(
            "statReview",
            datos.revisiones.length
        );

        establecerTexto(
            "statUrgent",
            urgentes
        );

        establecerTexto(
            "statObservations",
            pendientes
        );

        establecerTexto(
            "statDecisions",
            datos.decisiones.length
        );

        establecerTexto(
            "priorityCount",
            datos.revisiones.length
        );

        const notificacion = obtener("notificationCount");

        if (notificacion) {

            notificacion.textContent = datos.alertas;

            notificacion.hidden = datos.alertas === 0;

        }

        /* Contadores del sidebar, si existen */

        const contadores = {

            cola: datos.revisiones.length,
            seguimiento: pendientes,
            urgentes: urgentes,
            alertas: datos.alertas

        };

        document.querySelectorAll(
            "[data-sidebar-count]"
        ).forEach(elemento => {

            const tipo = elemento.dataset.sidebarCount;

            if (Object.prototype.hasOwnProperty.call(contadores, tipo)) {

                elemento.textContent = contadores[tipo];

            }

        });

    }


    /* =====================================================
       REVISIONES ORDENADAS
    ===================================================== */

    function obtenerRevisiones() {

        return [...datos.revisiones].sort(
            (a, b) => a.diasRestantes - b.diasRestantes
        );

    }


    /* =====================================================
       REVISIÓN PRIORITARIA
    ===================================================== */

    function mostrarPrioridad() {

        const revisiones = obtenerRevisiones();

        if (!revisiones.length) {

            establecerTexto(
                "priorityTitle",
                "No hay revisiones pendientes"
            );

            establecerTexto(
                "priorityDescription",
                "Todas las revisiones asignadas están al día."
            );

            return;

        }

        const revision = revisiones[0];

        const vencimiento = obtenerVencimiento(
            revision.diasRestantes
        );

        establecerTexto(
            "priorityTitle",
            revision.nombre
        );

        establecerTexto(
            "priorityDescription",
            `Versión ${revision.version} · ${revision.tipo} · ` +
            `${revision.autor} · ${vencimiento.texto}`
        );

    }


    /* =====================================================
       LISTADO DE REVISIONES
    ===================================================== */

    function mostrarRevisiones() {

        const contenedor = obtener("priorityList");

        if (!contenedor) return;

        const revisiones = obtenerRevisiones().slice(0, 4);

        if (!revisiones.length) {

            contenedor.innerHTML = `
                <div class="revisor-empty">
                    No hay activos pendientes de revisión.
                </div>
            `;

            return;

        }

        contenedor.innerHTML = revisiones.map(revision => {

            const vencimiento = obtenerVencimiento(
                revision.diasRestantes
            );

            return `

                <div class="revisor-list-item">

                    <span class="revisor-item-indicator"></span>

                    <div class="revisor-item-content">

                        <strong>
                            ${escaparHTML(revision.nombre)}
                        </strong>

                        <span>
                            Versión ${revision.version}
                            · ${escaparHTML(revision.autor)}
                        </span>

                    </div>

                    <span class="revisor-item-badge ${vencimiento.clase}">
                        ${escaparHTML(vencimiento.texto)}
                    </span>

                    <a
                        href="aprobacionRevisor.html"
                        class="revisor-item-link"
                    >
                        Revisar
                    </a>

                </div>

            `;

        }).join("");

    }


    /* =====================================================
       OBSERVACIONES
    ===================================================== */

    function mostrarObservaciones() {

        const contenedor = obtener("observationList");

        if (!contenedor) return;

        if (!datos.observaciones.length) {

            contenedor.innerHTML = `
                <div class="revisor-empty">
                    No hay observaciones pendientes.
                </div>
            `;

            return;

        }

        contenedor.innerHTML = datos.observaciones.map(item => `

            <div class="revisor-list-item">

                <span class="revisor-item-indicator warning"></span>

                <div class="revisor-item-content">

                    <strong>
                        ${escaparHTML(item.activo)}
                    </strong>

                    <span>
                        ${escaparHTML(item.autor)}
                        · ${item.cantidad} observación(es)
                    </span>

                </div>

                <span class="revisor-item-badge warning">
                    Pendiente
                </span>

                <a
                    href="observacionesRevisor.html"
                    class="revisor-item-link"
                >
                    Ver
                </a>

            </div>

        `).join("");

    }


    /* =====================================================
       ACTIVIDAD RECIENTE
    ===================================================== */

    function mostrarActividad() {

        const contenedor = obtener("activityList");

        if (!contenedor) return;

        if (!datos.decisiones.length) {

            contenedor.innerHTML = `
                <div class="revisor-empty">
                    No hay actividad reciente.
                </div>
            `;

            return;

        }

        contenedor.innerHTML = datos.decisiones.map(item => `

            <div class="revisor-list-item">

                <span class="revisor-item-indicator ${item.tipo}"></span>

                <div class="revisor-item-content">

                    <strong>
                        ${escaparHTML(item.accion)}
                    </strong>

                    <span>
                        ${escaparHTML(item.activo)}
                        · ${escaparHTML(item.fecha)}
                    </span>

                </div>

                <a
                    href="auditoriaRevisor.html"
                    class="revisor-item-link"
                >
                    Detalles
                </a>

            </div>

        `).join("");

    }


    /* =====================================================
       SIDEBAR Y MENÚ RESPONSIVE
    ===================================================== */

    function configurarSidebar() {

        const sidebar = obtener("sidebar");
        const overlay = obtener("mobileOverlay");
        const botonMenu = obtener("menuButton");

        if (!sidebar) return;

        /* Marcar Inicio como página activa */

        document.querySelectorAll(
            "#sidebar .nav-item"
        ).forEach(enlace => {

            const destino = (
                enlace.getAttribute("href") || ""
            ).split("?")[0].split("#")[0].split("/").pop();

            const pagina = enlace.dataset.page || "";

            const activo =
                destino === "dashboardRevisor.html" ||
                pagina === "dashboardRevisor" ||
                pagina === "dashboardRevisor.html";

            enlace.classList.toggle("active", activo);

            if (activo) {

                enlace.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                enlace.removeAttribute("aria-current");

            }

        });

        /* Menú móvil */

        if (botonMenu) {

            botonMenu.addEventListener("click", () => {

                const abierto = sidebar.classList.toggle("open");

                if (overlay) {
                    overlay.classList.toggle("active", abierto);
                }

                botonMenu.setAttribute(
                    "aria-expanded",
                    String(abierto)
                );

            });

        }

        if (overlay) {

            overlay.addEventListener("click", () => {

                sidebar.classList.remove("open");
                overlay.classList.remove("active");

                if (botonMenu) {

                    botonMenu.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });

        }

    }


    /* =====================================================
       EJECUCIÓN
    ===================================================== */

    mostrarBienvenida();

    mostrarEstadisticas();

    mostrarPrioridad();

    mostrarRevisiones();

    mostrarObservaciones();

    mostrarActividad();

    configurarSidebar();

}