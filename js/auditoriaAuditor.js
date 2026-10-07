document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       SISCAE
       Módulo: Auditoría - Perfil Auditor
       Archivo: js/auditoriaAuditor.js
       ========================================================= */

    const auditRecords = [
        {
            id: "AUD-2026-0108",
            date: "07/10/2026",
            time: "08:42 a. m.",
            user: "Ana Martínez",
            initials: "AM",
            role: "Autor / Editor",
            account: "ana.martinez@clases.edu.sv",
            eventType: "Modificación",
            action: "Actualización de activo",
            asset: "Libro de Ciencias 7.º",
            assetCode: "ACT-2026-041",
            version: "v3.3",
            result: "Registrado",
            ip: "192.168.10.24",
            integrity: true,
            hash: "91c4a8367d2f86b3e72a4bc923ac81e9c1247e0f5328b84545e7fef98231f821",
            description:
                "Se registró una nueva versión del activo editorial posterior a la versión previamente revisada."
        },
        {
            id: "AUD-2026-0107",
            date: "07/10/2026",
            time: "08:26 a. m.",
            user: "Laura Hernández",
            initials: "LH",
            role: "Revisor",
            account: "laura.hernandez@clases.edu.sv",
            eventType: "Revisión",
            action: "Revisión de versión",
            asset: "Libro de Ciencias 7.º",
            assetCode: "ACT-2026-041",
            version: "v3.2",
            result: "Registrado",
            ip: "192.168.10.31",
            integrity: false,
            hash: "",
            description:
                "Se registró la revisión editorial correspondiente a la versión v3.2 del activo."
        },
        {
            id: "AUD-2026-0106",
            date: "07/10/2026",
            time: "08:18 a. m.",
            user: "Carlos Martínez",
            initials: "CM",
            role: "Revisor",
            account: "carlos.martinez@clases.edu.sv",
            eventType: "Aprobación",
            action: "Aprobación de contenido",
            asset: "Guía de Matemática 6.º",
            assetCode: "ACT-2026-038",
            version: "v2.1",
            result: "Aprobado",
            ip: "192.168.10.36",
            integrity: false,
            hash: "",
            description:
                "La versión fue aprobada dentro del flujo editorial después de completar su proceso de revisión."
        },
        {
            id: "AUD-2026-0105",
            date: "07/10/2026",
            time: "08:02 a. m.",
            user: "Sistema SISCAE",
            initials: "SI",
            role: "Administrador",
            account: "sistema@clases.edu.sv",
            eventType: "Integridad",
            action: "Verificación SHA-256",
            asset: "Guía de Matemática 6.º",
            assetCode: "ACT-2026-038",
            version: "v2.1",
            result: "Verificado",
            ip: "10.0.0.15",
            integrity: true,
            hash: "b6745f52e70f2c1831d466f09e9c8245cc1b42771aa7939c7e8bd2a63c5d43aa",
            description:
                "El sistema verificó la integridad de la versión mediante la comparación de su huella SHA-256."
        },
        {
            id: "AUD-2026-0104",
            date: "06/10/2026",
            time: "04:31 p. m.",
            user: "Ana Rodríguez",
            initials: "AR",
            role: "Revisor",
            account: "ana.rodriguez@clases.edu.sv",
            eventType: "Observación",
            action: "Registro de observación",
            asset: "Material de Lenguaje 5.º",
            assetCode: "ACT-2026-036",
            version: "v4.0",
            result: "Registrado",
            ip: "192.168.10.42",
            integrity: false,
            hash: "",
            description:
                "Se incorporó una observación editorial asociada a la versión consultada del activo."
        },
        {
            id: "AUD-2026-0103",
            date: "06/10/2026",
            time: "03:17 p. m.",
            user: "José Ramírez",
            initials: "JR",
            role: "Revisor",
            account: "jose.ramirez@clases.edu.sv",
            eventType: "Aprobación",
            action: "Aprobación de contenido",
            asset: "Cuaderno de Estudios Sociales 4.º",
            assetCode: "ACT-2026-032",
            version: "v1.8",
            result: "Aprobado",
            ip: "192.168.10.19",
            integrity: false,
            hash: "",
            description:
                "La versión fue aprobada y quedó registrada como parte del historial del flujo editorial."
        },
        {
            id: "AUD-2026-0102",
            date: "06/10/2026",
            time: "01:44 p. m.",
            user: "Daniel Pérez",
            initials: "DP",
            role: "Autor / Editor",
            account: "daniel.perez@clases.edu.sv",
            eventType: "Carga",
            action: "Carga de nueva versión",
            asset: "Libro de Matemática 9.º",
            assetCode: "ACT-2026-025",
            version: "v3.5",
            result: "Registrado",
            ip: "192.168.10.54",
            integrity: true,
            hash: "8f1752cb86a941a3b945cf9818e693843bf784e593fd846be8732b57e112ef19",
            description:
                "El autor/editor registró una nueva versión del activo dentro del proyecto editorial."
        },
        {
            id: "AUD-2026-0101",
            date: "06/10/2026",
            time: "11:23 a. m.",
            user: "María López",
            initials: "ML",
            role: "Revisor",
            account: "maria.lopez@clases.edu.sv",
            eventType: "Aprobación",
            action: "Rechazo de versión",
            asset: "Guía Docente de Ciencias 8.º",
            assetCode: "ACT-2026-029",
            version: "v2.4",
            result: "Requiere atención",
            ip: "192.168.10.27",
            integrity: false,
            hash: "",
            description:
                "La versión fue rechazada durante el proceso de validación y requiere correcciones antes de continuar."
        },
        {
            id: "AUD-2026-0100",
            date: "06/10/2026",
            time: "09:05 a. m.",
            user: "Sofía Castillo",
            initials: "SC",
            role: "Autor / Editor",
            account: "sofia.castillo@clases.edu.sv",
            eventType: "Acceso",
            action: "Acceso a activo editorial",
            asset: "Material Educativo de Inglés 6.º",
            assetCode: "ACT-2026-021",
            version: "v1.6",
            result: "Permitido",
            ip: "192.168.10.63",
            integrity: false,
            hash: "",
            description:
                "Se registró un acceso autorizado al activo editorial desde una cuenta institucional."
        },
        {
            id: "AUD-2026-0099",
            date: "05/10/2026",
            time: "04:12 p. m.",
            user: "Miguel Flores",
            initials: "MF",
            role: "Revisor",
            account: "miguel.flores@clases.edu.sv",
            eventType: "Observación",
            action: "Registro de observación",
            asset: "Infografía del Sistema Solar",
            assetCode: "ACT-2026-018",
            version: "v2.0",
            result: "Registrado",
            ip: "192.168.10.48",
            integrity: false,
            hash: "",
            description:
                "Se registró una observación asociada al contenido gráfico de la versión."
        },
        {
            id: "AUD-2026-0098",
            date: "05/10/2026",
            time: "02:38 p. m.",
            user: "Andrea Torres",
            initials: "AT",
            role: "Autor / Editor",
            account: "andrea.torres@clases.edu.sv",
            eventType: "Carga",
            action: "Carga de nueva versión",
            asset: "Video introductorio de Ciencias",
            assetCode: "ACT-2026-015",
            version: "v1.3",
            result: "Registrado",
            ip: "192.168.10.71",
            integrity: true,
            hash: "a4d83e91662c711bfca3487f52af8398a674fd21d4311c25acfe41ad216a0281",
            description:
                "Se incorporó una nueva versión del recurso audiovisual y se registró su huella de integridad."
        },
        {
            id: "AUD-2026-0097",
            date: "05/10/2026",
            time: "10:16 a. m.",
            user: "Administrador SISCAE",
            initials: "AD",
            role: "Administrador",
            account: "administrador@clases.edu.sv",
            eventType: "Acceso",
            action: "Actualización de permisos",
            asset: "Proyecto Editorial Ciencias 2026",
            assetCode: "PRY-2026-006",
            version: "N/A",
            result: "Registrado",
            ip: "192.168.10.10",
            integrity: false,
            hash: "",
            description:
                "Se registró una actualización de permisos de acceso asociados al proyecto editorial."
        }
    ];

    /* =========================================================
       REFERENCIAS DEL DOM
       ========================================================= */

    const auditTimeline = document.getElementById("auditTimeline");
    const emptyState = document.getElementById("emptyState");
    const resultsCounter = document.getElementById("resultsCounter");

    const searchInput = document.getElementById("searchInput");
    const eventFilter = document.getElementById("eventFilter");
    const roleFilter = document.getElementById("roleFilter");

    const totalEvents = document.getElementById("totalEvents");
    const usersInvolved = document.getElementById("usersInvolved");
    const assetsInvolved = document.getElementById("assetsInvolved");
    const integrityChecks = document.getElementById("integrityChecks");

    const drawerOverlay = document.getElementById("drawerOverlay");
    const auditDrawer = document.getElementById("auditDrawer");
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
    const drawerIntegrityStatus = document.getElementById(
        "drawerIntegrityStatus"
    );
    const drawerHash = document.getElementById("drawerHash");

    const profile = document.getElementById("profile");
    const profileButton = document.getElementById("profileButton");
    const profileLogout = document.getElementById("profileLogout");

    const notificationButton = document.getElementById("notificationButton");

    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const closeLogoutButtons = document.querySelectorAll(
        "[data-close-logout]"
    );

    /* =========================================================
       UTILIDADES
       ========================================================= */

    function escapeHTML(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function getEventClass(eventType) {
        const classes = {
            Acceso: "event-access",
            Carga: "event-upload",
            Modificación: "event-modification",
            Revisión: "event-review",
            Observación: "event-observation",
            Aprobación: "event-approval",
            Integridad: "event-integrity"
        };

        return classes[eventType] || "event-access";
    }

    function getResultClass(result) {
        const successResults = [
            "Aprobado",
            "Verificado",
            "Permitido"
        ];

        if (successResults.includes(result)) {
            return "result-success";
        }

        if (result === "Requiere atención") {
            return "result-warning";
        }

        return "result-info";
    }

    function getEventIcon(eventType) {
        const icons = {
            Acceso: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path d="M10 17l5-5-5-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path d="M15 12H3"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"/>
                </svg>
            `,

            Carga: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 16V4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"/>
                    <path d="M7.5 8.5L12 4l4.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"/>
                </svg>
            `,

            Modificación: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path d="M13.5 6.5l4 4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"/>
                </svg>
            `,

            Revisión: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 3h10l4 4v14H5z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"/>
                    <path d="M15 3v5h5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"/>
                    <path d="M8 14l2.2 2.2L16 10.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
            `,

            Observación: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path d="M8 9h8M8 13h5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"/>
                </svg>
            `,

            Aprobación: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3l8 3v5c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"/>
                    <path d="M8.5 12l2.2 2.2 4.8-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
            `,

            Integridad: `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3l8 3v5c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"/>
                    <path d="M9 12l2 2 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
            `
        };

        return icons[eventType] || icons.Acceso;
    }

    function getUserIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"/>
                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"/>
            </svg>
        `;
    }

    function getDocumentIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h8l4 4v14H6z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linejoin="round"/>
                <path d="M14 3v5h5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linejoin="round"/>
                <path d="M9 13h6M9 17h4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"/>
            </svg>
        `;
    }

    function getEyeIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="2.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"/>
            </svg>
        `;
    }

    function getShieldIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l8 3v5c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"/>
                <path d="M8.5 12l2.2 2.2 4.8-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
        `;
    }

    function splitTime(time) {
        const match = String(time).match(
            /^(\d{1,2}:\d{2})\s*(a\.\s*m\.|p\.\s*m\.)$/i
        );

        if (!match) {
            return {
                clock: time,
                period: ""
            };
        }

        return {
            clock: match[1],
            period: match[2]
        };
    }

    function formatDateHeading(date) {
        const months = [
            "ENERO",
            "FEBRERO",
            "MARZO",
            "ABRIL",
            "MAYO",
            "JUNIO",
            "JULIO",
            "AGOSTO",
            "SEPTIEMBRE",
            "OCTUBRE",
            "NOVIEMBRE",
            "DICIEMBRE"
        ];

        const parts = String(date).split("/");

        if (parts.length !== 3) {
            return date;
        }

        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = parts[2];

        if (!months[month - 1]) {
            return date;
        }

        return `${String(day).padStart(2, "0")} ${months[month - 1]} ${year}`;
    }

    function getHashPreview(hash) {
        if (!hash) {
            return "";
        }

        if (hash.length <= 24) {
            return hash;
        }

        return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
    }

    /* =========================================================
       RESUMEN GENERAL
       ========================================================= */

    function renderSummary() {
        const uniqueUsers = new Set(
            auditRecords.map((record) => record.account)
        );

        const uniqueAssets = new Set(
            auditRecords.map((record) => record.assetCode)
        );

        const integrityRecords = auditRecords.filter(
            (record) => record.integrity
        );

        if (totalEvents) {
            totalEvents.textContent = auditRecords.length;
        }

        if (usersInvolved) {
            usersInvolved.textContent = uniqueUsers.size;
        }

        if (assetsInvolved) {
            assetsInvolved.textContent = uniqueAssets.size;
        }

        if (integrityChecks) {
            integrityChecks.textContent = integrityRecords.length;
        }
    }

    /* =========================================================
       FILTROS
       ========================================================= */

    function getFilteredRecords() {
        const search = normalizeText(
            searchInput ? searchInput.value : ""
        );

        const selectedEvent = eventFilter
            ? eventFilter.value
            : "all";

        const selectedRole = roleFilter
            ? roleFilter.value
            : "all";

        return auditRecords.filter((record) => {
            const searchableContent = normalizeText(
                [
                    record.id,
                    record.user,
                    record.role,
                    record.account,
                    record.eventType,
                    record.action,
                    record.asset,
                    record.assetCode,
                    record.version,
                    record.result,
                    record.description,
                    record.ip
                ].join(" ")
            );

            const matchesSearch =
                !search || searchableContent.includes(search);

            const matchesEvent =
                selectedEvent === "all" ||
                record.eventType === selectedEvent;

            const matchesRole =
                selectedRole === "all" ||
                record.role === selectedRole;

            return matchesSearch && matchesEvent && matchesRole;
        });
    }

    /* =========================================================
       TARJETA DE EVENTO
       ========================================================= */

    function createEventMarkup(record) {
        const time = splitTime(record.time);
        const eventClass = getEventClass(record.eventType);
        const resultClass = getResultClass(record.result);

        const integrityMarkup = record.integrity
            ? `
                <div class="integrity-highlight">
                    <div class="integrity-highlight-main">
                        <span class="integrity-highlight-icon">
                            ${getShieldIcon()}
                        </span>

                        <div>
                            <strong>Integridad verificada</strong>
                            <span>
                                Comprobación SHA-256 asociada a esta versión
                            </span>
                        </div>
                    </div>

                    <code class="integrity-hash-preview">
                        ${escapeHTML(getHashPreview(record.hash))}
                    </code>
                </div>
            `
            : "";

        return `
            <div class="timeline-event ${eventClass}">
                <div class="timeline-time">
                    <strong>${escapeHTML(time.clock)}</strong>
                    <span>${escapeHTML(time.period)}</span>
                </div>

                <div class="timeline-axis">
                    <span class="timeline-node"></span>
                </div>

                <article class="timeline-card">
                    <div class="event-card-header">
                        <div class="event-identity">
                            <div class="event-icon">
                                ${getEventIcon(record.eventType)}
                            </div>

                            <div class="event-heading">
                                <span class="event-type">
                                    ${escapeHTML(record.eventType)}
                                </span>

                                <h3>
                                    ${escapeHTML(record.asset)}
                                </h3>

                                <p>
                                    ${escapeHTML(record.description)}
                                </p>
                            </div>
                        </div>

                        <span class="event-version">
                            ${escapeHTML(record.version)}
                        </span>
                    </div>

                    ${integrityMarkup}

                    <div class="event-card-body">
                        <div class="event-detail">
                            <span class="event-detail-icon">
                                ${getUserIcon()}
                            </span>

                            <div class="event-detail-text">
                                <span>USUARIO</span>
                                <strong>
                                    ${escapeHTML(record.user)}
                                </strong>
                                <small>
                                    ${escapeHTML(record.role)}
                                </small>
                            </div>
                        </div>

                        <div class="event-detail">
                            <span class="event-detail-icon">
                                ${getDocumentIcon()}
                            </span>

                            <div class="event-detail-text">
                                <span>CÓDIGO</span>
                                <strong>
                                    ${escapeHTML(record.assetCode)}
                                </strong>
                                <small>
                                    ${escapeHTML(record.action)}
                                </small>
                            </div>
                        </div>

                        <div class="event-action">
                            <span class="event-result ${resultClass}">
                                ${escapeHTML(record.result)}
                            </span>

                            <button
                                type="button"
                                class="consult-button"
                                data-audit-id="${escapeHTML(record.id)}"
                                aria-label="Consultar ${escapeHTML(record.id)}"
                                style="margin-left: 8px;"
                            >
                                ${getEyeIcon()}
                                <span>Consultar</span>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    /* =========================================================
       LÍNEA DE TIEMPO
       ========================================================= */

    function renderAuditTimeline() {
        if (!auditTimeline) {
            return;
        }

        const filteredRecords = getFilteredRecords();

        if (resultsCounter) {
            resultsCounter.textContent =
                filteredRecords.length === 1
                    ? "1 registro"
                    : `${filteredRecords.length} registros`;
        }

        if (filteredRecords.length === 0) {
            auditTimeline.innerHTML = "";

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;
        }

        if (emptyState) {
            emptyState.hidden = true;
        }

        const groupedRecords = new Map();

        filteredRecords.forEach((record) => {
            if (!groupedRecords.has(record.date)) {
                groupedRecords.set(record.date, []);
            }

            groupedRecords.get(record.date).push(record);
        });

        let markup = "";

        groupedRecords.forEach((records, date) => {
            markup += `
                <section class="timeline-day">
                    <div class="timeline-date">
                        <span>${escapeHTML(formatDateHeading(date))}</span>
                    </div>

                    <div class="timeline-day-events">
                        ${records
                            .map((record) =>
                                createEventMarkup(record)
                            )
                            .join("")}
                    </div>
                </section>
            `;
        });

        auditTimeline.innerHTML = markup;

        attachAuditButtons();
    }

    /* =========================================================
       DRAWER DE CONSULTA
       ========================================================= */

    function findAuditRecord(id) {
        return auditRecords.find(
            (record) => record.id === id
        );
    }

    function openDrawer(record) {
        if (!record || !auditDrawer || !drawerOverlay) {
            return;
        }

        if (drawerEventType) {
            drawerEventType.textContent = record.eventType;
        }

        if (drawerEventId) {
            drawerEventId.textContent = record.id;
        }

        if (drawerResult) {
            drawerResult.textContent = record.result;

            drawerResult.classList.remove(
                "result-success",
                "result-warning",
                "result-info"
            );

            drawerResult.classList.add(
                getResultClass(record.result)
            );
        }

        if (drawerUser) {
            drawerUser.textContent = record.user;
        }

        if (drawerRole) {
            drawerRole.textContent = record.role;
        }

        if (drawerAccount) {
            drawerAccount.textContent = record.account;
        }

        if (drawerActionLabel) {
            drawerActionLabel.textContent = record.action;
        }

        if (drawerDescription) {
            drawerDescription.textContent = record.description;
        }

        if (drawerAsset) {
            drawerAsset.textContent = record.asset;
        }

        if (drawerAssetCode) {
            drawerAssetCode.textContent = record.assetCode;
        }

        if (drawerVersion) {
            drawerVersion.textContent = record.version;
        }

        if (drawerDate) {
            drawerDate.textContent =
                `${record.date} · ${record.time}`;
        }

        if (drawerTraceId) {
            drawerTraceId.textContent = record.id;
        }

        if (drawerIp) {
            drawerIp.textContent = record.ip;
        }

        if (integritySection) {
            integritySection.hidden = !record.integrity;
        }

        if (record.integrity) {
            if (drawerIntegrityStatus) {
                drawerIntegrityStatus.textContent =
                    "Integridad verificada";
            }

            if (drawerHash) {
                drawerHash.textContent = record.hash;
            }
        } else {
            if (drawerIntegrityStatus) {
                drawerIntegrityStatus.textContent =
                    "Sin verificación asociada";
            }

            if (drawerHash) {
                drawerHash.textContent = "No disponible";
            }
        }

        drawerOverlay.classList.add("active");
        auditDrawer.classList.add("active");

        drawerOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        auditDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("locked");
    }

    function closeDrawer() {
        if (drawerOverlay) {
            drawerOverlay.classList.remove("active");
            drawerOverlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        if (auditDrawer) {
            auditDrawer.classList.remove("active");
            auditDrawer.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        document.body.classList.remove("locked");
    }

    function attachAuditButtons() {
        const buttons = document.querySelectorAll(
            "[data-audit-id]"
        );

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.dataset.auditId;
                const record = findAuditRecord(id);

                if (record) {
                    openDrawer(record);
                }
            });
        });
    }

    /* =========================================================
       PERFIL
       ========================================================= */

    function closeProfile() {
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

    if (profileButton && profile) {
        profileButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen =
                profile.classList.toggle("open");

            profileButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    document.addEventListener("click", (event) => {
        if (
            profile &&
            !profile.contains(event.target)
        ) {
            closeProfile();
        }
    });

    /* =========================================================
       NOTIFICACIONES
       ========================================================= */

    if (notificationButton) {
        notificationButton.addEventListener(
            "click",
            () => {
                window.location.href =
                    "alertasAuditor.html";
            }
        );
    }

    /* =========================================================
       MODAL DE CIERRE DE SESIÓN
       ========================================================= */

    function openLogoutModal() {
        if (!logoutModal) {
            return;
        }

        closeProfile();

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
            !auditDrawer ||
            !auditDrawer.classList.contains("active")
        ) {
            document.body.classList.remove("locked");
        }
    }

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
            () => {
                window.location.href = "login.html";
            }
        );
    }

    /* =========================================================
       EVENTOS DEL DRAWER
       ========================================================= */

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

    /* =========================================================
       EVENTOS DE FILTROS
       ========================================================= */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            renderAuditTimeline
        );
    }

    if (eventFilter) {
        eventFilter.addEventListener(
            "change",
            renderAuditTimeline
        );
    }

    if (roleFilter) {
        roleFilter.addEventListener(
            "change",
            renderAuditTimeline
        );
    }

    /* =========================================================
       TECLADO
       ========================================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (
            auditDrawer &&
            auditDrawer.classList.contains("active")
        ) {
            closeDrawer();
        }

        if (
            logoutModal &&
            logoutModal.classList.contains("active")
        ) {
            closeLogoutModal();
        }

        closeProfile();
    });

    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    renderSummary();
    renderAuditTimeline();
});