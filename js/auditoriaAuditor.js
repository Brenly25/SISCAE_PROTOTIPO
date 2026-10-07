/* =========================================================
   SISCAE - AUDITORÍA AUDITOR
   auditoriaAuditor.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS SIMULADOS DE AUDITORÍA
    ====================================================== */

    const auditRecords = [
        {
            id: 1,
            traceId: "AUD-2026-0108",
            date: "07/10/2026",
            time: "08:42 a. m.",
            user: "Ana Martínez",
            initials: "AM",
            role: "Autor / Editor",
            account: "ana.martinez@clases.edu.sv",
            event: "Modificación",
            action: "Actualización de activo",
            asset: "Libro de Ciencias 7.º",
            assetCode: "ACT-2026-041",
            version: "v3.3",
            result: "Registrado",
            description:
                "Se registró una nueva intervención sobre el activo editorial y se generó una nueva versión dentro del historial de trazabilidad.",
            ip: "192.168.10.24",
            integrity: true,
            integrityStatus: "Integridad verificada",
            hash: "91c4a8d3f7b25e109ab37e64c88f2d0b5a7f3129c6d48e10a3749bcd31e7f821"
        },
        {
            id: 2,
            traceId: "AUD-2026-0107",
            date: "07/10/2026",
            time: "08:26 a. m.",
            user: "Laura Hernández",
            initials: "LH",
            role: "Revisor",
            account: "laura.hernandez@clases.edu.sv",
            event: "Revisión",
            action: "Revisión de versión",
            asset: "Libro de Ciencias 7.º",
            assetCode: "ACT-2026-041",
            version: "v3.2",
            result: "Registrado",
            description:
                "Se registró la revisión correspondiente a la versión seleccionada del activo editorial.",
            ip: "192.168.10.31",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 3,
            traceId: "AUD-2026-0106",
            date: "07/10/2026",
            time: "08:18 a. m.",
            user: "Carlos Martínez",
            initials: "CM",
            role: "Revisor",
            account: "carlos.martinez@clases.edu.sv",
            event: "Aprobación",
            action: "Aprobación de versión",
            asset: "Guía de Matemática 6.º",
            assetCode: "ACT-2026-038",
            version: "v2.1",
            result: "Aprobado",
            description:
                "La versión fue aprobada después de verificar las observaciones registradas durante el proceso editorial.",
            ip: "192.168.10.36",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 4,
            traceId: "AUD-2026-0105",
            date: "07/10/2026",
            time: "08:02 a. m.",
            user: "Sistema SISCAE",
            initials: "SI",
            role: "Administrador",
            account: "sistema@clases.edu.sv",
            event: "Integridad",
            action: "Verificación SHA-256",
            asset: "Guía de Matemática 6.º",
            assetCode: "ACT-2026-038",
            version: "v2.1",
            result: "Verificado",
            description:
                "Se verificó la correspondencia del hash SHA-256 almacenado para la versión del activo.",
            ip: "10.0.0.15",
            integrity: true,
            integrityStatus: "Integridad verificada",
            hash: "b6741a72fd3e8c2105b9247e31a9d850fe12a64c7d893e04b265ca0f2d1843aa"
        },
        {
            id: 5,
            traceId: "AUD-2026-0104",
            date: "06/10/2026",
            time: "04:31 p. m.",
            user: "Ana Rodríguez",
            initials: "AR",
            role: "Revisor",
            account: "ana.rodriguez@clases.edu.sv",
            event: "Observación",
            action: "Registro de observación",
            asset: "Material de Lenguaje 5.º",
            assetCode: "ACT-2026-036",
            version: "v4.0",
            result: "Registrado",
            description:
                "Se registró una observación relacionada con elementos de diseño identificados durante la revisión de la versión.",
            ip: "192.168.10.42",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 6,
            traceId: "AUD-2026-0103",
            date: "06/10/2026",
            time: "03:17 p. m.",
            user: "José Ramírez",
            initials: "JR",
            role: "Revisor",
            account: "jose.ramirez@clases.edu.sv",
            event: "Aprobación",
            action: "Aprobación de versión",
            asset: "Cuaderno de Estudios Sociales 4.º",
            assetCode: "ACT-2026-032",
            version: "v1.8",
            result: "Aprobado",
            description:
                "Se registró la aprobación de la versión luego de comprobar que las observaciones anteriores fueron atendidas.",
            ip: "192.168.10.19",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 7,
            traceId: "AUD-2026-0102",
            date: "06/10/2026",
            time: "01:44 p. m.",
            user: "Daniel Pérez",
            initials: "DP",
            role: "Autor / Editor",
            account: "daniel.perez@clases.edu.sv",
            event: "Carga",
            action: "Carga de nueva versión",
            asset: "Libro de Matemática 9.º",
            assetCode: "ACT-2026-025",
            version: "v3.5",
            result: "Registrado",
            description:
                "El usuario cargó una nueva versión del activo editorial. La intervención quedó asociada al historial del recurso.",
            ip: "192.168.10.54",
            integrity: true,
            integrityStatus: "Integridad verificada",
            hash: "8f17c63b59ad8e721a364fc923f2b4d8906e34c51fa2d740b138c75a4d02ef19"
        },
        {
            id: 8,
            traceId: "AUD-2026-0101",
            date: "06/10/2026",
            time: "11:23 a. m.",
            user: "María López",
            initials: "ML",
            role: "Revisor",
            account: "maria.lopez@clases.edu.sv",
            event: "Aprobación",
            action: "Rechazo de versión",
            asset: "Guía Docente de Ciencias 8.º",
            assetCode: "ACT-2026-029",
            version: "v2.4",
            result: "Requiere atención",
            description:
                "La versión no continuó en el flujo de aprobación debido a inconsistencias identificadas durante la revisión.",
            ip: "192.168.10.27",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 9,
            traceId: "AUD-2026-0100",
            date: "06/10/2026",
            time: "09:05 a. m.",
            user: "Sofía Castillo",
            initials: "SC",
            role: "Autor / Editor",
            account: "sofia.castillo@clases.edu.sv",
            event: "Acceso",
            action: "Consulta de activo",
            asset: "Material Educativo de Inglés 6.º",
            assetCode: "ACT-2026-021",
            version: "v1.6",
            result: "Permitido",
            description:
                "Se registró el acceso del usuario al activo editorial mediante el portal institucional.",
            ip: "192.168.10.63",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 10,
            traceId: "AUD-2026-0099",
            date: "05/10/2026",
            time: "04:12 p. m.",
            user: "Miguel Flores",
            initials: "MF",
            role: "Revisor",
            account: "miguel.flores@clases.edu.sv",
            event: "Observación",
            action: "Registro de observación",
            asset: "Infografía del Sistema Solar",
            assetCode: "ACT-2026-018",
            version: "v2.0",
            result: "Registrado",
            description:
                "Se registró una observación de diseño asociada a la versión del recurso gráfico.",
            ip: "192.168.10.48",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        },
        {
            id: 11,
            traceId: "AUD-2026-0098",
            date: "05/10/2026",
            time: "02:38 p. m.",
            user: "Andrea Torres",
            initials: "AT",
            role: "Autor / Editor",
            account: "andrea.torres@clases.edu.sv",
            event: "Carga",
            action: "Carga de recurso audiovisual",
            asset: "Video introductorio de Ciencias",
            assetCode: "ACT-2026-015",
            version: "v1.3",
            result: "Registrado",
            description:
                "Se registró la carga de una nueva versión del recurso audiovisual dentro del proyecto editorial.",
            ip: "192.168.10.71",
            integrity: true,
            integrityStatus: "Integridad verificada",
            hash: "a4d80b71936e52c84f163a9b728ce05134fd607ec29185bb7d12ef946a3c0281"
        },
        {
            id: 12,
            traceId: "AUD-2026-0097",
            date: "05/10/2026",
            time: "10:16 a. m.",
            user: "Administrador SISCAE",
            initials: "AD",
            role: "Administrador",
            account: "administrador@clases.edu.sv",
            event: "Acceso",
            action: "Actualización de permisos",
            asset: "Proyecto Editorial Ciencias 2026",
            assetCode: "PRY-2026-006",
            version: "N/A",
            result: "Registrado",
            description:
                "Se registró una actualización de permisos asociados al proyecto editorial y a sus usuarios autorizados.",
            ip: "192.168.10.10",
            integrity: false,
            integrityStatus: "No aplica",
            hash: ""
        }
    ];


    /* =====================================================
       REFERENCIAS DOM
    ====================================================== */

    const tableBody = document.getElementById("auditTableBody");
    const auditTable = document.querySelector(".audit-table");
    const emptyState = document.getElementById("emptyState");

    const searchInput = document.getElementById("searchInput");
    const eventFilter = document.getElementById("eventFilter");
    const roleFilter = document.getElementById("roleFilter");

    const resultsCounter = document.getElementById("resultsCounter");

    const totalEvents = document.getElementById("totalEvents");
    const usersInvolved = document.getElementById("usersInvolved");
    const assetsInvolved = document.getElementById("assetsInvolved");
    const integrityChecks = document.getElementById("integrityChecks");


    /* DRAWER */

    const auditDrawer = document.getElementById("auditDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const closeDrawerButton = document.getElementById("closeDrawer");

    const drawerEventType = document.getElementById("drawerEventType");
    const drawerEventId = document.getElementById("drawerEventId");
    const drawerResult = document.getElementById("drawerResult");

    const drawerUser = document.getElementById("drawerUser");
    const drawerRole = document.getElementById("drawerRole");
    const drawerAccount = document.getElementById("drawerAccount");

    const drawerActionLabel = document.getElementById("drawerActionLabel");
    const drawerDescription = document.getElementById("drawerDescription");

    const drawerAsset = document.getElementById("drawerAsset");
    const drawerAssetCode = document.getElementById("drawerAssetCode");
    const drawerVersion = document.getElementById("drawerVersion");

    const drawerDate = document.getElementById("drawerDate");
    const drawerTraceId = document.getElementById("drawerTraceId");
    const drawerIp = document.getElementById("drawerIp");

    const integritySection = document.getElementById("integritySection");
    const drawerIntegrityStatus = document.getElementById("drawerIntegrityStatus");
    const drawerHash = document.getElementById("drawerHash");


    /* PERFIL */

    const profile = document.getElementById("profile");
    const profileButton = document.getElementById("profileButton");
    const profileLogout = document.getElementById("profileLogout");

    const notificationButton = document.getElementById("notificationButton");


    /* LOGOUT */

    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const closeLogoutElements = document.querySelectorAll(
        "[data-close-logout]"
    );


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


    /* =====================================================
       CLASE SEGÚN EVENTO
    ====================================================== */

    function getEventClass(event) {

        const classes = {
            "Acceso": "event-access",
            "Carga": "event-upload",
            "Modificación": "event-modification",
            "Revisión": "event-review",
            "Observación": "event-observation",
            "Aprobación": "event-approval",
            "Integridad": "event-integrity"
        };

        return classes[event] || "event-access";
    }


    /* =====================================================
       CLASE SEGÚN RESULTADO
    ====================================================== */

    function getResultClass(result) {

        if (
            result === "Aprobado" ||
            result === "Verificado" ||
            result === "Permitido"
        ) {
            return "result-success";
        }

        if (result === "Requiere atención") {
            return "result-warning";
        }

        return "result-info";
    }


    /* =====================================================
       ICONO DETALLE
    ====================================================== */

    function detailIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="2.5"></circle>
            </svg>
        `;
    }


    /* =====================================================
       INDICADORES
    ====================================================== */

    function loadSummary() {

        if (totalEvents) {
            totalEvents.textContent = auditRecords.length;
        }

        const uniqueUsers = new Set(
            auditRecords.map(record => record.account)
        );

        const uniqueAssets = new Set(
            auditRecords.map(record => record.assetCode)
        );

        const integrityTotal = auditRecords.filter(
            record => record.integrity
        ).length;

        if (usersInvolved) {
            usersInvolved.textContent = uniqueUsers.size;
        }

        if (assetsInvolved) {
            assetsInvolved.textContent = uniqueAssets.size;
        }

        if (integrityChecks) {
            integrityChecks.textContent = integrityTotal;
        }
    }


    /* =====================================================
       FILTROS
    ====================================================== */

    function getFilteredRecords() {

        const search = searchInput
            ? normalizeText(searchInput.value)
            : "";

        const selectedEvent = eventFilter
            ? eventFilter.value
            : "all";

        const selectedRole = roleFilter
            ? roleFilter.value
            : "all";


        return auditRecords.filter(record => {

            const searchable = normalizeText(`
                ${record.traceId}
                ${record.user}
                ${record.role}
                ${record.account}
                ${record.event}
                ${record.action}
                ${record.asset}
                ${record.assetCode}
                ${record.version}
                ${record.result}
                ${record.date}
                ${record.time}
                ${record.ip}
            `);

            const matchesSearch =
                search === "" ||
                searchable.includes(search);

            const matchesEvent =
                selectedEvent === "all" ||
                record.event === selectedEvent;

            const matchesRole =
                selectedRole === "all" ||
                record.role === selectedRole;

            return (
                matchesSearch &&
                matchesEvent &&
                matchesRole
            );
        });
    }


    /* =====================================================
       FILA DE TABLA
    ====================================================== */

    function createAuditRow(record) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="date-cell">
                    <strong>${escapeHTML(record.date)}</strong>
                    <span>${escapeHTML(record.time)}</span>
                </div>
            </td>

            <td>
                <div class="user-cell">

                    <span class="user-avatar">
                        ${escapeHTML(record.initials)}
                    </span>

                    <div class="user-information">
                        <strong title="${escapeHTML(record.user)}">
                            ${escapeHTML(record.user)}
                        </strong>

                        <span>
                            ${escapeHTML(record.role)}
                        </span>
                    </div>

                </div>
            </td>

            <td>
                <span class="event-badge ${getEventClass(record.event)}">
                    ${escapeHTML(record.event)}
                </span>
            </td>

            <td>
                <div class="asset-cell">

                    <strong title="${escapeHTML(record.asset)}">
                        ${escapeHTML(record.asset)}
                    </strong>

                    <span>
                        ${escapeHTML(record.assetCode)}
                    </span>

                </div>
            </td>

            <td>
                <span class="version-badge">
                    ${escapeHTML(record.version)}
                </span>
            </td>

            <td>
                <span class="result-badge ${getResultClass(record.result)}">
                    ${escapeHTML(record.result)}
                </span>
            </td>

            <td class="action-column">

                <button
                    class="detail-button"
                    type="button"
                    data-audit-id="${record.id}"
                    aria-label="Consultar evento ${escapeHTML(record.traceId)}"
                >
                    ${detailIcon()}
                    <span>Consultar</span>
                </button>

            </td>
        `;

        return row;
    }


    /* =====================================================
       RENDER TABLA
    ====================================================== */

    function renderAuditRecords() {

        if (!tableBody) {
            return;
        }

        const records = getFilteredRecords();

        tableBody.innerHTML = "";

        records.forEach(record => {
            tableBody.appendChild(
                createAuditRow(record)
            );
        });

        if (resultsCounter) {
            resultsCounter.textContent = records.length;
        }

        if (auditTable) {
            auditTable.style.display =
                records.length > 0
                    ? "table"
                    : "none";
        }

        if (emptyState) {
            emptyState.hidden = records.length > 0;
        }
    }


    /* =====================================================
       FILTROS - EVENTOS
    ====================================================== */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            renderAuditRecords
        );
    }

    if (eventFilter) {
        eventFilter.addEventListener(
            "change",
            renderAuditRecords
        );
    }

    if (roleFilter) {
        roleFilter.addEventListener(
            "change",
            renderAuditRecords
        );
    }


    /* =====================================================
       DRAWER - CARGAR INFORMACIÓN
    ====================================================== */

    function loadDrawer(record) {

        if (drawerEventType) {
            drawerEventType.textContent = record.event;
        }

        if (drawerEventId) {
            drawerEventId.textContent = record.traceId;
        }

        if (drawerResult) {
            drawerResult.textContent = record.result;

            drawerResult.className =
                `result-badge ${getResultClass(record.result)}`;
        }


        /* Usuario */

        if (drawerUser) {
            drawerUser.textContent = record.user;
        }

        if (drawerRole) {
            drawerRole.textContent = record.role;
        }

        if (drawerAccount) {
            drawerAccount.textContent = record.account;
        }


        /* Acción */

        if (drawerActionLabel) {
            drawerActionLabel.textContent = record.action;
        }

        if (drawerDescription) {
            drawerDescription.textContent = record.description;
        }


        /* Activo */

        if (drawerAsset) {
            drawerAsset.textContent = record.asset;
        }

        if (drawerAssetCode) {
            drawerAssetCode.textContent = record.assetCode;
        }

        if (drawerVersion) {
            drawerVersion.textContent = record.version;
        }


        /* Datos técnicos */

        if (drawerDate) {
            drawerDate.textContent =
                `${record.date} · ${record.time}`;
        }

        if (drawerTraceId) {
            drawerTraceId.textContent = record.traceId;
        }

        if (drawerIp) {
            drawerIp.textContent = record.ip;
        }


        /* Integridad */

        if (integritySection) {

            if (record.integrity) {

                integritySection.style.display = "";

                if (drawerIntegrityStatus) {
                    drawerIntegrityStatus.textContent =
                        record.integrityStatus;
                }

                if (drawerHash) {
                    drawerHash.textContent =
                        record.hash;
                }

            } else {

                integritySection.style.display = "none";
            }
        }
    }


    /* =====================================================
       ABRIR DRAWER
    ====================================================== */

    function openDrawer(record) {

        if (!auditDrawer || !drawerOverlay) {
            return;
        }

        loadDrawer(record);

        auditDrawer.classList.add("active");
        drawerOverlay.classList.add("active");

        auditDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("locked");
    }


    /* =====================================================
       CERRAR DRAWER
    ====================================================== */

    function closeDrawer() {

        if (!auditDrawer || !drawerOverlay) {
            return;
        }

        auditDrawer.classList.remove("active");
        drawerOverlay.classList.remove("active");

        auditDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("locked");
    }


    /* =====================================================
       CLICK CONSULTAR
    ====================================================== */

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            event => {

                const button = event.target.closest(
                    "[data-audit-id]"
                );

                if (!button) {
                    return;
                }

                const id = Number(
                    button.dataset.auditId
                );

                const record = auditRecords.find(
                    item => item.id === id
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
                    profile.classList.toggle("open");

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
       MODAL LOGOUT
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


    /* Desde perfil */

    if (profileLogout) {
        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );
    }


    /* Desde sidebar cargado dinámicamente */

    document.addEventListener(
        "click",
        event => {

            const sidebarLogout =
                event.target.closest("#sidebarLogout");

            if (!sidebarLogout) {
                return;
            }

            event.preventDefault();

            openLogoutModal();
        }
    );


    /* Cancelar */

    closeLogoutElements.forEach(element => {

        element.addEventListener(
            "click",
            closeLogoutModal
        );
    });


    /* Confirmar */

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
       TECLA ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                auditDrawer &&
                auditDrawer.classList.contains("active")
            ) {
                closeDrawer();
                return;
            }

            if (
                logoutModal &&
                logoutModal.classList.contains("active")
            ) {
                closeLogoutModal();
                return;
            }

            if (
                profile &&
                profile.classList.contains("open")
            ) {
                closeProfileMenu();
            }
        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ====================================================== */

    loadSummary();
    renderAuditRecords();

});