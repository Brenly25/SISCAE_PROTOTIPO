document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS
    ===================================================== */

    const alerts = [
        {
            id: "ALT-001",
            type: "security",
            title: "Acceso institucional próximo a vencer",
            description:
                "El acceso asignado a un colaborador externo está próximo a alcanzar su fecha de vencimiento.",
            resource: "Proyecto Ciencias Naturales",
            reference: "Acceso temporal · Carlos Hernández",
            priority: "high",
            status: "pending",
            date: "2026-10-01",
            time: "8:35 a. m.",
            note:
                "Revise la vigencia del acceso y determine si corresponde mantenerlo activo o permitir su vencimiento."
        },
        {
            id: "ALT-002",
            type: "integrity",
            title: "Nueva versión pendiente de verificación",
            description:
                "Se registró una nueva versión de un activo editorial y su referencia de integridad requiere seguimiento.",
            resource: "Libro de Ciencias Naturales",
            reference: "Versión 4",
            priority: "medium",
            status: "pending",
            date: "2026-10-01",
            time: "8:12 a. m.",
            note:
                "Consulte la información de la versión registrada antes de continuar con el flujo editorial."
        },
        {
            id: "ALT-003",
            type: "review",
            title: "Contenido pendiente de revisión",
            description:
                "Un recurso editorial continúa pendiente dentro de la etapa de revisión.",
            resource: "Guía metodológica de Matemática",
            reference: "Versión 2",
            priority: "medium",
            status: "pending",
            date: "2026-10-01",
            time: "7:48 a. m.",
            note:
                "La alerta permanecerá visible hasta que el evento sea revisado dentro del prototipo."
        },
        {
            id: "ALT-004",
            type: "publication",
            title: "Activo editorial publicado",
            description:
                "Se registró la publicación de una versión aprobada del recurso editorial.",
            resource: "Cuaderno de trabajo de Lenguaje",
            reference: "Versión 3",
            priority: "low",
            status: "reviewed",
            date: "2026-09-30",
            time: "3:20 p. m.",
            note:
                "La publicación fue registrada correctamente y esta notificación ya fue revisada."
        },
        {
            id: "ALT-005",
            type: "access",
            title: "Inicio de sesión registrado",
            description:
                "Se registró un nuevo acceso institucional al sistema.",
            resource: "SISCAE",
            reference: "Sesión institucional",
            priority: "low",
            status: "reviewed",
            date: "2026-09-30",
            time: "1:45 p. m.",
            note:
                "El acceso fue registrado como parte de la trazabilidad del sistema."
        },
        {
            id: "ALT-006",
            type: "security",
            title: "Permisos de usuario actualizados",
            description:
                "Se modificó la configuración de permisos asociada a un perfil del sistema.",
            resource: "Rol de Revisor",
            reference: "Configuración de permisos",
            priority: "low",
            status: "reviewed",
            date: "2026-09-29",
            time: "11:18 a. m.",
            note:
                "La modificación fue registrada en el historial de actividad del prototipo."
        }
    ];


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const $ = id => document.getElementById(id);

    let selectedAlertId = null;

    const typeNames = {
        security: "Seguridad",
        access: "Accesos",
        integrity: "Integridad",
        publication: "Publicación",
        review: "Revisión"
    };

    const priorityNames = {
        high: "Prioridad alta",
        medium: "Prioridad media",
        low: "Informativa"
    };

    const statusNames = {
        pending: "Pendiente",
        reviewed: "Revisada"
    };

    const icons = {
        security: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
            </svg>
        `,

        access: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <path d="m10 17 5-5-5-5M15 12H3"></path>
            </svg>
        `,

        integrity: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="m8.5 12 2.3 2.3 4.8-5"></path>
            </svg>
        `,

        publication: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 16V4"></path>
                <path d="m7 9 5-5 5 5"></path>
                <path d="M5 14v5h14v-5"></path>
            </svg>
        `,

        review: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
        `
    };


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function normalize(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function formatDate(value) {
        if (!value) return "";

        const [year, month, day] = value.split("-");

        return `${day}/${month}/${year}`;
    }

    function updateBodyLock() {
        const modalOpen = document.querySelector(".modal.active");

        const drawerOpen =
            $("alertDrawer").classList.contains("active");

        const sidebarOpen =
            document.querySelector("#sidebar.open");

        document.body.classList.toggle(
            "locked",
            Boolean(modalOpen || drawerOpen || sidebarOpen)
        );
    }


    /* =====================================================
       CONTADORES
    ===================================================== */

    function updateCounters() {
        const pending = alerts.filter(
            alert => alert.status === "pending"
        ).length;

        const high = alerts.filter(
            alert =>
                alert.status === "pending" &&
                alert.priority === "high"
        ).length;

        const reviewed = alerts.filter(
            alert => alert.status === "reviewed"
        ).length;

        $("pendingCount").textContent = pending;
        $("highCount").textContent = high;
        $("reviewedCount").textContent = reviewed;
        $("notificationCount").textContent = pending;

        $("notificationCount").hidden = pending === 0;

        $("markAllReviewed").disabled = pending === 0;
    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function getFilteredAlerts() {
        const status = $("statusFilter").value;
        const priority = $("priorityFilter").value;
        const type = $("typeFilter").value;

        const search = normalize(
            $("searchFilter").value.trim()
        );

        return alerts.filter(alert => {

            if (
                status !== "all" &&
                alert.status !== status
            ) {
                return false;
            }

            if (
                priority !== "all" &&
                alert.priority !== priority
            ) {
                return false;
            }

            if (
                type !== "all" &&
                alert.type !== type
            ) {
                return false;
            }

            if (search) {
                const searchable = normalize([
                    alert.id,
                    alert.title,
                    alert.description,
                    alert.resource,
                    alert.reference,
                    typeNames[alert.type],
                    priorityNames[alert.priority],
                    statusNames[alert.status]
                ].join(" "));

                if (!searchable.includes(search)) {
                    return false;
                }
            }

            return true;
        });
    }


    /* =====================================================
       LISTADO
    ===================================================== */

    function renderAlerts() {
        const filtered = getFilteredAlerts();

        $("visibleCount").textContent = filtered.length;

        $("alertsList").innerHTML = filtered.map(alert => `
            <article class="alert-item ${alert.status}">

                <div class="alert-icon ${alert.priority}">
                    ${icons[alert.type]}
                </div>


                <div class="alert-main">

                    <div class="alert-meta">

                        <span class="alert-category">
                            ${escapeHtml(typeNames[alert.type])}
                        </span>

                        <span class="alert-date">
                            ${formatDate(alert.date)}
                            ·
                            ${escapeHtml(alert.time)}
                        </span>

                    </div>


                    <h3>
                        ${escapeHtml(alert.title)}
                    </h3>


                    <p>
                        ${escapeHtml(alert.description)}
                    </p>


                    <span class="alert-resource">
                        ${escapeHtml(alert.resource)}
                    </span>

                </div>


                <div class="alert-actions">

                    <div class="alert-actions-row">

                        <span class="priority-badge ${alert.priority}">
                            ${escapeHtml(
                                priorityNames[alert.priority]
                            )}
                        </span>

                        <span class="status-badge ${alert.status}">
                            ${escapeHtml(
                                statusNames[alert.status]
                            )}
                        </span>

                    </div>


                    <button
                        class="view-alert"
                        type="button"
                        data-alert-id="${escapeHtml(alert.id)}"
                    >
                        Ver detalle
                    </button>

                </div>

            </article>
        `).join("");


        $("emptyState").hidden =
            filtered.length > 0;

        $("alertsList").hidden =
            filtered.length === 0;


        updateResultsText(filtered.length);
    }


    function updateResultsText(count) {
        const status = $("statusFilter").value;

        let title = "Todas las alertas";

        if (status === "pending") {
            title = "Alertas pendientes";
        }

        if (status === "reviewed") {
            title = "Alertas revisadas";
        }

        $("resultsTitle").textContent = title;

        $("resultsDescription").textContent =
            count === 1
                ? "Se encontró 1 alerta con los criterios seleccionados."
                : `Se encontraron ${count} alertas con los criterios seleccionados.`;
    }


    function refresh() {
        updateCounters();
        renderAlerts();
    }


    [
        "statusFilter",
        "priorityFilter",
        "typeFilter"
    ].forEach(id => {
        $(id).addEventListener(
            "change",
            renderAlerts
        );
    });

    $("searchFilter").addEventListener(
        "input",
        renderAlerts
    );


    $("clearFilters").addEventListener("click", () => {

        $("statusFilter").value = "all";
        $("priorityFilter").value = "all";
        $("typeFilter").value = "all";
        $("searchFilter").value = "";

        renderAlerts();
    });


    /* =====================================================
       DETALLE
    ===================================================== */

    function openDetail(id) {
        const alert = alerts.find(
            item => item.id === id
        );

        if (!alert) return;

        selectedAlertId = id;

        $("detailType").textContent =
            typeNames[alert.type];

        $("detailTitle").textContent =
            alert.title;

        $("detailDescription").textContent =
            alert.description;

        $("detailId").textContent =
            alert.id;

        $("detailDate").textContent =
            `${formatDate(alert.date)} · ${alert.time}`;

        $("detailCategory").textContent =
            typeNames[alert.type];

        $("detailResource").textContent =
            alert.resource;

        $("detailReference").textContent =
            alert.reference;

        $("detailNote").textContent =
            alert.note;


        $("detailPriority").className =
            `priority-badge ${alert.priority}`;

        $("detailPriority").textContent =
            priorityNames[alert.priority];


        $("detailStatus").className =
            `status-badge ${alert.status}`;

        $("detailStatus").textContent =
            statusNames[alert.status];


        if (alert.status === "reviewed") {
            $("reviewAlert").disabled = true;
            $("reviewAlert").textContent = "Alerta revisada";
        } else {
            $("reviewAlert").disabled = false;

            $("reviewAlert").innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 4 4L19 6"></path>
                </svg>

                Marcar como revisada
            `;
        }


        $("alertDrawer").classList.add("active");
        $("drawerOverlay").classList.add("active");

        $("alertDrawer").setAttribute(
            "aria-hidden",
            "false"
        );

        updateBodyLock();
    }


    function closeDetail() {
        selectedAlertId = null;

        $("alertDrawer").classList.remove("active");
        $("drawerOverlay").classList.remove("active");

        $("alertDrawer").setAttribute(
            "aria-hidden",
            "true"
        );

        updateBodyLock();
    }


    $("alertsList").addEventListener(
        "click",
        event => {

            const button = event.target.closest(
                "[data-alert-id]"
            );

            if (!button) return;

            openDetail(
                button.dataset.alertId
            );
        }
    );


    $("closeDetail").addEventListener(
        "click",
        closeDetail
    );

    $("closeDetailButton").addEventListener(
        "click",
        closeDetail
    );

    $("drawerOverlay").addEventListener(
        "click",
        closeDetail
    );


    /* =====================================================
       MARCAR UNA COMO REVISADA
    ===================================================== */

    $("reviewAlert").addEventListener(
        "click",
        () => {

            const alert = alerts.find(
                item => item.id === selectedAlertId
            );

            if (
                !alert ||
                alert.status === "reviewed"
            ) {
                return;
            }

            alert.status = "reviewed";

            refresh();
            openDetail(alert.id);
        }
    );


    /* =====================================================
       MARCAR TODAS
    ===================================================== */

    function openReviewAllModal() {
        const pending = alerts.some(
            alert => alert.status === "pending"
        );

        if (!pending) return;

        $("reviewAllModal").classList.add("active");

        $("reviewAllModal").setAttribute(
            "aria-hidden",
            "false"
        );

        updateBodyLock();
    }


    function closeReviewAllModal() {
        $("reviewAllModal").classList.remove("active");

        $("reviewAllModal").setAttribute(
            "aria-hidden",
            "true"
        );

        updateBodyLock();
    }


    $("markAllReviewed").addEventListener(
        "click",
        openReviewAllModal
    );


    document
        .querySelectorAll("[data-close-review-all]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeReviewAllModal
            );

        });


    $("confirmReviewAll").addEventListener(
        "click",
        () => {

            alerts.forEach(alert => {

                if (alert.status === "pending") {
                    alert.status = "reviewed";
                }

            });

            closeReviewAllModal();
            closeDetail();

            refresh();
        }
    );


    /* =====================================================
       NOTIFICACIÓN
    ===================================================== */

    $("notificationButton").addEventListener(
        "click",
        () => {

            $("statusFilter").value = "pending";
            $("priorityFilter").value = "all";
            $("typeFilter").value = "all";
            $("searchFilter").value = "";

            renderAlerts();

            document
                .querySelector(".alerts-panel")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    );


    /* =====================================================
       PERFIL
    ===================================================== */

    $("profileButton").addEventListener(
        "click",
        event => {

            event.stopPropagation();

            $("profile").classList.toggle("open");
        }
    );


    document.addEventListener(
        "click",
        event => {

            if (!$("profile").contains(event.target)) {
                $("profile").classList.remove("open");
            }
        }
    );


    /* =====================================================
       CERRAR SESIÓN
    ===================================================== */

    function openLogout() {
        $("profile").classList.remove("open");

        $("logoutModal").classList.add("active");

        $("logoutModal").setAttribute(
            "aria-hidden",
            "false"
        );

        updateBodyLock();
    }


    function closeLogout() {
        $("logoutModal").classList.remove("active");

        $("logoutModal").setAttribute(
            "aria-hidden",
            "true"
        );

        updateBodyLock();
    }


    $("profileLogout").addEventListener(
        "click",
        openLogout
    );


    /*
       El sidebar se carga dinámicamente mediante
       components.js, por eso usamos delegación.
    */

    document.addEventListener(
        "click",
        event => {

            const logout =
                event.target.closest("#sidebarLogout");

            if (!logout) return;

            event.preventDefault();

            openLogout();
        }
    );


    document
        .querySelectorAll("[data-close-logout]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeLogout
            );

        });


    $("confirmLogout").addEventListener(
        "click",
        () => {

            window.location.href = "login.html";
        }
    );


    /* =====================================================
       TECLA ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                $("reviewAllModal")
                    .classList
                    .contains("active")
            ) {
                closeReviewAllModal();
                return;
            }

            if (
                $("logoutModal")
                    .classList
                    .contains("active")
            ) {
                closeLogout();
                return;
            }

            if (
                $("alertDrawer")
                    .classList
                    .contains("active")
            ) {
                closeDetail();
                return;
            }

            $("profile").classList.remove("open");
        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    refresh();

});