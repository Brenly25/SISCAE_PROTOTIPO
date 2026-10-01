/* =========================================================
   SISCAE
   DASHBOARD AUDITOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DATOS SIMULADOS DEL DASHBOARD
    ====================================================== */

    const dashboardData = {

        review: 8,
        observations: 12,
        approvals: 6,
        alerts: 3,

        activity: [

            {
                type: "review",
                event: "Revisión registrada",
                user: "Ana Martínez",
                content: "Libro de Ciencias",
                date: "01/10/2026 · 8:42 a. m.",
                status: "Registrado"
            },

            {
                type: "observation",
                event: "Observación agregada",
                user: "Carlos Hernández",
                content: "Guía de Matemática",
                date: "01/10/2026 · 8:26 a. m.",
                status: "Registrado"
            },

            {
                type: "approval",
                event: "Estado de aprobación actualizado",
                user: "María López",
                content: "Material de Lenguaje",
                date: "01/10/2026 · 8:12 a. m.",
                status: "Aprobado"
            }

        ]

    };


    /* =====================================================
       CONTADORES
    ====================================================== */

    const reviewCount =
        document.getElementById("reviewCount");

    const observationCount =
        document.getElementById("observationCount");

    const approvalCount =
        document.getElementById("approvalCount");

    const alertsCount =
        document.getElementById("alertsCount");

    const notificationCount =
        document.getElementById("notificationCount");


    function loadSummary() {

        if (reviewCount) {
            reviewCount.textContent =
                dashboardData.review;
        }


        if (observationCount) {
            observationCount.textContent =
                dashboardData.observations;
        }


        if (approvalCount) {
            approvalCount.textContent =
                dashboardData.approvals;
        }


        if (alertsCount) {
            alertsCount.textContent =
                dashboardData.alerts;
        }


        if (notificationCount) {
            notificationCount.textContent =
                dashboardData.alerts;
        }

    }


    /* =====================================================
       TABLA DE ACTIVIDAD
    ====================================================== */

    const activityTableBody =
        document.getElementById("activityTableBody");


    /* =====================================================
       ICONOS DE ACTIVIDAD
    ====================================================== */

    function getActivityIcon(type) {

        switch (type) {


            /* ================= REVISIÓN ================= */

            case "review":

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

                        <polyline
                            points="9 15 11 17 15 13"
                        ></polyline>

                    </svg>
                `;


            /* ================= OBSERVACIÓN ================= */

            case "observation":

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >

                        <path
                            d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
                        ></path>

                        <line
                            x1="8"
                            y1="9"
                            x2="16"
                            y2="9"
                        ></line>

                        <line
                            x1="8"
                            y1="13"
                            x2="13"
                            y2="13"
                        ></line>

                    </svg>
                `;


            /* ================= APROBACIÓN ================= */

            case "approval":

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >

                        <path
                            d="M12 3l7 3v5c0 4.6-2.8 8.1-7 10-4.2-1.9-7-5.4-7-10V6l7-3z"
                        ></path>

                        <polyline
                            points="9 12 11 14 15 10"
                        ></polyline>

                    </svg>
                `;


            /* ================= AUDITORÍA ================= */

            case "audit":

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
                            x2="16"
                            y2="17"
                        ></line>

                    </svg>
                `;


            /* ================= ALERTA ================= */

            case "alert":

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >

                        <path
                            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                        ></path>

                        <path
                            d="M10 21h4"
                        ></path>

                    </svg>
                `;


            /* ================= GENERAL ================= */

            default:

                return `
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >

                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        ></circle>

                        <path
                            d="M12 8v4"
                        ></path>

                        <path
                            d="M12 16h.01"
                        ></path>

                    </svg>
                `;

        }

    }


    /* =====================================================
       CLASE DE ESTADO
    ====================================================== */

    function getStatusClass(status) {

        switch (status) {

            case "Aprobado":
                return "result-badge verified";

            case "Verificado":
                return "result-badge verified";

            default:
                return "result-badge";

        }

    }


    /* =====================================================
       MOSTRAR ACTIVIDAD RECIENTE
    ====================================================== */

    function loadRecentActivity() {

        if (!activityTableBody) {
            return;
        }


        activityTableBody.innerHTML = "";


        dashboardData.activity.forEach((activity) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="event-cell">

                        <span class="event-icon">

                            ${getActivityIcon(activity.type)}

                        </span>

                        <span>
                            ${activity.event}
                        </span>

                    </div>

                </td>


                <td>
                    ${activity.user}
                </td>


                <td>
                    ${activity.content}
                </td>


                <td>
                    ${activity.date}
                </td>


                <td>

                    <span class="${getStatusClass(activity.status)}">

                        ${activity.status}

                    </span>

                </td>

            `;


            activityTableBody.appendChild(row);

        });

    }


    /* =====================================================
       PERFIL SUPERIOR
    ====================================================== */

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const profileLogout =
        document.getElementById("profileLogout");


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

        profileButton.setAttribute(
            "aria-expanded",
            "false"
        );


        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const isOpen =
                    profile.classList.toggle("open");


                profileButton.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );

    }


    /* =====================================================
       CERRAR PERFIL AL HACER CLIC FUERA
    ====================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (!profile) {
                return;
            }


            if (!profile.contains(event.target)) {

                closeProfileMenu();

            }

        }
    );


    /* =====================================================
       MODAL CERRAR SESIÓN
    ====================================================== */

    const logoutModal =
        document.getElementById("logoutModal");

    const confirmLogout =
        document.getElementById("confirmLogout");

    const closeLogoutButtons =
        document.querySelectorAll(
            "[data-close-logout]"
        );


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


        const openSidebar =
            document.querySelector(
                ".sidebar.active, .sidebar.open"
            );


        if (!openSidebar) {

            document.body.classList.remove(
                "locked"
            );

        }

    }


    /* =====================================================
       CERRAR SESIÓN DESDE PERFIL
    ====================================================== */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            () => {

                openLogoutModal();

            }
        );

    }


    /* =====================================================
       CERRAR MODAL
    ====================================================== */

    closeLogoutButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    closeLogoutModal();

                }
            );

        }
    );


    /* =====================================================
       CONFIRMAR CIERRE DE SESIÓN
    ====================================================== */

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
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            closeProfileMenu();


            if (
                logoutModal &&
                logoutModal.classList.contains("active")
            ) {

                closeLogoutModal();

            }

        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ====================================================== */

    loadSummary();

    loadRecentActivity();

});