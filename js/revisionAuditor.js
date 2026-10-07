/* =========================================================
   SISCAE
   REVISIÓN - AUDITOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DATOS SIMULADOS
    ===================================================== */

    const reviews = [

        {
            id: 1,
            name: "Libro de Ciencias Naturales",
            code: "ACT-001",
            type: "Material editorial",
            version: "v3.2",
            responsible: "Ana Martínez",
            initials: "AM",
            date: "01/10/2026 · 8:42 a. m.",
            status: "En revisión",

            history: [

                {
                    action: "Contenido registrado",
                    date: "29/09/2026 · 9:15 a. m.",
                    description:
                        "Se incorporó la versión inicial del contenido al flujo editorial."
                },

                {
                    action: "Nueva versión registrada",
                    date: "30/09/2026 · 2:20 p. m.",
                    description:
                        "La responsable registró una nueva versión del material."
                },

                {
                    action: "Revisión iniciada",
                    date: "01/10/2026 · 8:42 a. m.",
                    description:
                        "El contenido ingresó a la etapa de revisión."
                }

            ]

        },


        {
            id: 2,
            name: "Guía de Matemática",
            code: "ACT-002",
            type: "Documento",
            version: "v2.1",
            responsible: "Carlos Hernández",
            initials: "CH",
            date: "01/10/2026 · 8:26 a. m.",
            status: "Con observaciones",

            history: [

                {
                    action: "Contenido registrado",
                    date: "28/09/2026 · 10:30 a. m.",
                    description:
                        "El documento fue incorporado al flujo editorial."
                },

                {
                    action: "Revisión realizada",
                    date: "30/09/2026 · 11:10 a. m.",
                    description:
                        "Se completó la revisión correspondiente a la versión actual."
                },

                {
                    action: "Observaciones registradas",
                    date: "01/10/2026 · 8:26 a. m.",
                    description:
                        "Se registraron observaciones relacionadas con el contenido."
                }

            ]

        },


        {
            id: 3,
            name: "Material de Lenguaje",
            code: "ACT-003",
            type: "Material editorial",
            version: "v4.0",
            responsible: "María López",
            initials: "ML",
            date: "01/10/2026 · 8:12 a. m.",
            status: "Pendiente de aprobación",

            history: [

                {
                    action: "Contenido registrado",
                    date: "26/09/2026 · 1:45 p. m.",
                    description:
                        "El material fue incorporado al sistema."
                },

                {
                    action: "Revisión completada",
                    date: "29/09/2026 · 9:32 a. m.",
                    description:
                        "La etapa de revisión fue completada."
                },

                {
                    action: "Observaciones atendidas",
                    date: "30/09/2026 · 3:18 p. m.",
                    description:
                        "Se registró una nueva versión con las observaciones atendidas."
                },

                {
                    action: "Enviado a aprobación",
                    date: "01/10/2026 · 8:12 a. m.",
                    description:
                        "El contenido quedó pendiente de decisión dentro del flujo editorial."
                }

            ]

        },


        {
            id: 4,
            name: "Infografía del Sistema Solar",
            code: "ACT-004",
            type: "Imagen",
            version: "v1.4",
            responsible: "José Ramírez",
            initials: "JR",
            date: "30/09/2026 · 4:35 p. m.",
            status: "En revisión",

            history: [

                {
                    action: "Contenido registrado",
                    date: "29/09/2026 · 11:25 a. m.",
                    description:
                        "La imagen fue incorporada al proyecto editorial."
                },

                {
                    action: "Versión actualizada",
                    date: "30/09/2026 · 10:40 a. m.",
                    description:
                        "Se registró una nueva versión del recurso gráfico."
                },

                {
                    action: "Revisión iniciada",
                    date: "30/09/2026 · 4:35 p. m.",
                    description:
                        "El recurso gráfico ingresó a revisión."
                }

            ]

        },


        {
            id: 5,
            name: "Video introductorio de Ciencias",
            code: "ACT-005",
            type: "Video",
            version: "v2.0",
            responsible: "Daniela Flores",
            initials: "DF",
            date: "30/09/2026 · 3:18 p. m.",
            status: "Con observaciones",

            history: [

                {
                    action: "Contenido registrado",
                    date: "27/09/2026 · 8:55 a. m.",
                    description:
                        "El recurso audiovisual fue incorporado al flujo editorial."
                },

                {
                    action: "Revisión realizada",
                    date: "29/09/2026 · 2:16 p. m.",
                    description:
                        "Se realizó la revisión de la versión registrada."
                },

                {
                    action: "Observaciones registradas",
                    date: "30/09/2026 · 3:18 p. m.",
                    description:
                        "Se agregaron observaciones al recurso audiovisual."
                }

            ]

        },


        {
            id: 6,
            name: "Cuaderno de Estudios Sociales",
            code: "ACT-006",
            type: "Documento",
            version: "v3.5",
            responsible: "Sofía Castillo",
            initials: "SC",
            date: "30/09/2026 · 1:07 p. m.",
            status: "Pendiente de aprobación",

            history: [

                {
                    action: "Contenido registrado",
                    date: "25/09/2026 · 9:20 a. m.",
                    description:
                        "El documento fue incorporado al sistema."
                },

                {
                    action: "Revisión completada",
                    date: "28/09/2026 · 11:45 a. m.",
                    description:
                        "La revisión correspondiente fue completada."
                },

                {
                    action: "Nueva versión registrada",
                    date: "29/09/2026 · 3:12 p. m.",
                    description:
                        "Se incorporaron los cambios solicitados."
                },

                {
                    action: "Enviado a aprobación",
                    date: "30/09/2026 · 1:07 p. m.",
                    description:
                        "El contenido quedó pendiente de aprobación."
                }

            ]

        },


        {
            id: 7,
            name: "Ilustraciones de Primer Grado",
            code: "ACT-007",
            type: "Imagen",
            version: "v1.8",
            responsible: "Luis Mendoza",
            initials: "LM",
            date: "30/09/2026 · 11:50 a. m.",
            status: "En revisión",

            history: [

                {
                    action: "Contenido registrado",
                    date: "28/09/2026 · 8:14 a. m.",
                    description:
                        "El conjunto de ilustraciones fue registrado."
                },

                {
                    action: "Versión actualizada",
                    date: "29/09/2026 · 4:28 p. m.",
                    description:
                        "Se registraron modificaciones en las ilustraciones."
                },

                {
                    action: "Revisión iniciada",
                    date: "30/09/2026 · 11:50 a. m.",
                    description:
                        "Las ilustraciones ingresaron a revisión."
                }

            ]

        },


        {
            id: 8,
            name: "Guía metodológica docente",
            code: "ACT-008",
            type: "Documento",
            version: "v2.7",
            responsible: "Andrea Torres",
            initials: "AT",
            date: "30/09/2026 · 10:22 a. m.",
            status: "En revisión",

            history: [

                {
                    action: "Contenido registrado",
                    date: "27/09/2026 · 1:30 p. m.",
                    description:
                        "La guía fue incorporada al flujo editorial."
                },

                {
                    action: "Nueva versión registrada",
                    date: "29/09/2026 · 9:05 a. m.",
                    description:
                        "Se actualizó el documento con una nueva versión."
                },

                {
                    action: "Revisión iniciada",
                    date: "30/09/2026 · 10:22 a. m.",
                    description:
                        "La guía ingresó al proceso de revisión."
                }

            ]

        }

    ];


    /* =====================================================
       ELEMENTOS PRINCIPALES
    ===================================================== */

    const reviewTableBody =
        document.getElementById(
            "reviewTableBody"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const resultsCounter =
        document.getElementById(
            "resultsCounter"
        );


    /* =====================================================
       CONTADORES
    ===================================================== */

    const reviewCount =
        document.getElementById(
            "reviewCount"
        );


    const observedCount =
        document.getElementById(
            "observedCount"
        );


    const pendingCount =
        document.getElementById(
            "pendingCount"
        );


    const notificationCount =
        document.getElementById(
            "notificationCount"
        );


    /* =====================================================
       FILTROS
    ===================================================== */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    const clearFilters =
        document.getElementById(
            "clearFilters"
        );


    /* =====================================================
       DRAWER
    ===================================================== */

    const reviewDrawer =
        document.getElementById(
            "reviewDrawer"
        );


    const drawerOverlay =
        document.getElementById(
            "drawerOverlay"
        );


    const closeDrawerButton =
        document.getElementById(
            "closeDrawer"
        );


    const drawerContentName =
        document.getElementById(
            "drawerContentName"
        );


    const drawerContentType =
        document.getElementById(
            "drawerContentType"
        );


    const drawerStatus =
        document.getElementById(
            "drawerStatus"
        );


    const drawerVersion =
        document.getElementById(
            "drawerVersion"
        );


    const drawerResponsible =
        document.getElementById(
            "drawerResponsible"
        );


    const drawerDate =
        document.getElementById(
            "drawerDate"
        );


    const drawerType =
        document.getElementById(
            "drawerType"
        );


    const drawerHistory =
        document.getElementById(
            "drawerHistory"
        );


    const progressUpload =
        document.getElementById(
            "progressUpload"
        );


    const progressReview =
        document.getElementById(
            "progressReview"
        );


    const progressObservation =
        document.getElementById(
            "progressObservation"
        );


    const progressApproval =
        document.getElementById(
            "progressApproval"
        );


    /* =====================================================
       ICONOS
    ===================================================== */

    function getFileIcon(type) {

        switch (type) {


            /* =============================================
               IMAGEN
            ============================================= */

            case "Imagen":

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="16"
                            rx="2"
                        ></rect>

                        <circle
                            cx="8.5"
                            cy="9"
                            r="1.5"
                        ></circle>

                        <polyline
                            points="21 15 16 10 5 20"
                        ></polyline>
                    </svg>
                `;


            /* =============================================
               VIDEO
            ============================================= */

            case "Video":

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <rect
                            x="3"
                            y="5"
                            width="14"
                            height="14"
                            rx="2"
                        ></rect>

                        <polygon
                            points="10 9 14 12 10 15 10 9"
                        ></polygon>

                        <path
                            d="M17 10l4-2v8l-4-2"
                        ></path>
                    </svg>
                `;


            /* =============================================
               DOCUMENTO / MATERIAL EDITORIAL
            ============================================= */

            default:

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        ></path>

                        <polyline
                            points="14 2 14 8 20 8"
                        ></polyline>

                        <line
                            x1="8"
                            y1="13"
                            x2="16"
                            y2="13"
                        ></line>

                        <line
                            x1="8"
                            y1="17"
                            x2="14"
                            y2="17"
                        ></line>
                    </svg>
                `;

        }

    }


    /* =====================================================
       ICONO DEL BOTÓN VER
    ===================================================== */

    function getViewIcon() {

        return `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                ></path>

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                ></circle>
            </svg>
        `;

    }


    /* =====================================================
       NORMALIZAR TEXTO
    ===================================================== */

    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }


    /* =====================================================
       CLASE SEGÚN ESTADO
    ===================================================== */

    function getStatusClass(status) {

        switch (status) {

            case "En revisión":

                return "status-review";


            case "Con observaciones":

                return "status-observation";


            case "Pendiente de aprobación":

                return "status-pending";


            default:

                return "";

        }

    }


    /* =====================================================
       CONTADORES SUPERIORES
    ===================================================== */

    function loadSummary() {

        const reviewing =
            reviews.filter(
                review =>
                    review.status ===
                    "En revisión"
            ).length;


        const observed =
            reviews.filter(
                review =>
                    review.status ===
                    "Con observaciones"
            ).length;


        const pending =
            reviews.filter(
                review =>
                    review.status ===
                    "Pendiente de aprobación"
            ).length;


        if (reviewCount) {

            reviewCount.textContent =
                reviewing;

        }


        if (observedCount) {

            observedCount.textContent =
                observed;

        }


        if (pendingCount) {

            pendingCount.textContent =
                pending;

        }


        if (notificationCount) {

            notificationCount.textContent =
                "3";

        }

    }


    /* =====================================================
       CREAR FILA
    ===================================================== */

    function createReviewRow(review) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>

                <div class="content-cell">

                    <span class="content-icon">

                        ${getFileIcon(review.type)}

                    </span>


                    <div class="content-info">

                        <strong title="${review.name}">
                            ${review.name}
                        </strong>

                        <span>
                            ${review.code}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${review.type}
            </td>


            <td>

                <span class="version-badge">
                    ${review.version}
                </span>

            </td>


            <td>

                <div class="responsible-cell">

                    <span class="responsible-avatar">
                        ${review.initials}
                    </span>

                    <span>
                        ${review.responsible}
                    </span>

                </div>

            </td>


            <td>
                ${review.date}
            </td>


            <td>

                <span
                    class="status-badge ${getStatusClass(review.status)}"
                >
                    ${review.status}
                </span>

            </td>


            <td class="action-column">

                <button
                    class="view-review-button"
                    type="button"
                    data-review-id="${review.id}"
                >

                    ${getViewIcon()}

                    Ver revisión

                </button>

            </td>

        `;


        return row;

    }


    /* =====================================================
       MOSTRAR REGISTROS
    ===================================================== */

    function renderReviews(data) {

        if (!reviewTableBody) {

            return;

        }


        reviewTableBody.innerHTML =
            "";


        data.forEach(review => {

            reviewTableBody.appendChild(
                createReviewRow(review)
            );

        });


        /* =================================================
           RESULTADOS
        ================================================= */

        if (resultsCounter) {

            resultsCounter.textContent =
                data.length === 1
                    ? "1 registro"
                    : `${data.length} registros`;

        }


        /* =================================================
           ESTADO VACÍO
        ================================================= */

        if (emptyState) {

            emptyState.hidden =
                data.length !== 0;

        }


        const table =
            document.querySelector(
                ".review-table"
            );


        if (table) {

            table.style.display =
                data.length === 0
                    ? "none"
                    : "table";

        }


        /* =================================================
           BOTONES VER
        ================================================= */

        const viewButtons =
            reviewTableBody.querySelectorAll(
                "[data-review-id]"
            );


        viewButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.reviewId
                        );


                    const review =
                        reviews.find(
                            item =>
                                item.id === id
                        );


                    if (review) {

                        openReviewDrawer(
                            review
                        );

                    }

                }
            );

        });

    }


    /* =====================================================
       FILTRAR REGISTROS
    ===================================================== */

    function filterReviews() {

        const search =
            normalizeText(
                searchInput
                    ? searchInput.value
                    : ""
            );


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";


        const selectedType =
            typeFilter
                ? typeFilter.value
                : "all";


        const filtered =
            reviews.filter(review => {


                /* =========================================
                   BÚSQUEDA
                ========================================= */

                const searchable =
                    normalizeText(
                        `
                            ${review.name}
                            ${review.code}
                            ${review.type}
                            ${review.version}
                            ${review.responsible}
                            ${review.status}
                        `
                    );


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                /* =========================================
                   ESTADO
                ========================================= */

                const matchesStatus =
                    selectedStatus === "all" ||
                    review.status ===
                        selectedStatus;


                /* =========================================
                   TIPO
                ========================================= */

                const matchesType =
                    selectedType === "all" ||
                    review.type ===
                        selectedType;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesType
                );

            });


        renderReviews(
            filtered
        );

    }


    /* =====================================================
       EVENTOS DE FILTROS
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterReviews
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterReviews
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            filterReviews
        );

    }


    /* =====================================================
       LIMPIAR FILTROS
    ===================================================== */

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (statusFilter) {

                    statusFilter.value =
                        "all";

                }


                if (typeFilter) {

                    typeFilter.value =
                        "all";

                }


                filterReviews();


                if (searchInput) {

                    searchInput.focus();

                }

            }
        );

    }


    /* =====================================================
       CONFIGURAR PROGRESO
    ===================================================== */

    function setProgress(status) {

        const steps = [

            progressUpload,

            progressReview,

            progressObservation,

            progressApproval

        ];


        steps.forEach(step => {

            if (step) {

                step.classList.remove(
                    "completed"
                );

            }

        });


        /* =================================================
           REGISTRO SIEMPRE COMPLETADO
        ================================================= */

        if (progressUpload) {

            progressUpload.classList.add(
                "completed"
            );

        }


        /* =================================================
           EN REVISIÓN
        ================================================= */

        if (
            status ===
            "En revisión"
        ) {

            if (progressReview) {

                progressReview.classList.add(
                    "completed"
                );

            }

        }


        /* =================================================
           CON OBSERVACIONES
        ================================================= */

        if (
            status ===
            "Con observaciones"
        ) {

            if (progressReview) {

                progressReview.classList.add(
                    "completed"
                );

            }


            if (progressObservation) {

                progressObservation.classList.add(
                    "completed"
                );

            }

        }


        /* =================================================
           PENDIENTE DE APROBACIÓN
        ================================================= */

        if (
            status ===
            "Pendiente de aprobación"
        ) {

            if (progressReview) {

                progressReview.classList.add(
                    "completed"
                );

            }


            if (progressObservation) {

                progressObservation.classList.add(
                    "completed"
                );

            }


            /*
               La aprobación todavía NO se marca
               como completada porque está pendiente.
            */

        }

    }


    /* =====================================================
       HISTORIAL
    ===================================================== */

    function renderHistory(history) {

        if (!drawerHistory) {

            return;

        }


        drawerHistory.innerHTML =
            "";


        history.forEach(item => {

            const historyItem =
                document.createElement(
                    "article"
                );


            historyItem.className =
                "history-item";


            historyItem.innerHTML = `

                <div class="history-item-top">

                    <strong>
                        ${item.action}
                    </strong>

                    <time>
                        ${item.date}
                    </time>

                </div>


                <p>
                    ${item.description}
                </p>

            `;


            drawerHistory.appendChild(
                historyItem
            );

        });

    }


    /* =====================================================
       ABRIR DRAWER
    ===================================================== */

    function openReviewDrawer(review) {

        if (
            !reviewDrawer ||
            !drawerOverlay
        ) {

            return;

        }


        /* =================================================
           INFORMACIÓN PRINCIPAL
        ================================================= */

        if (drawerContentName) {

            drawerContentName.textContent =
                review.name;

        }


        if (drawerContentType) {

            drawerContentType.textContent =
                `${review.type} · ${review.code}`;

        }


        /* =================================================
           ESTADO
        ================================================= */

        if (drawerStatus) {

            drawerStatus.textContent =
                review.status;


            drawerStatus.className =
                `status-badge ${getStatusClass(review.status)}`;

        }


        /* =================================================
           DETALLES
        ================================================= */

        if (drawerVersion) {

            drawerVersion.textContent =
                review.version;

        }


        if (drawerResponsible) {

            drawerResponsible.textContent =
                review.responsible;

        }


        if (drawerDate) {

            drawerDate.textContent =
                review.date;

        }


        if (drawerType) {

            drawerType.textContent =
                review.type;

        }


        /* =================================================
           PROGRESO
        ================================================= */

        setProgress(
            review.status
        );


        /* =================================================
           HISTORIAL
        ================================================= */

        renderHistory(
            review.history
        );


        /* =================================================
           MOSTRAR
        ================================================= */

        reviewDrawer.classList.add(
            "active"
        );


        drawerOverlay.classList.add(
            "active"
        );


        reviewDrawer.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "locked"
        );

    }


    /* =====================================================
       CERRAR DRAWER
    ===================================================== */

    function closeReviewDrawer() {

        if (
            !reviewDrawer ||
            !drawerOverlay
        ) {

            return;

        }


        reviewDrawer.classList.remove(
            "active"
        );


        drawerOverlay.classList.remove(
            "active"
        );


        reviewDrawer.setAttribute(
            "aria-hidden",
            "true"
        );


        const modalOpen =
            document.querySelector(
                ".modal.active"
            );


        const sidebarOpen =
            document.querySelector(
                ".sidebar.open"
            );


        if (
            !modalOpen &&
            !sidebarOpen
        ) {

            document.body.classList.remove(
                "locked"
            );

        }

    }


    /* =====================================================
       EVENTOS DRAWER
    ===================================================== */

    if (closeDrawerButton) {

        closeDrawerButton.addEventListener(
            "click",
            closeReviewDrawer
        );

    }


    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            "click",
            closeReviewDrawer
        );

    }


    /* =====================================================
       PERFIL
    ===================================================== */

    const profile =
        document.getElementById(
            "profile"
        );


    const profileButton =
        document.getElementById(
            "profileButton"
        );


    const profileLogout =
        document.getElementById(
            "profileLogout"
        );


    function closeProfileMenu() {

        if (!profile) {

            return;

        }


        profile.classList.remove(
            "open"
        );


        if (profileButton) {

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    if (
        profile &&
        profileButton
    ) {

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
                    isOpen
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* =====================================================
       CERRAR PERFIL AL HACER CLIC FUERA
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (!profile) {

                return;

            }


            if (
                !profile.contains(
                    event.target
                )
            ) {

                closeProfileMenu();

            }

        }
    );


    /* =====================================================
       MODAL DE CIERRE DE SESIÓN
    ===================================================== */

    const logoutModal =
        document.getElementById(
            "logoutModal"
        );


    const confirmLogout =
        document.getElementById(
            "confirmLogout"
        );


    const closeLogoutButtons =
        document.querySelectorAll(
            "[data-close-logout]"
        );


    function openLogoutModal() {

        if (!logoutModal) {

            return;

        }


        closeProfileMenu();


        logoutModal.classList.add(
            "active"
        );


        logoutModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "locked"
        );

    }


    function closeLogoutModal() {

        if (!logoutModal) {

            return;

        }


        logoutModal.classList.remove(
            "active"
        );


        logoutModal.setAttribute(
            "aria-hidden",
            "true"
        );


        const drawerOpen =
            reviewDrawer &&
            reviewDrawer.classList.contains(
                "active"
            );


        const sidebarOpen =
            document.querySelector(
                ".sidebar.open"
            );


        if (
            !drawerOpen &&
            !sidebarOpen
        ) {

            document.body.classList.remove(
                "locked"
            );

        }

    }


    /* =====================================================
       ABRIR MODAL DESDE PERFIL
    ===================================================== */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    /* =====================================================
       CERRAR MODAL
    ===================================================== */

    closeLogoutButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                closeLogoutModal
            );

        }
    );


    /* =====================================================
       CONFIRMAR CIERRE DE SESIÓN
    ===================================================== */

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
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            /* PERFIL */

            closeProfileMenu();


            /* DRAWER */

            if (
                reviewDrawer &&
                reviewDrawer.classList.contains(
                    "active"
                )
            ) {

                closeReviewDrawer();

                return;

            }


            /* MODAL */

            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

            }

        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    loadSummary();

    renderReviews(
        reviews
    );


});