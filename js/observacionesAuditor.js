/* =========================================================
   SISCAE - OBSERVACIONES AUDITOR
   observacionesAuditor.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS SIMULADOS
    ====================================================== */

    const observations = [
        {
            id: 1,
            code: "ACT-2026-041",
            content: "Libro de Ciencias 7.º",
            version: "v3.2",
            type: "Contenido",
            registeredBy: "Laura Hernández",
            initials: "LH",
            date: "06/10/2026",
            time: "09:42 a. m.",
            status: "Pendiente",
            observation:
                "Se identificó una inconsistencia entre el contenido de la unidad 3 y la versión previamente revisada. Se solicita verificar el apartado antes de continuar con el flujo editorial.",
            followUp: {
                state: "Pendiente",
                title: "Pendiente de atención",
                date: "Sin fecha de atención",
                description:
                    "La observación permanece abierta y todavía no registra una respuesta o corrección asociada."
            }
        },
        {
            id: 2,
            code: "ACT-2026-038",
            content: "Guía de Matemática 6.º",
            version: "v2.1",
            type: "Formato",
            registeredBy: "Carlos Martínez",
            initials: "CM",
            date: "05/10/2026",
            time: "02:18 p. m.",
            status: "Atendida",
            observation:
                "Se detectaron diferencias en la numeración de páginas y en la estructura de dos actividades. Se solicitó ajustar el formato antes de continuar con la aprobación.",
            followUp: {
                state: "Atendida",
                title: "Observación atendida",
                date: "06/10/2026 · 08:35 a. m.",
                description:
                    "El Autor / Editor registró una nueva versión con los ajustes solicitados y la atención quedó registrada en el flujo."
            }
        },
        {
            id: 3,
            code: "ACT-2026-036",
            content: "Material de Lenguaje 5.º",
            version: "v4.0",
            type: "Diseño",
            registeredBy: "Ana Rodríguez",
            initials: "AR",
            date: "05/10/2026",
            time: "11:06 a. m.",
            status: "Pendiente",
            observation:
                "La portada utilizada en esta versión no corresponde con la línea gráfica definida para el material. Se requiere verificar el diseño registrado.",
            followUp: {
                state: "Pendiente",
                title: "Pendiente de atención",
                date: "Sin fecha de atención",
                description:
                    "No se ha registrado una nueva versión que responda a la observación realizada."
            }
        },
        {
            id: 4,
            code: "ACT-2026-032",
            content: "Cuaderno de Estudios Sociales 4.º",
            version: "v1.8",
            type: "Contenido",
            registeredBy: "José Ramírez",
            initials: "JR",
            date: "04/10/2026",
            time: "03:27 p. m.",
            status: "Atendida",
            observation:
                "Se solicitó verificar una referencia incluida en el bloque de actividades de la unidad 2 antes de continuar con la aprobación del contenido.",
            followUp: {
                state: "Atendida",
                title: "Observación atendida",
                date: "05/10/2026 · 10:14 a. m.",
                description:
                    "La referencia fue actualizada en la versión correspondiente y el seguimiento quedó registrado."
            }
        },
        {
            id: 5,
            code: "ACT-2026-029",
            content: "Guía Docente de Ciencias 8.º",
            version: "v2.4",
            type: "Técnica",
            registeredBy: "María López",
            initials: "ML",
            date: "03/10/2026",
            time: "01:51 p. m.",
            status: "Pendiente",
            observation:
                "El archivo asociado presenta diferencias con los metadatos registrados para la versión actual. Se requiere comprobar la versión antes de continuar.",
            followUp: {
                state: "Pendiente",
                title: "Verificación pendiente",
                date: "Sin fecha de atención",
                description:
                    "La observación continúa abierta y no registra una actualización posterior."
            }
        },
        {
            id: 6,
            code: "ACT-2026-025",
            content: "Libro de Matemática 9.º",
            version: "v3.5",
            type: "Formato",
            registeredBy: "Daniel Pérez",
            initials: "DP",
            date: "02/10/2026",
            time: "08:29 a. m.",
            status: "Atendida",
            observation:
                "Se identificaron elementos gráficos fuera de los márgenes establecidos en varias páginas del documento.",
            followUp: {
                state: "Atendida",
                title: "Observación atendida",
                date: "03/10/2026 · 09:46 a. m.",
                description:
                    "Los elementos señalados fueron corregidos y quedó registrada una versión posterior del contenido."
            }
        },
        {
            id: 7,
            code: "ACT-2026-021",
            content: "Material Educativo de Inglés 6.º",
            version: "v1.6",
            type: "Contenido",
            registeredBy: "Sofía Castillo",
            initials: "SC",
            date: "01/10/2026",
            time: "04:03 p. m.",
            status: "Atendida",
            observation:
                "Se solicitó corregir una instrucción incluida en una actividad para mantener coherencia con el contenido de la unidad.",
            followUp: {
                state: "Atendida",
                title: "Observación atendida",
                date: "02/10/2026 · 11:20 a. m.",
                description:
                    "La instrucción fue corregida y la atención de la observación quedó registrada en el historial."
            }
        },
        {
            id: 8,
            code: "ACT-2026-018",
            content: "Guía de Lenguaje 3.º",
            version: "v2.0",
            type: "Diseño",
            registeredBy: "Miguel Flores",
            initials: "MF",
            date: "30/09/2026",
            time: "10:32 a. m.",
            status: "Pendiente",
            observation:
                "Se observó una diferencia en el tamaño de varios elementos visuales con respecto al diseño definido para la guía.",
            followUp: {
                state: "Pendiente",
                title: "Pendiente de atención",
                date: "Sin fecha de atención",
                description:
                    "Aún no existe registro de una corrección o nueva versión vinculada con esta observación."
            }
        }
    ];


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const tableBody = document.getElementById("observationsTableBody");
    const observationsTable = document.querySelector(".observations-table");
    const emptyState = document.getElementById("emptyState");
    const resultsCounter = document.getElementById("resultsCounter");

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const typeFilter = document.getElementById("typeFilter");

    const totalObservations = document.getElementById("totalObservations");
    const pendingObservations = document.getElementById("pendingObservations");
    const resolvedObservations = document.getElementById("resolvedObservations");

    const observationDrawer = document.getElementById("observationDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const closeDrawerButton = document.getElementById("closeDrawer");

    const drawerContentName = document.getElementById("drawerContentName");
    const drawerContentCode = document.getElementById("drawerContentCode");
    const drawerStatus = document.getElementById("drawerStatus");
    const drawerObservationType = document.getElementById("drawerObservationType");
    const drawerObservationText = document.getElementById("drawerObservationText");
    const drawerVersion = document.getElementById("drawerVersion");
    const drawerType = document.getElementById("drawerType");
    const drawerRegisteredBy = document.getElementById("drawerRegisteredBy");
    const drawerDate = document.getElementById("drawerDate");
    const drawerFollowUp = document.getElementById("drawerFollowUp");

    const profile = document.getElementById("profile");
    const profileButton = document.getElementById("profileButton");
    const profileLogout = document.getElementById("profileLogout");

    const notificationButton = document.getElementById("notificationButton");

    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const closeLogoutElements = document.querySelectorAll("[data-close-logout]");


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


    function getStatusClass(status) {
        return status === "Atendida"
            ? "status-resolved"
            : "status-pending";
    }


    function getRowClass(status) {
        return status === "Atendida"
            ? "row-resolved"
            : "row-pending";
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


    function eyeIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="2.5"></circle>
            </svg>
        `;
    }


    function checkIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
    }


    function clockIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
            </svg>
        `;
    }


    /* =====================================================
       RESUMEN
    ====================================================== */

    function loadSummary() {

        const total = observations.length;

        const pending = observations.filter(
            observation => observation.status === "Pendiente"
        ).length;

        const resolved = observations.filter(
            observation => observation.status === "Atendida"
        ).length;


        if (totalObservations) {
            totalObservations.textContent = total;
        }

        if (pendingObservations) {
            pendingObservations.textContent = pending;
        }

        if (resolvedObservations) {
            resolvedObservations.textContent = resolved;
        }
    }


    /* =====================================================
       FILTRADO
    ====================================================== */

    function getFilteredObservations() {

        const search = searchInput
            ? normalizeText(searchInput.value)
            : "";

        const status = statusFilter
            ? statusFilter.value
            : "all";

        const type = typeFilter
            ? typeFilter.value
            : "all";


        return observations.filter(observation => {

            const searchableText = normalizeText(`
                ${observation.content}
                ${observation.code}
                ${observation.version}
                ${observation.type}
                ${observation.registeredBy}
                ${observation.status}
                ${observation.observation}
            `);


            const matchesSearch =
                search === "" ||
                searchableText.includes(search);


            const matchesStatus =
                status === "all" ||
                observation.status === status;


            const matchesType =
                type === "all" ||
                observation.type === type;


            return (
                matchesSearch &&
                matchesStatus &&
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

        /*
         * En el nuevo diseño solamente mostramos
         * el número porque el texto "REGISTROS"
         * ya está en el HTML.
         */

        resultsCounter.textContent = count;
    }


    /* =====================================================
       CREAR FILA
    ====================================================== */

    function createObservationRow(observation) {

        const row = document.createElement("tr");

        row.classList.add(
            getRowClass(observation.status)
        );


        row.innerHTML = `

            <td>

                <div class="content-cell">

                    <span class="content-icon">
                        ${documentIcon()}
                    </span>

                    <div class="content-info">

                        <strong
                            title="${escapeHTML(observation.content)}"
                        >
                            ${escapeHTML(observation.content)}
                        </strong>

                        <span>
                            ${escapeHTML(observation.code)}
                        </span>

                    </div>

                </div>

            </td>


            <td>

                <span class="version-badge">
                    ${escapeHTML(observation.version)}
                </span>

            </td>


            <td>

                <span class="type-badge">
                    ${escapeHTML(observation.type)}
                </span>

            </td>


            <td>

                <div class="responsible-cell">

                    <span class="responsible-avatar">
                        ${escapeHTML(observation.initials)}
                    </span>

                    <span
                        title="${escapeHTML(observation.registeredBy)}"
                    >
                        ${escapeHTML(observation.registeredBy)}
                    </span>

                </div>

            </td>


            <td>
                ${escapeHTML(observation.date)}
            </td>


            <td>

                <span
                    class="status-badge ${getStatusClass(observation.status)}"
                >
                    ${escapeHTML(observation.status)}
                </span>

            </td>


            <td class="table-action">

                <button
                    class="view-observation-button"
                    type="button"
                    data-observation-id="${observation.id}"
                    aria-label="Consultar observación de ${escapeHTML(observation.content)}"
                >

                    ${eyeIcon()}

                    <span>Consultar</span>

                </button>

            </td>
        `;


        return row;
    }


    /* =====================================================
       RENDERIZAR REGISTROS
    ====================================================== */

    function renderObservations() {

        if (!tableBody) {
            return;
        }


        const filteredObservations =
            getFilteredObservations();


        tableBody.innerHTML = "";


        filteredObservations.forEach(observation => {

            tableBody.appendChild(
                createObservationRow(observation)
            );
        });


        updateResultsCounter(
            filteredObservations.length
        );


        if (observationsTable) {

            observationsTable.style.display =
                filteredObservations.length > 0
                    ? "table"
                    : "none";
        }


        if (emptyState) {

            emptyState.hidden =
                filteredObservations.length > 0;
        }
    }


    /* =====================================================
       FILTROS
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderObservations
        );
    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderObservations
        );
    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            renderObservations
        );
    }


    /* =====================================================
       SEGUIMIENTO DEL DRAWER
    ====================================================== */

    function renderFollowUp(observation) {

        if (!drawerFollowUp) {
            return;
        }


        const followUp = observation.followUp;

        const resolved =
            followUp.state === "Atendida";


        drawerFollowUp.innerHTML = `

            <div
                class="follow-up-item ${
                    resolved ? "resolved" : "pending"
                }"
            >

                <span class="follow-up-icon">

                    ${
                        resolved
                            ? checkIcon()
                            : clockIcon()
                    }

                </span>


                <strong>
                    ${escapeHTML(followUp.title)}
                </strong>


                <span>
                    ${escapeHTML(followUp.date)}
                </span>


                <p>
                    ${escapeHTML(followUp.description)}
                </p>

            </div>
        `;
    }


    /* =====================================================
       ABRIR DETALLE
    ====================================================== */

    function openObservationDrawer(observation) {

        if (!observationDrawer || !drawerOverlay) {
            return;
        }


        if (drawerContentName) {
            drawerContentName.textContent =
                observation.content;
        }


        if (drawerContentCode) {
            drawerContentCode.textContent =
                observation.code;
        }


        if (drawerStatus) {

            drawerStatus.textContent =
                observation.status;

            drawerStatus.className =
                `status-badge ${getStatusClass(observation.status)}`;
        }


        if (drawerObservationType) {
            drawerObservationType.textContent =
                observation.type;
        }


        if (drawerObservationText) {
            drawerObservationText.textContent =
                observation.observation;
        }


        if (drawerVersion) {
            drawerVersion.textContent =
                observation.version;
        }


        if (drawerType) {
            drawerType.textContent =
                observation.type;
        }


        if (drawerRegisteredBy) {
            drawerRegisteredBy.textContent =
                observation.registeredBy;
        }


        if (drawerDate) {
            drawerDate.textContent =
                `${observation.date} · ${observation.time}`;
        }


        renderFollowUp(observation);


        observationDrawer.classList.add("active");
        drawerOverlay.classList.add("active");

        observationDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("locked");
    }


    /* =====================================================
       CERRAR DETALLE
    ====================================================== */

    function closeObservationDrawer() {

        if (!observationDrawer || !drawerOverlay) {
            return;
        }


        observationDrawer.classList.remove("active");
        drawerOverlay.classList.remove("active");

        observationDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("locked");
    }


    /* =====================================================
       CLICK EN CONSULTAR
    ====================================================== */

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            event => {

                const button = event.target.closest(
                    "[data-observation-id]"
                );


                if (!button) {
                    return;
                }


                const observationId = Number(
                    button.dataset.observationId
                );


                const observation = observations.find(
                    item => item.id === observationId
                );


                if (!observation) {
                    return;
                }


                openObservationDrawer(observation);
            }
        );
    }


    /* =====================================================
       CIERRE DEL DRAWER
    ====================================================== */

    if (closeDrawerButton) {

        closeDrawerButton.addEventListener(
            "click",
            closeObservationDrawer
        );
    }


    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            "click",
            closeObservationDrawer
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
       MODAL CERRAR SESIÓN
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


    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );
    }


    /*
     * También permite utilizar el botón de cerrar sesión
     * que viene dentro del sidebar cargado dinámicamente.
     */
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


    closeLogoutElements.forEach(element => {

        element.addEventListener(
            "click",
            closeLogoutModal
        );
    });


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


            if (
                observationDrawer &&
                observationDrawer.classList.contains("active")
            ) {

                closeObservationDrawer();

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
    renderObservations();

});