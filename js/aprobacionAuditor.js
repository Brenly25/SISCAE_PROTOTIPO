/* =========================================================
   SISCAE - APROBACIÓN AUDITOR
   aprobacionAuditor.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS SIMULADOS
    ====================================================== */

    const approvalRecords = [
        {
            id: 1,
            code: "ACT-2026-041",
            name: "Libro de Ciencias 7.º",
            version: "v3.2",
            type: "Material editorial",
            decision: "Aprobado",
            responsible: "Laura Hernández",
            initials: "LH",
            role: "Revisor",
            date: "06/10/2026",
            time: "10:18 a. m.",
            reason:
                "La versión cumple con las observaciones registradas durante la revisión y continúa con el flujo editorial correspondiente.",
            traceId: "APR-2026-0041"
        },
        {
            id: 2,
            code: "ACT-2026-038",
            name: "Guía de Matemática 6.º",
            version: "v2.1",
            type: "Documento",
            decision: "Aprobado",
            responsible: "Carlos Martínez",
            initials: "CM",
            role: "Revisor",
            date: "06/10/2026",
            time: "08:46 a. m.",
            reason:
                "Se verificaron los ajustes de formato registrados para la versión y se dejó constancia de la decisión de aprobación.",
            traceId: "APR-2026-0038"
        },
        {
            id: 3,
            code: "ACT-2026-036",
            name: "Material de Lenguaje 5.º",
            version: "v4.0",
            type: "Material editorial",
            decision: "Rechazado",
            responsible: "Ana Rodríguez",
            initials: "AR",
            role: "Revisor",
            date: "05/10/2026",
            time: "01:24 p. m.",
            reason:
                "La versión mantiene diferencias de diseño previamente observadas. Se registró el rechazo para que el contenido continúe con las correcciones correspondientes.",
            traceId: "APR-2026-0036"
        },
        {
            id: 4,
            code: "ACT-2026-032",
            name: "Cuaderno de Estudios Sociales 4.º",
            version: "v1.8",
            type: "Documento",
            decision: "Aprobado",
            responsible: "José Ramírez",
            initials: "JR",
            role: "Revisor",
            date: "05/10/2026",
            time: "10:42 a. m.",
            reason:
                "La referencia observada fue actualizada y la versión cumple con los criterios establecidos para continuar con el proceso editorial.",
            traceId: "APR-2026-0032"
        },
        {
            id: 5,
            code: "ACT-2026-029",
            name: "Guía Docente de Ciencias 8.º",
            version: "v2.4",
            type: "Documento",
            decision: "Rechazado",
            responsible: "María López",
            initials: "ML",
            role: "Revisor",
            date: "04/10/2026",
            time: "09:17 a. m.",
            reason:
                "Se identificaron diferencias entre la versión presentada y los datos asociados al activo. La versión requiere una nueva verificación antes de continuar.",
            traceId: "APR-2026-0029"
        },
        {
            id: 6,
            code: "ACT-2026-025",
            name: "Libro de Matemática 9.º",
            version: "v3.5",
            type: "Material editorial",
            decision: "Aprobado",
            responsible: "Daniel Pérez",
            initials: "DP",
            role: "Revisor",
            date: "03/10/2026",
            time: "11:08 a. m.",
            reason:
                "Los ajustes señalados durante la revisión fueron incorporados en la versión evaluada y se registró su aprobación.",
            traceId: "APR-2026-0025"
        },
        {
            id: 7,
            code: "ACT-2026-021",
            name: "Material Educativo de Inglés 6.º",
            version: "v1.6",
            type: "Documento",
            decision: "Aprobado",
            responsible: "Sofía Castillo",
            initials: "SC",
            role: "Revisor",
            date: "02/10/2026",
            time: "12:02 p. m.",
            reason:
                "La corrección solicitada fue verificada en la versión correspondiente y el contenido quedó aprobado dentro del flujo editorial.",
            traceId: "APR-2026-0021"
        },
        {
            id: 8,
            code: "ACT-2026-018",
            name: "Infografía del Sistema Solar",
            version: "v2.0",
            type: "Imagen",
            decision: "Rechazado",
            responsible: "Miguel Flores",
            initials: "MF",
            role: "Revisor",
            date: "01/10/2026",
            time: "09:36 a. m.",
            reason:
                "Los elementos visuales aún presentan diferencias con respecto a los criterios definidos para la versión. Se requiere una actualización.",
            traceId: "APR-2026-0018"
        },
        {
            id: 9,
            code: "ACT-2026-015",
            name: "Video introductorio de Ciencias",
            version: "v1.3",
            type: "Video",
            decision: "Aprobado",
            responsible: "Andrea Torres",
            initials: "AT",
            role: "Revisor",
            date: "30/09/2026",
            time: "03:41 p. m.",
            reason:
                "El recurso audiovisual fue revisado y la versión presentada cumple con los criterios registrados para continuar con el flujo.",
            traceId: "APR-2026-0015"
        }
    ];


    /* =====================================================
       REFERENCIAS DEL DOM
    ====================================================== */

    const tableBody =
        document.getElementById("approvalTableBody");

    const approvalTable =
        document.querySelector(".approval-table");

    const emptyState =
        document.getElementById("emptyState");

    const resultsCounter =
        document.getElementById("resultsCounter");


    /* Filtros */

    const searchInput =
        document.getElementById("searchInput");

    const decisionFilter =
        document.getElementById("decisionFilter");

    const typeFilter =
        document.getElementById("typeFilter");


    /* Contadores */

    const totalDecisions =
        document.getElementById("totalDecisions");

    const approvedDecisions =
        document.getElementById("approvedDecisions");

    const rejectedDecisions =
        document.getElementById("rejectedDecisions");


    /* Drawer */

    const approvalDrawer =
        document.getElementById("approvalDrawer");

    const drawerOverlay =
        document.getElementById("drawerOverlay");

    const closeDrawerButton =
        document.getElementById("closeDrawer");


    /* Información drawer */

    const drawerAssetName =
        document.getElementById("drawerAssetName");

    const drawerAssetCode =
        document.getElementById("drawerAssetCode");

    const drawerDecision =
        document.getElementById("drawerDecision");

    const drawerVersion =
        document.getElementById("drawerVersion");

    const drawerType =
        document.getElementById("drawerType");

    const drawerResponsible =
        document.getElementById("drawerResponsible");

    const drawerRole =
        document.getElementById("drawerRole");

    const drawerDate =
        document.getElementById("drawerDate");

    const decisionMessage =
        document.getElementById("decisionMessage");

    const drawerResultLabel =
        document.getElementById("drawerResultLabel");

    const drawerReason =
        document.getElementById("drawerReason");

    const drawerTraceId =
        document.getElementById("drawerTraceId");


    /* Perfil */

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const profileLogout =
        document.getElementById("profileLogout");


    /* Alertas */

    const notificationButton =
        document.getElementById("notificationButton");


    /* Logout */

    const logoutModal =
        document.getElementById("logoutModal");

    const confirmLogout =
        document.getElementById("confirmLogout");

    const closeLogoutElements =
        document.querySelectorAll("[data-close-logout]");


    /* =====================================================
       UTILIDADES
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


    function getDecisionClass(decision) {

        return decision === "Aprobado"
            ? "decision-approved"
            : "decision-rejected";
    }


    function getRowClass(decision) {

        return decision === "Aprobado"
            ? "approved-row"
            : "rejected-row";
    }


    /* =====================================================
       ICONOS
    ====================================================== */

    function documentIcon() {

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="8" y1="13" x2="16" y2="13"></line>
                <line x1="8" y1="17" x2="13" y2="17"></line>
            </svg>
        `;
    }


    function imageIcon() {

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <circle cx="8.5" cy="9" r="1.5"></circle>
                <polyline points="21 15 16 10 5 20"></polyline>
            </svg>
        `;
    }


    function videoIcon() {

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="14" height="14" rx="2"></rect>
                <polygon points="10 9 14 12 10 15 10 9"></polygon>
                <polyline points="17 10 21 8 21 16 17 14"></polyline>
            </svg>
        `;
    }


    function editorialIcon() {

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="8" y1="7" x2="16" y2="7"></line>
                <line x1="8" y1="11" x2="16" y2="11"></line>
            </svg>
        `;
    }


    function eyeIcon() {

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="2.5"></circle>
            </svg>
        `;
    }


    function getAssetIcon(type) {

        switch (type) {

            case "Imagen":
                return imageIcon();

            case "Video":
                return videoIcon();

            case "Material editorial":
                return editorialIcon();

            default:
                return documentIcon();
        }
    }


    /* =====================================================
       RESUMEN
    ====================================================== */

    function loadSummary() {

        const total =
            approvalRecords.length;


        const approved =
            approvalRecords.filter(
                record => record.decision === "Aprobado"
            ).length;


        const rejected =
            approvalRecords.filter(
                record => record.decision === "Rechazado"
            ).length;


        if (totalDecisions) {
            totalDecisions.textContent = total;
        }


        if (approvedDecisions) {
            approvedDecisions.textContent = approved;
        }


        if (rejectedDecisions) {
            rejectedDecisions.textContent = rejected;
        }
    }


    /* =====================================================
       FILTRADO
    ====================================================== */

    function getFilteredRecords() {

        const search =
            searchInput
                ? normalizeText(searchInput.value)
                : "";


        const decision =
            decisionFilter
                ? decisionFilter.value
                : "all";


        const type =
            typeFilter
                ? typeFilter.value
                : "all";


        return approvalRecords.filter(record => {

            const searchableText =
                normalizeText(`
                    ${record.code}
                    ${record.name}
                    ${record.version}
                    ${record.type}
                    ${record.decision}
                    ${record.responsible}
                    ${record.role}
                    ${record.date}
                    ${record.traceId}
                `);


            const matchesSearch =
                search === "" ||
                searchableText.includes(search);


            const matchesDecision =
                decision === "all" ||
                record.decision === decision;


            const matchesType =
                type === "all" ||
                record.type === type;


            return (
                matchesSearch &&
                matchesDecision &&
                matchesType
            );
        });
    }


    /* =====================================================
       CONTADOR DE RESULTADOS
    ====================================================== */

    function updateResultsCounter(count) {

        if (!resultsCounter) {
            return;
        }

        resultsCounter.textContent = count;
    }


    /* =====================================================
       CREAR FILA
    ====================================================== */

    function createApprovalRow(record) {

        const row =
            document.createElement("tr");


        row.classList.add(
            getRowClass(record.decision)
        );


        row.innerHTML = `

            <td>

                <div class="asset-cell">

                    <span class="asset-icon">
                        ${getAssetIcon(record.type)}
                    </span>

                    <div class="asset-info">

                        <strong
                            title="${escapeHTML(record.name)}"
                        >
                            ${escapeHTML(record.name)}
                        </strong>

                        <span>
                            ${escapeHTML(record.code)}
                        </span>

                    </div>

                </div>

            </td>


            <td>

                <span class="version-badge">
                    ${escapeHTML(record.version)}
                </span>

            </td>


            <td>

                <span
                    class="decision-badge ${getDecisionClass(record.decision)}"
                >
                    ${escapeHTML(record.decision)}
                </span>

            </td>


            <td>

                <div class="responsible-cell">

                    <span class="responsible-avatar">
                        ${escapeHTML(record.initials)}
                    </span>


                    <div class="responsible-data">

                        <strong
                            title="${escapeHTML(record.responsible)}"
                        >
                            ${escapeHTML(record.responsible)}
                        </strong>

                        <span>
                            ${escapeHTML(record.role)}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(record.date)}
            </td>


            <td class="action-column">

                <button
                    class="evidence-button"
                    type="button"
                    data-approval-id="${record.id}"
                    aria-label="Ver evidencia de ${escapeHTML(record.name)}"
                >

                    ${eyeIcon()}

                    <span>Ver evidencia</span>

                </button>

            </td>
        `;


        return row;
    }


    /* =====================================================
       RENDERIZAR TABLA
    ====================================================== */

    function renderRecords() {

        if (!tableBody) {
            return;
        }


        const filteredRecords =
            getFilteredRecords();


        tableBody.innerHTML = "";


        filteredRecords.forEach(record => {

            tableBody.appendChild(
                createApprovalRow(record)
            );
        });


        updateResultsCounter(
            filteredRecords.length
        );


        if (approvalTable) {

            approvalTable.style.display =
                filteredRecords.length > 0
                    ? "table"
                    : "none";
        }


        if (emptyState) {

            emptyState.hidden =
                filteredRecords.length > 0;
        }
    }


    /* =====================================================
       EVENTOS DE FILTROS
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderRecords
        );
    }


    if (decisionFilter) {

        decisionFilter.addEventListener(
            "change",
            renderRecords
        );
    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            renderRecords
        );
    }


    /* =====================================================
       CARGAR DRAWER
    ====================================================== */

    function loadDrawerData(record) {

        if (drawerAssetName) {
            drawerAssetName.textContent =
                record.name;
        }


        if (drawerAssetCode) {
            drawerAssetCode.textContent =
                record.code;
        }


        if (drawerDecision) {

            drawerDecision.textContent =
                record.decision;

            drawerDecision.className =
                `decision-badge ${getDecisionClass(record.decision)}`;
        }


        if (drawerVersion) {
            drawerVersion.textContent =
                record.version;
        }


        if (drawerType) {
            drawerType.textContent =
                record.type;
        }


        if (drawerResponsible) {
            drawerResponsible.textContent =
                record.responsible;
        }


        if (drawerRole) {
            drawerRole.textContent =
                record.role;
        }


        if (drawerDate) {
            drawerDate.textContent =
                `${record.date} · ${record.time}`;
        }


        if (drawerReason) {
            drawerReason.textContent =
                record.reason;
        }


        if (drawerTraceId) {
            drawerTraceId.textContent =
                record.traceId;
        }


        /*
         * Diseño del bloque de resultado según
         * la decisión registrada.
         */

        if (decisionMessage) {

            decisionMessage.classList.remove(
                "rejected"
            );


            if (record.decision === "Rechazado") {

                decisionMessage.classList.add(
                    "rejected"
                );
            }
        }


        if (drawerResultLabel) {

            drawerResultLabel.textContent =
                record.decision === "Aprobado"
                    ? "Aprobación registrada"
                    : "Rechazo registrado";
        }
    }


    /* =====================================================
       ABRIR DRAWER
    ====================================================== */

    function openDrawer(record) {

        if (!approvalDrawer || !drawerOverlay) {
            return;
        }


        loadDrawerData(record);


        approvalDrawer.classList.add("active");

        drawerOverlay.classList.add("active");


        approvalDrawer.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add("locked");
    }


    /* =====================================================
       CERRAR DRAWER
    ====================================================== */

    function closeDrawer() {

        if (!approvalDrawer || !drawerOverlay) {
            return;
        }


        approvalDrawer.classList.remove("active");

        drawerOverlay.classList.remove("active");


        approvalDrawer.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove("locked");
    }


    /* =====================================================
       CLICK VER EVIDENCIA
    ====================================================== */

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-approval-id]"
                    );


                if (!button) {
                    return;
                }


                const recordId =
                    Number(
                        button.dataset.approvalId
                    );


                const record =
                    approvalRecords.find(
                        item => item.id === recordId
                    );


                if (!record) {
                    return;
                }


                openDrawer(record);
            }
        );
    }


    /* =====================================================
       CERRAR DRAWER
    ====================================================== */

    if (closeDrawerButton) {

        closeDrawerButton.addEventListener(
            "click",
            closeDrawer
        );
    }


    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            "click",
            closeDrawer
        );
    }


    /* =====================================================
       PERFIL
    ====================================================== */

    function closeProfileMenu() {

        if (!profile) {
            return;
        }


        profile.classList.remove("open");


        if (profileButton) {

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    if (profile && profileButton) {

        profileButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const isOpen =
                    profile.classList.toggle(
                        "open"
                    );


                profileButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    profile.classList.contains("open") &&
                    !profile.contains(event.target)
                ) {

                    closeProfileMenu();
                }
            }
        );
    }


    /* =====================================================
       ALERTAS
    ====================================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "alertasAuditor.html";
            }
        );
    }


    /* =====================================================
       LOGOUT
    ====================================================== */

    function openLogoutModal() {

        if (!logoutModal) {
            return;
        }


        closeProfileMenu();


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


        document.body.classList.remove("locked");
    }


    /* Logout desde perfil */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );
    }


    /*
       Logout desde sidebar.
       El sidebar se carga dinámicamente,
       por eso utilizamos delegación de eventos.
    */

    document.addEventListener(
        "click",
        event => {

            const sidebarLogout =
                event.target.closest(
                    "#sidebarLogout"
                );


            if (!sidebarLogout) {
                return;
            }


            event.preventDefault();

            openLogoutModal();
        }
    );


    /* Cancelar modal */

    closeLogoutElements.forEach(element => {

        element.addEventListener(
            "click",
            closeLogoutModal
        );
    });


    /* Confirmar cierre */

    if (confirmLogout) {

        confirmLogout.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html";
            }
        );
    }


    /* =====================================================
       TECLA ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            /* Drawer */

            if (
                approvalDrawer &&
                approvalDrawer.classList.contains(
                    "active"
                )
            ) {

                closeDrawer();

                return;
            }


            /* Modal */

            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

                return;
            }


            /* Perfil */

            if (
                profile &&
                profile.classList.contains(
                    "open"
                )
            ) {

                closeProfileMenu();
            }
        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ====================================================== */

    loadSummary();

    renderRecords();

});