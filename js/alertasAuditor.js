/* =========================================================
   SISCAE
   ALERTAS - PERFIL AUDITOR
   alertasAuditor.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. DATOS DE ALERTAS
    ====================================================== */

    const alertsData = [
        {
            id: "ALT-2026-031",
            title: "Versión modificada después de revisión",
            description:
                "Se detectó la versión v3.3 después de que la versión v3.2 había sido revisada. La nueva versión requiere verificación antes de continuar con el flujo editorial.",
            priority: "Alta",
            category: "Trazabilidad",
            status: "Pendiente",

            asset: "Libro Ciencias 7.º",
            assetCode: "ACT-2026-041",
            version: "v3.3",

            date: "07/10/2026",
            time: "08:45 a.m.",

            evidenceEvent: "Modificación de versión",
            user: "Ana Martínez",
            auditReference: "AUD-2026-0108",

            responsibleRole: "Revisor",
            requiredAction:
                "Verificar la nueva versión antes de continuar con el flujo editorial.",

            note: ""
        },

        {
            id: "ALT-2026-030",
            title: "Inconsistencia de integridad detectada",
            description:
                "La comprobación de integridad requiere verificación debido a una inconsistencia registrada sobre la versión v2.4 del activo.",
            priority: "Crítica",
            category: "Integridad",
            status: "Pendiente",

            asset: "Guía Docente Ciencias 8.º",
            assetCode: "ACT-2026-029",
            version: "v2.4",

            date: "07/10/2026",
            time: "08:11 a.m.",

            evidenceEvent: "Verificación de integridad SHA-256",
            user: "Sistema SISCAE",
            auditReference: "AUD-2026-0096",

            responsibleRole: "Administrador",
            requiredAction:
                "Comprobar la integridad del archivo y determinar el origen de la inconsistencia detectada.",

            note: ""
        },

        {
            id: "ALT-2026-029",
            title: "Acceso fuera del período autorizado",
            description:
                "Se registró un intento de acceso al activo después de finalizar el período de autorización asignado al usuario.",
            priority: "Alta",
            category: "Acceso",
            status: "Pendiente",

            asset: "Material Educativo Inglés 6.º",
            assetCode: "ACT-2026-021",
            version: "v1.6",

            date: "06/10/2026",
            time: "06:48 p.m.",

            evidenceEvent: "Intento de acceso fuera de vigencia",
            user: "Sofía Castillo",
            auditReference: "AUD-2026-0095",

            responsibleRole: "Administrador",
            requiredAction:
                "Verificar la vigencia de permisos y confirmar la revocación del acceso correspondiente.",

            note: ""
        },

        {
            id: "ALT-2026-028",
            title: "Contenido pendiente de revisión",
            description:
                "El activo posee una versión disponible que aún no registra evidencia de revisión dentro del flujo editorial.",
            priority: "Media",
            category: "Flujo editorial",
            status: "En seguimiento",

            asset: "Material Lenguaje 5.º",
            assetCode: "ACT-2026-036",
            version: "v4.0",

            date: "06/10/2026",
            time: "04:36 p.m.",

            evidenceEvent: "Ausencia de registro de revisión",
            user: "Ana Rodríguez",
            auditReference: "AUD-2026-0094",

            responsibleRole: "Revisor",
            requiredAction:
                "Realizar la revisión correspondiente y registrar la intervención dentro del flujo editorial.",

            note:
                "Se verificó que la versión continúa pendiente de revisión. Se mantiene seguimiento."
        },

        {
            id: "ALT-2026-027",
            title: "Permiso próximo a finalizar",
            description:
                "El acceso temporal asignado a un usuario del proyecto editorial se encuentra próximo a alcanzar su fecha de expiración.",
            priority: "Media",
            category: "Permisos",
            status: "En seguimiento",

            asset: "Proyecto Editorial Ciencias 2026",
            assetCode: "PRY-2026-006",
            version: "N/A",

            date: "06/10/2026",
            time: "02:15 p.m.",

            evidenceEvent: "Control de vigencia de acceso",
            user: "Administrador SISCAE",
            auditReference: "AUD-2026-0093",

            responsibleRole: "Administrador",
            requiredAction:
                "Confirmar si el acceso temporal debe renovarse o finalizar según la asignación del proyecto.",

            note:
                "Se notificó la proximidad del vencimiento para verificación administrativa."
        },

        {
            id: "ALT-2026-026",
            title: "Integridad de versión confirmada",
            description:
                "La verificación de integridad de la versión finalizó correctamente y el hash registrado coincide con la información almacenada.",
            priority: "Media",
            category: "Integridad",
            status: "Verificada",

            asset: "Guía Matemática 6.º",
            assetCode: "ACT-2026-038",
            version: "v2.1",

            date: "06/10/2026",
            time: "08:04 a.m.",

            evidenceEvent: "Verificación SHA-256",
            user: "Sistema SISCAE",
            auditReference: "AUD-2026-0105",

            responsibleRole: "Sistema",
            requiredAction:
                "No se requiere intervención adicional. La integridad de la versión fue confirmada.",

            note:
                "Se comprobó la evidencia registrada por SISCAE. Integridad confirmada."
        },

        {
            id: "ALT-2026-025",
            title: "Observación atendida en nueva versión",
            description:
                "Se comprobó que la observación registrada sobre el activo fue atendida mediante la carga de una versión posterior.",
            priority: "Media",
            category: "Flujo editorial",
            status: "Verificada",

            asset: "Libro Matemática 9.º",
            assetCode: "ACT-2026-025",
            version: "v3.5",

            date: "05/10/2026",
            time: "03:22 p.m.",

            evidenceEvent: "Carga posterior a observación",
            user: "Daniel Pérez",
            auditReference: "AUD-2026-0102",

            responsibleRole: "Autor / Editor",
            requiredAction:
                "No se requiere intervención adicional. La atención de la observación fue comprobada.",

            note:
                "La nueva versión contiene registro posterior a la observación. Evidencia verificada."
        },

        {
            id: "ALT-2026-024",
            title: "Permiso de acceso revocado correctamente",
            description:
                "Se verificó la finalización del acceso temporal de un usuario que ya no requiere intervención sobre el activo editorial.",
            priority: "Media",
            category: "Permisos",
            status: "Verificada",

            asset: "Video introductorio Ciencias",
            assetCode: "ACT-2026-015",
            version: "v1.3",

            date: "05/10/2026",
            time: "11:10 a.m.",

            evidenceEvent: "Revocación de permiso",
            user: "Administrador SISCAE",
            auditReference: "AUD-2026-0092",

            responsibleRole: "Administrador",
            requiredAction:
                "No se requiere intervención adicional. La revocación fue confirmada.",

            note:
                "Se verificó el registro de revocación y la finalización del acceso."
        }
    ];


    /* =====================================================
       2. REFERENCIAS DOM
    ====================================================== */

    const alertsList = document.getElementById("alertsList");
    const emptyState = document.getElementById("emptyState");

    const searchInput = document.getElementById("searchInput");
    const priorityFilter = document.getElementById("priorityFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");

    const resultsCounter = document.getElementById("resultsCounter");

    const activeAlerts = document.getElementById("activeAlerts");
    const highPriorityAlerts =
        document.getElementById("highPriorityAlerts");
    const trackingAlerts =
        document.getElementById("trackingAlerts");
    const verifiedAlerts =
        document.getElementById("verifiedAlerts");

    const notificationCount =
        document.getElementById("notificationCount");

    const drawerOverlay =
        document.getElementById("drawerOverlay");
    const alertDrawer =
        document.getElementById("alertDrawer");
    const closeDrawer =
        document.getElementById("closeDrawer");

    const drawerAlertId =
        document.getElementById("drawerAlertId");
    const drawerAlertTitle =
        document.getElementById("drawerAlertTitle");
    const drawerPriority =
        document.getElementById("drawerPriority");
    const drawerStatus =
        document.getElementById("drawerStatus");

    const drawerCategory =
        document.getElementById("drawerCategory");
    const drawerDescription =
        document.getElementById("drawerDescription");

    const drawerAsset =
        document.getElementById("drawerAsset");
    const drawerAssetCode =
        document.getElementById("drawerAssetCode");
    const drawerVersion =
        document.getElementById("drawerVersion");
    const drawerDate =
        document.getElementById("drawerDate");
    const drawerTime =
        document.getElementById("drawerTime");

    const drawerEvidenceEvent =
        document.getElementById("drawerEvidenceEvent");
    const drawerUser =
        document.getElementById("drawerUser");
    const drawerAuditReference =
        document.getElementById("drawerAuditReference");

    const drawerResponsibleRole =
        document.getElementById("drawerResponsibleRole");
    const drawerRequiredAction =
        document.getElementById("drawerRequiredAction");

    const trackingStatus =
        document.getElementById("trackingStatus");
    const trackingNote =
        document.getElementById("trackingNote");
    const noteCounter =
        document.getElementById("noteCounter");
    const saveTrackingButton =
        document.getElementById("saveTrackingButton");

    const viewTraceButton =
        document.getElementById("viewTraceButton");

    const trackingToast =
        document.getElementById("trackingToast");

    const profile =
        document.getElementById("profile");
    const profileButton =
        document.getElementById("profileButton");
    const profileLogout =
        document.getElementById("profileLogout");

    const notificationButton =
        document.getElementById("notificationButton");

    const logoutModal =
        document.getElementById("logoutModal");
    const confirmLogout =
        document.getElementById("confirmLogout");

    const closeLogoutButtons =
        document.querySelectorAll("[data-close-logout]");


    /* =====================================================
       3. ESTADO
    ====================================================== */

    let selectedAlertId = null;
    let toastTimer = null;


    /* =====================================================
       4. UTILIDADES
    ====================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function normalizeText(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    function getAlertById(id) {
        return alertsData.find(
            (alert) => alert.id === id
        );
    }


    /* =====================================================
       5. CLASES DE PRIORIDAD
    ====================================================== */

    function getPriorityClass(priority) {

        switch (priority) {

            case "Crítica":
                return "critical";

            case "Alta":
                return "high";

            default:
                return "medium";
        }
    }


    /* =====================================================
       6. CLASES DE ESTADO
    ====================================================== */

    function getStatusClass(status) {

        switch (status) {

            case "Pendiente":
                return "pending";

            case "En seguimiento":
                return "tracking";

            case "Verificada":
                return "verified";

            default:
                return "pending";
        }
    }


    /* =====================================================
       7. CLASES DE CATEGORÍA
    ====================================================== */

    function getCategoryClass(category) {

        switch (category) {

            case "Integridad":
                return "category-integrity";

            case "Acceso":
                return "category-access";

            case "Permisos":
                return "category-permissions";

            default:
                return "category-traceability";
        }
    }


    /* =====================================================
       8. ICONOS
    ====================================================== */

    function getAlertIcon(category) {

        if (category === "Integridad") {
            return `
                <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path>
                    <path d="M9 12h6"></path>
                    <path d="M12 9v6"></path>
                </svg>
            `;
        }

        if (category === "Acceso") {
            return `
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4 21a8 8 0 0 1 16 0"></path>
                    <path d="M18 8h4"></path>
                </svg>
            `;
        }

        if (category === "Permisos") {
            return `
                <svg viewBox="0 0 24 24">
                    <circle cx="8" cy="15" r="4"></circle>
                    <path d="m11 12 8-8"></path>
                    <path d="m15 4 2 2"></path>
                    <path d="m17 2 2 2"></path>
                </svg>
            `;
        }

        if (category === "Flujo editorial") {
            return `
                <svg viewBox="0 0 24 24">
                    <path d="M6 3v12"></path>
                    <path d="M18 9v12"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="6" r="3"></circle>
                    <path d="M9 18h6"></path>
                </svg>
            `;
        }

        return `
            <svg viewBox="0 0 24 24">
                <path d="M4 19V5"></path>
                <path d="M4 12h5"></path>
                <path d="M9 12V7h5"></path>
                <path d="M9 12v5h5"></path>
                <circle cx="16" cy="7" r="2"></circle>
                <circle cx="16" cy="17" r="2"></circle>
            </svg>
        `;
    }


    /* =====================================================
       9. CONTADORES
    ====================================================== */

    function updateSummary() {

        const active = alertsData.filter(
            (alert) => alert.status === "Pendiente"
        ).length;

        const highPriority = alertsData.filter(
            (alert) =>
                alert.status !== "Verificada" &&
                (
                    alert.priority === "Alta" ||
                    alert.priority === "Crítica"
                )
        ).length;

        const tracking = alertsData.filter(
            (alert) =>
                alert.status === "En seguimiento"
        ).length;

        const verified = alertsData.filter(
            (alert) =>
                alert.status === "Verificada"
        ).length;


        if (activeAlerts) {
            activeAlerts.textContent = active;
        }

        if (highPriorityAlerts) {
            highPriorityAlerts.textContent =
                highPriority;
        }

        if (trackingAlerts) {
            trackingAlerts.textContent = tracking;
        }

        if (verifiedAlerts) {
            verifiedAlerts.textContent = verified;
        }

        if (notificationCount) {
            notificationCount.textContent = active;
            notificationCount.hidden = active === 0;
        }
    }


    /* =====================================================
       10. FILTRADO
    ====================================================== */

    function getFilteredAlerts() {

        const query = normalizeText(
            searchInput?.value || ""
        );

        const priority =
            priorityFilter?.value || "all";

        const category =
            categoryFilter?.value || "all";

        const status =
            statusFilter?.value || "all";


        return alertsData.filter((alert) => {

            const searchable = normalizeText(`
                ${alert.id}
                ${alert.title}
                ${alert.description}
                ${alert.asset}
                ${alert.assetCode}
                ${alert.version}
                ${alert.category}
                ${alert.priority}
                ${alert.status}
                ${alert.user}
                ${alert.responsibleRole}
                ${alert.auditReference}
            `);

            const matchesSearch =
                !query ||
                searchable.includes(query);

            const matchesPriority =
                priority === "all" ||
                alert.priority === priority;

            const matchesCategory =
                category === "all" ||
                alert.category === category;

            const matchesStatus =
                status === "all" ||
                alert.status === status;

            return (
                matchesSearch &&
                matchesPriority &&
                matchesCategory &&
                matchesStatus
            );
        });
    }


    /* =====================================================
       11. CREAR TARJETA
    ====================================================== */

    function createAlertCard(alert) {

        const priorityClass =
            getPriorityClass(alert.priority);

        const statusClass =
            getStatusClass(alert.status);

        const categoryClass =
            getCategoryClass(alert.category);


        return `
            <article
                class="
                    alert-card
                    priority-${priorityClass}
                    ${categoryClass}
                "
                data-alert-id="${escapeHTML(alert.id)}"
            >

                <div class="alert-card-accent"></div>


                <div class="alert-card-main">

                    <div class="alert-card-top">

                        <div class="alert-card-identity">

                            <div class="alert-type-icon">
                                ${getAlertIcon(alert.category)}
                            </div>


                            <div class="alert-heading">

                                <span class="alert-code">
                                    ${escapeHTML(alert.id)}
                                </span>

                                <h3>
                                    ${escapeHTML(alert.title)}
                                </h3>

                                <p>
                                    ${escapeHTML(alert.description)}
                                </p>

                            </div>

                        </div>


                        <div class="alert-badges">

                            <span
                                class="
                                    priority-badge
                                    ${priorityClass}
                                "
                            >
                                ${escapeHTML(alert.priority)}
                            </span>

                            <span class="category-badge">
                                ${escapeHTML(alert.category)}
                            </span>

                            <span
                                class="
                                    status-badge
                                    ${statusClass}
                                "
                            >
                                ${escapeHTML(alert.status)}
                            </span>

                        </div>

                    </div>


                    <div class="alert-card-info">

                        <div class="alert-info-item">

                            <span>Activo relacionado</span>

                            <strong title="${escapeHTML(alert.asset)}">
                                ${escapeHTML(alert.asset)}
                            </strong>

                            <small>
                                ${escapeHTML(alert.assetCode)}
                                ·
                                ${escapeHTML(alert.version)}
                            </small>

                        </div>


                        <div class="alert-info-item">

                            <span>Detección</span>

                            <strong>
                                ${escapeHTML(alert.date)}
                            </strong>

                            <small>
                                ${escapeHTML(alert.time)}
                            </small>

                        </div>


                        <div class="alert-info-item">

                            <span>Intervención requerida</span>

                            <strong>
                                ${escapeHTML(alert.responsibleRole)}
                            </strong>

                            <small>
                                Rol responsable
                            </small>

                        </div>


                        <div class="alert-info-item">

                            <span>Referencia</span>

                            <strong>
                                ${escapeHTML(alert.auditReference)}
                            </strong>

                            <small>
                                Registro de auditoría
                            </small>

                        </div>

                    </div>

                </div>


                <div class="alert-card-action">

                    <button
                        class="manage-alert-button"
                        type="button"
                        data-open-alert="${escapeHTML(alert.id)}"
                    >

                        <svg viewBox="0 0 24 24">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
                            <circle cx="12" cy="12" r="2.5"></circle>
                        </svg>

                        ${
                            alert.status === "Verificada"
                                ? "Consultar"
                                : "Gestionar"
                        }

                    </button>

                </div>

            </article>
        `;
    }


    /* =====================================================
       12. RENDERIZAR ALERTAS
    ====================================================== */

    function renderAlerts() {

        if (!alertsList) {
            return;
        }

        const filteredAlerts =
            getFilteredAlerts();


        alertsList.innerHTML =
            filteredAlerts
                .map(createAlertCard)
                .join("");


        if (resultsCounter) {
            resultsCounter.textContent =
                filteredAlerts.length;
        }


        if (emptyState) {
            emptyState.hidden =
                filteredAlerts.length !== 0;
        }


        alertsList.hidden =
            filteredAlerts.length === 0;


        attachAlertButtons();
    }


    /* =====================================================
       13. BOTONES DE TARJETAS
    ====================================================== */

    function attachAlertButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-open-alert]"
            );

        buttons.forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.openAlert;

                    openAlertDrawer(id);
                }
            );
        });
    }


    /* =====================================================
       14. ACTUALIZAR ESTILO DEL DRAWER
    ====================================================== */

    function updateDrawerBadges(alert) {

        if (!drawerPriority || !drawerStatus) {
            return;
        }

        drawerPriority.className =
            "drawer-priority";

        drawerStatus.className =
            "drawer-status";


        if (alert.priority === "Crítica") {
            drawerPriority.classList.add(
                "priority-critical"
            );
        }

        if (alert.priority === "Media") {
            drawerPriority.classList.add(
                "priority-medium"
            );
        }


        if (alert.status === "En seguimiento") {
            drawerStatus.classList.add(
                "status-tracking"
            );
        }

        if (alert.status === "Verificada") {
            drawerStatus.classList.add(
                "status-verified"
            );
        }
    }


    /* =====================================================
       15. ABRIR DRAWER
    ====================================================== */

    function openAlertDrawer(id) {

        const alert = getAlertById(id);

        if (!alert) {
            return;
        }


        selectedAlertId = id;


        if (drawerAlertId) {
            drawerAlertId.textContent =
                alert.id;
        }

        if (drawerAlertTitle) {
            drawerAlertTitle.textContent =
                alert.title;
        }

        if (drawerPriority) {
            drawerPriority.textContent =
                alert.priority;
        }

        if (drawerStatus) {
            drawerStatus.textContent =
                alert.status;
        }

        updateDrawerBadges(alert);


        if (drawerCategory) {
            drawerCategory.textContent =
                alert.category;
        }

        if (drawerDescription) {
            drawerDescription.textContent =
                alert.description;
        }


        if (drawerAsset) {
            drawerAsset.textContent =
                alert.asset;
        }

        if (drawerAssetCode) {
            drawerAssetCode.textContent =
                alert.assetCode;
        }

        if (drawerVersion) {
            drawerVersion.textContent =
                alert.version;
        }

        if (drawerDate) {
            drawerDate.textContent =
                alert.date;
        }

        if (drawerTime) {
            drawerTime.textContent =
                alert.time;
        }


        if (drawerEvidenceEvent) {
            drawerEvidenceEvent.textContent =
                alert.evidenceEvent;
        }

        if (drawerUser) {
            drawerUser.textContent =
                alert.user;
        }

        if (drawerAuditReference) {
            drawerAuditReference.textContent =
                alert.auditReference;
        }


        if (drawerResponsibleRole) {
            drawerResponsibleRole.textContent =
                alert.responsibleRole;
        }

        if (drawerRequiredAction) {
            drawerRequiredAction.textContent =
                alert.requiredAction;
        }


        if (trackingStatus) {
            trackingStatus.value =
                alert.status;
        }

        if (trackingNote) {
            trackingNote.value =
                alert.note || "";
        }


        updateNoteCounter();


        if (alertDrawer) {
            alertDrawer.classList.add("active");
            alertDrawer.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        if (drawerOverlay) {
            drawerOverlay.classList.add("active");
        }

        document.body.classList.add("locked");
    }


    /* =====================================================
       16. CERRAR DRAWER
    ====================================================== */

    function closeAlertDrawer() {

        if (alertDrawer) {
            alertDrawer.classList.remove("active");
            alertDrawer.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        if (drawerOverlay) {
            drawerOverlay.classList.remove("active");
        }

        document.body.classList.remove("locked");

        selectedAlertId = null;
    }


    /* =====================================================
       17. CONTADOR DE NOTA
    ====================================================== */

    function updateNoteCounter() {

        if (!trackingNote || !noteCounter) {
            return;
        }

        const length =
            trackingNote.value.length;

        noteCounter.textContent =
            `${length}/500`;
    }


    /* =====================================================
       18. GUARDAR SEGUIMIENTO
    ====================================================== */

    function saveTracking() {

        if (!selectedAlertId) {
            return;
        }

        const alert =
            getAlertById(selectedAlertId);

        if (!alert) {
            return;
        }


        const newStatus =
            trackingStatus?.value ||
            alert.status;

        const newNote =
            trackingNote?.value.trim() || "";


        /*
         * Para pasar a seguimiento o verificada
         * se solicita evidencia escrita del Auditor.
         */
        if (
            newStatus !== "Pendiente" &&
            newNote.length < 10
        ) {
            if (trackingNote) {
                trackingNote.focus();
            }

            showToast(
                "Agregue una nota de seguimiento",
                "Describa brevemente la verificación realizada.",
                "warning"
            );

            return;
        }


        alert.status = newStatus;
        alert.note = newNote;


        if (drawerStatus) {
            drawerStatus.textContent =
                alert.status;
        }

        updateDrawerBadges(alert);

        updateSummary();
        renderAlerts();


        showToast(
            "Seguimiento registrado",
            "La información de control fue actualizada.",
            "success"
        );
    }


    /* =====================================================
       19. TOAST
    ====================================================== */

    function showToast(
        title,
        message,
        type = "success"
    ) {

        if (!trackingToast) {
            return;
        }


        const titleElement =
            trackingToast.querySelector("strong");

        const messageElement =
            trackingToast.querySelector(
                "div:last-child span"
            );

        const icon =
            trackingToast.querySelector(
                ".toast-icon"
            );


        if (titleElement) {
            titleElement.textContent = title;
        }

        if (messageElement) {
            messageElement.textContent = message;
        }


        if (icon) {

            if (type === "warning") {
                icon.style.background =
                    "rgba(233, 160, 8, 0.09)";

                icon.style.color =
                    "#A97200";
            } else {
                icon.style.background =
                    "rgba(22, 163, 106, 0.08)";

                icon.style.color =
                    "var(--success)";
            }
        }


        trackingToast.classList.add("active");


        if (toastTimer) {
            clearTimeout(toastTimer);
        }


        toastTimer = setTimeout(() => {

            trackingToast.classList.remove(
                "active"
            );

        }, 3200);
    }


    /* =====================================================
       20. CONSULTAR TRAZABILIDAD
    ====================================================== */

    function openTraceability() {

        if (!selectedAlertId) {
            return;
        }

        const alert =
            getAlertById(selectedAlertId);

        if (!alert) {
            return;
        }


        /*
         * Prototipo:
         * se abre el módulo de Auditoría.
         *
         * Se envía la referencia mediante hash para que
         * posteriormente pueda usarse como identificador
         * visual si se desea conectar ambos módulos.
         */

        const reference =
            encodeURIComponent(
                alert.auditReference
            );

        window.location.href =
            `auditoriaAuditor.html#audit=${reference}`;
    }


    /* =====================================================
       21. PERFIL
    ====================================================== */

    function toggleProfile() {

        if (!profile) {
            return;
        }

        profile.classList.toggle("open");
    }


    function closeProfile() {

        if (!profile) {
            return;
        }

        profile.classList.remove("open");
    }


    /* =====================================================
       22. MODAL DE CIERRE DE SESIÓN
    ====================================================== */

    function openLogoutModal() {

        closeProfile();

        if (!logoutModal) {
            return;
        }

        logoutModal.classList.add("active");
        logoutModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("locked");
    }


    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }

        logoutModal.classList.remove("active");
        logoutModal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !alertDrawer ||
            !alertDrawer.classList.contains("active")
        ) {
            document.body.classList.remove("locked");
        }
    }


    function confirmLogoutAction() {

        window.location.href = "login.html";
    }


    /* =====================================================
       23. NOTIFICACIÓN SUPERIOR
    ====================================================== */

    function handleNotificationClick() {

        /*
         * Ya estamos en Alertas.
         * Se desplaza hacia el centro de control.
         */

        const control =
            document.querySelector(
                ".alerts-control"
            );

        if (control) {
            control.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       24. EVENTOS DE FILTROS
    ====================================================== */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            renderAlerts
        );
    }

    if (priorityFilter) {
        priorityFilter.addEventListener(
            "change",
            renderAlerts
        );
    }

    if (categoryFilter) {
        categoryFilter.addEventListener(
            "change",
            renderAlerts
        );
    }

    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            renderAlerts
        );
    }


    /* =====================================================
       25. EVENTOS DEL DRAWER
    ====================================================== */

    if (closeDrawer) {
        closeDrawer.addEventListener(
            "click",
            closeAlertDrawer
        );
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener(
            "click",
            closeAlertDrawer
        );
    }

    if (trackingNote) {
        trackingNote.addEventListener(
            "input",
            updateNoteCounter
        );
    }

    if (saveTrackingButton) {
        saveTrackingButton.addEventListener(
            "click",
            saveTracking
        );
    }

    if (viewTraceButton) {
        viewTraceButton.addEventListener(
            "click",
            openTraceability
        );
    }


    /* =====================================================
       26. EVENTOS DEL PERFIL
    ====================================================== */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();
                toggleProfile();
            }
        );
    }


    document.addEventListener(
        "click",
        (event) => {

            if (
                profile &&
                !profile.contains(event.target)
            ) {
                closeProfile();
            }
        }
    );


    /* =====================================================
       27. EVENTOS CERRAR SESIÓN
    ====================================================== */

    if (profileLogout) {
        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );
    }


    closeLogoutButtons.forEach((button) => {

        button.addEventListener(
            "click",
            closeLogoutModal
        );
    });


    if (confirmLogout) {
        confirmLogout.addEventListener(
            "click",
            confirmLogoutAction
        );
    }


    /* =====================================================
       28. NOTIFICACIONES
    ====================================================== */

    if (notificationButton) {
        notificationButton.addEventListener(
            "click",
            handleNotificationClick
        );
    }


    /* =====================================================
       29. TECLA ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {
                closeLogoutModal();
                return;
            }


            if (
                alertDrawer &&
                alertDrawer.classList.contains(
                    "active"
                )
            ) {
                closeAlertDrawer();
                return;
            }


            closeProfile();
        }
    );


    /* =====================================================
       30. INICIALIZACIÓN
    ====================================================== */

    updateSummary();
    renderAlerts();
    updateNoteCounter();

});