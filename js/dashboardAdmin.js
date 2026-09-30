/* =====================================================
   SISCAE - DASHBOARD ADMINISTRADOR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* Primero carga el componente reutilizable */
        await loadAdminSidebar();

        /* Después inicia lo propio del dashboard */
        initDashboard();

    }
);


/* =====================================================
   DASHBOARD
===================================================== */

function initDashboard() {

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const logoutModal =
        document.getElementById("logoutModal");

    const profileLogout =
        document.getElementById("profileLogout");

    const confirmLogout =
        document.getElementById("confirmLogout");

    const currentDate =
        document.getElementById("currentDate");


    /* =================================================
       FECHA ACTUAL
    ================================================= */

    if (currentDate) {

        const today = new Date();

        const formattedDate =
            new Intl.DateTimeFormat(
                "es-SV",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(today);

        currentDate.textContent =
            formattedDate;

    }


    /* =================================================
       PERFIL
    ================================================= */

    if (
        profile &&
        profileButton
    ) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profile.classList.toggle(
                    "open"
                );

            }
        );

    }


    /* =================================================
       CERRAR PERFIL AL HACER CLICK FUERA
    ================================================= */

    document.addEventListener(
        "click",
        (event) => {

            if (!profile) return;

            if (
                !profile.contains(
                    event.target
                )
            ) {

                profile.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =================================================
       NOTIFICACIONES
    ================================================= */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "alertas.html";

            }
        );

    }


    /* =================================================
       MODAL CERRAR SESIÓN
    ================================================= */

    function openLogoutModal() {

        if (!logoutModal) return;

        logoutModal.classList.add(
            "active"
        );

        document.body.classList.add(
            "locked"
        );

        if (profile) {

            profile.classList.remove(
                "open"
            );

        }

    }


    function closeLogoutModal() {

        if (!logoutModal) return;

        logoutModal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "locked"
        );

    }


    /* =================================================
       LOGOUT DESDE SIDEBAR
    ================================================= */

    if (sidebarLogout) {

        sidebarLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    /* =================================================
       LOGOUT DESDE PERFIL
    ================================================= */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    /* =================================================
       CERRAR MODAL
    ================================================= */

    const closeModalButtons =
        document.querySelectorAll(
            "[data-close-modal]"
        );

    closeModalButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                closeLogoutModal
            );

        }
    );


    /* =================================================
       CONFIRMAR CIERRE DE SESIÓN
    ================================================= */

    if (confirmLogout) {

        confirmLogout.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html";

            }
        );

    }


    /* =================================================
       TECLA ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

            }

            if (
                profile &&
                profile.classList.contains(
                    "open"
                )
            ) {

                profile.classList.remove(
                    "open"
                );

            }

        }
    );

}