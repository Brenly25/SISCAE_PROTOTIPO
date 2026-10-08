
/* =========================================================
   SISCAE - DASHBOARD REVISOR
   JavaScript completo
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       CARGAR SIDEBAR
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
        console.error("Error al cargar el sidebar:", error);
    }

    initDashboardRevisor();

});


function initDashboardRevisor() {

    const $ = id => document.getElementById(id);

    /* =====================================================
       DATOS DE DEMOSTRACIÓN
    ===================================================== */

    const data = {

        revisiones: [
            {
                id: "ACT-010",
                nombre: "Portada Guía de Estudios Sociales",
                tipo: "Imagen",
                autor: "Sofía Castro",
                version: 2,
                estado: "En revisión",
                diasRestantes: -1
            },
            {
                id: "ACT-009",
                nombre: "Video: Fracciones en la vida diaria",
                tipo: "Multimedia",
                autor: "José Ramírez",
                version: 2,
                estado: "En revisión",
                diasRestantes: 1
            },
            {
                id: "ACT-001",
                nombre: "Libro de Matemática",
                tipo: "Libro",
                autor: "Ana Martínez",
                version: 3,
                estado: "En revisión",
                diasRestantes: 2
            },
            {
                id: "ACT-007",
                nombre: "Guía metodológica de Ciencias",
                tipo: "Documento",
                autor: "María López",
                version: 2,
                estado: "En revisión",
                diasRestantes: 4
            },
            {
                id: "ACT-008",
                nombre: "Cuaderno de actividades de Lenguaje",
                tipo: "Documento",
                autor: "Laura Gómez",
                version: 1,
                estado: "En revisión",
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
                id: "REV-001",
                activo: "Guía docente",
                accion: "Cambios solicitados",
                fecha: "Hoy",
                tipo: "warning"
            },
            {
                id: "REV-002",
                activo: "Cuadernillo de Lenguaje",
                accion: "Cambios solicitados",
                fecha: "Ayer",
                tipo: "warning"
            },
            {
                id: "REV-003",
                activo: "Portada Unidad 4",
                accion: "Versión aprobada",
                fecha: "Hace 2 días",
                tipo: "success"
            },
            {
                id: "REV-004",
                activo: "Afiche Día del Maestro",
                accion: "Versión rechazada",
                fecha: "Hace 4 días",
                tipo: "danger"
            }
        ],

        alertas: [
            {
                id: "ALT-001",
                leida: false
            }
        ]

    };

    /* =====================================================
       UTILIDADES
    ===================================================== */

    function escapeHTML(value) {
        const div = document.createElement("div");
        div.textContent = String(value ?? "");
        return div.innerHTML;
    }

    function setText(id, value) {
        const element = $(id);

        if (element) {
            element.textContent = value;
        }
    }

    function getGreeting() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Buenos días";
        }

        if (hour >= 12 && hour < 18) {
            return "Buenas tardes";
        }

        return "Buenas noches";
    }

    function getDueLabel(days) {
        if (days < 0) {
            return {
                texto: `Vencido hace ${Math.abs(days)} día(s)`,
                clase: "urgent"
            };
        }

        if (days === 0) {
            return {
                texto: "Vence hoy",
                clase: "urgent"
            };
        }

        if (days === 1) {
            return {
                texto: "Vence mañana",
                clase: "pending"
            };
        }

        return {
            texto: `En ${days} días`,
            clase: ""
        };
    }

    function iconSVG(name) {

        const icons = {

            file: `
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path d="M14 2v6h6M8 13h8M8 17h5"></path>
            `,

            comment: `
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            `,

            check: `
                <circle cx="12" cy="12" r="9"></circle>
                <path d="m8 12 3 3 5-6"></path>
            `,

            reject: `
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M9 9l6 6M15 9l-6 6"></path>
            `,

            clock: `
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
            `
        };

        return `
            <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                ${icons[name] || icons.file}
            </svg>
        `;
    }

    /* =====================================================
       ENCABEZADO
    ===================================================== */

    function renderWelcome() {

        setText(
            "greeting",
            `${getGreeting()}, Carlos`
        );

        setText(
            "currentDate",
            new Intl.DateTimeFormat("es-SV", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date())
        );
    }

    /* =====================================================
       ESTADÍSTICAS
    ===================================================== */

    function getStats() {

        const revisiones = data.revisiones.filter(
            item => item.estado === "En revisión"
        );

        const urgentes = revisiones.filter(
            item => item.diasRestantes <= 0
        );

        const observaciones = data.observaciones.filter(
            item => item.estado === "Pendiente del autor"
        );

        const alertas = data.alertas.filter(
            item => !item.leida
        );

        return {
            revisiones: revisiones.length,
            urgentes: urgentes.length,
            observaciones: observaciones.length,
            decisiones: data.decisiones.length,
            alertas: alertas.length
        };
    }

    function renderStats() {

        const stats = getStats();

        setText("statReview", stats.revisiones);
        setText("statUrgent", stats.urgentes);
        setText("statObservations", stats.observaciones);
        setText("statDecisions", stats.decisiones);
        setText("priorityCount", stats.revisiones);

        const notification = $("notificationCount");

        if (notification) {
            notification.textContent = stats.alertas;
            notification.hidden = stats.alertas === 0;
        }

        const counts = {
            cola: stats.revisiones,
            seguimiento: stats.observaciones,
            urgentes: stats.alertas,
            alertas: stats.alertas
        };

        document
            .querySelectorAll("[data-sidebar-count]")
            .forEach(element => {

                const key = element.dataset.sidebarCount;
                const count = counts[key] ?? 0;

                element.textContent = count;
                element.dataset.empty = String(count === 0);
            });
    }

    /* =====================================================
       REVISIONES ORDENADAS
    ===================================================== */

    function getSortedReviews() {

        return data.revisiones
            .filter(item => item.estado === "En revisión")
            .sort((a, b) => a.diasRestantes - b.diasRestantes);
    }

    /* =====================================================
       BANNER PRIORITARIO
    ===================================================== */

    function renderPriorityBanner() {

        const next = getSortedReviews()[0];

        if (!next) {
            setText("priorityTitle", "No hay revisiones pendientes");
            setText(
                "priorityDescription",
                "Las nuevas versiones aparecerán aquí."
            );
            return;
        }

        const due = getDueLabel(next.diasRestantes);

        setText("priorityTitle", next.nombre);

        setText(
            "priorityDescription",
            `v${next.version} · ${next.tipo} · ${next.autor} · ${due.texto}`
        );
    }

    /* =====================================================
       REVISIONES PENDIENTES
    ===================================================== */

    function renderPriorityList() {

        const container = $("priorityList");

        if (!container) return;

        const reviews = getSortedReviews().slice(0, 4);

        if (!reviews.length) {
            container.innerHTML = `
                <div class="empty-state">
                    No hay activos pendientes de revisión.
                </div>
            `;
            return;
        }

        container.innerHTML = reviews.map(item => {

            const due = getDueLabel(item.diasRestantes);

            return `
                <div class="dashboard-row">

                    <div class="row-icon">
                        ${iconSVG("file")}
                    </div>

                    <div class="row-content">
                        <strong>${escapeHTML(item.nombre)}</strong>
                        <span>
                            v${item.version} · ${escapeHTML(item.autor)}
                        </span>
                    </div>

                    <span class="row-badge ${due.clase}">
                        ${escapeHTML(due.texto)}
                    </span>

                    <a
                        href="aprobacionRevisor.html"
                        class="row-link"
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

    function renderObservations() {

        const container = $("observationList");

        if (!container) return;

        const observations = data.observaciones.filter(
            item => item.estado === "Pendiente del autor"
        );

        if (!observations.length) {
            container.innerHTML = `
                <div class="empty-state">
                    No hay observaciones pendientes.
                </div>
            `;
            return;
        }

        container.innerHTML = observations.slice(0, 4).map(item => `
            <div class="dashboard-row">

                <div class="row-icon warning">
                    ${iconSVG("comment")}
                </div>

                <div class="row-content">
                    <strong>${escapeHTML(item.activo)}</strong>
                    <span>
                        ${escapeHTML(item.autor)} ·
                        ${item.cantidad} observación(es)
                    </span>
                </div>

                <span class="row-badge pending">
                    Pendiente
                </span>

                <a
                    href="observacionesRevisor.html"
                    class="row-link"
                >
                    Ver
                </a>

            </div>
        `).join("");
    }

    /* =====================================================
       ACTIVIDAD RECIENTE
    ===================================================== */

    function renderActivity() {

        const container = $("activityList");

        if (!container) return;

        if (!data.decisiones.length) {
            container.innerHTML = `
                <div class="empty-state">
                    No hay actividad registrada.
                </div>
            `;
            return;
        }

        container.innerHTML = data.decisiones.slice(0, 4).map(item => {

            const icon = item.tipo === "success"
                ? "check"
                : item.tipo === "danger"
                    ? "reject"
                    : "comment";

            return `
                <div class="dashboard-row">

                    <div class="row-icon ${escapeHTML(item.tipo)}">
                        ${iconSVG(icon)}
                    </div>

                    <div class="row-content">
                        <strong>${escapeHTML(item.accion)}</strong>
                        <span>
                            ${escapeHTML(item.activo)} ·
                            ${escapeHTML(item.fecha)}
                        </span>
                    </div>

                    <a
                        href="auditoriaRevisor.html"
                        class="row-link"
                    >
                        Detalles
                    </a>

                </div>
            `;

        }).join("");
    }

    /* =====================================================
       SIDEBAR
    ===================================================== */

    function initSidebar() {

        const sidebar = $("sidebar");
        const overlay = $("mobileOverlay");
        const menuButton = $("menuButton");

        if (!sidebar) return;

        document.querySelectorAll("#sidebar .nav-item").forEach(link => {

            const page = (
                link.dataset.page ||
                link.getAttribute("href") ||
                ""
            ).split("#")[0].split("/").pop();

            const active = page === "dashboardRevisor.html";

            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        function setMenuOpen(open) {

            sidebar.classList.toggle("open", open);
            overlay?.classList.toggle("active", open);

            menuButton?.setAttribute(
                "aria-expanded",
                String(open)
            );
        }

        if (menuButton) {
            menuButton.onclick = () => {
                setMenuOpen(!sidebar.classList.contains("open"));
            };
        }

        if (overlay) {
            overlay.onclick = () => setMenuOpen(false);
        }

        sidebar.querySelectorAll(".nav-item").forEach(link => {
            link.addEventListener("click", () => setMenuOpen(false));
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 950) {
                setMenuOpen(false);
            }
        });
    }

    /* =====================================================
       PERFIL
    ===================================================== */

    function initProfile() {

        const profile = $("profile");
        const button = $("profileButton");

        if (!profile || !button) return;

        button.addEventListener("click", event => {

            event.stopPropagation();

            const open = profile.classList.toggle("open");

            button.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", event => {

            if (!profile.contains(event.target)) {
                profile.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* =====================================================
       CIERRE DE SESIÓN
    ===================================================== */

    function initLogout() {

        const modal = $("logoutModal");
        const sidebarLogout = $("sidebarLogout");
        const profileLogout = $("profileLogout");

        if (!modal) return;

        function openModal() {

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");

            document.body.classList.add("modal-locked");

            $("profile")?.classList.remove("open");

            $("confirmLogout")?.focus();
        }

        function closeModal() {

            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");

            document.body.classList.remove("modal-locked");
        }

        function logout() {

            window.location.href = new URL(
                "interfaces.html",
                window.location.href
            ).href;
        }

        /*
           Se usa captura para que el modal tenga prioridad
           frente al manejador de components.js.
        */

        document.addEventListener("click", event => {

            const trigger = event.target.closest(
                "#sidebarLogout, #profileLogout"
            );

            if (trigger) {
                event.preventDefault();
                event.stopImmediatePropagation();
                openModal();
                return;
            }

            if (event.target.closest("#confirmLogout")) {
                event.preventDefault();
                logout();
                return;
            }

            if (event.target.closest("[data-close-logout]")) {
                event.preventDefault();
                closeModal();
            }

        }, true);

        if (sidebarLogout) {
            sidebarLogout.onclick = null;
        }

        if (profileLogout) {
            profileLogout.onclick = null;
        }

        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {
                closeModal();
            }
        });
    }

    /* =====================================================
       EJECUTAR
    ===================================================== */

    renderWelcome();
    renderStats();
    renderPriorityBanner();
    renderPriorityList();
    renderObservations();
    renderActivity();

    initSidebar();
    initProfile();
    initLogout();

}
