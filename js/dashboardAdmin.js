document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOpen =
        document.getElementById("sidebarOpen");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    const userMenu =
        document.querySelector(".user-menu");

    const userMenuButton =
        document.getElementById("userMenuButton");


    const logoutButton =
        document.getElementById("logoutButton");

    const dropdownLogout =
        document.getElementById("dropdownLogout");

    const logoutModal =
        document.getElementById("logoutModal");

    const cancelLogout =
        document.getElementById("cancelLogout");

    const confirmLogout =
        document.getElementById("confirmLogout");


    const currentDate =
        document.getElementById("currentDate");


    /* =====================================================
       FECHA ACTUAL
    ====================================================== */

    function showCurrentDate() {

        if (!currentDate) {
            return;
        }

        const today =
            new Date();


        const formattedDate =
            new Intl.DateTimeFormat(
                "es-SV",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(today);


        currentDate.textContent =
            formattedDate
                .charAt(0)
                .toUpperCase() +
            formattedDate.slice(1);

    }


    showCurrentDate();


    /* =====================================================
       SIDEBAR MOBILE
    ====================================================== */

    function openSidebar() {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add(
            "active"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "no-scroll"
        );

    }


    if (sidebarOpen) {

        sidebarOpen.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =====================================================
       USER DROPDOWN
    ====================================================== */

    if (
        userMenu &&
        userMenuButton
    ) {

        userMenuButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                userMenu.classList.toggle(
                    "open"
                );

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !userMenu.contains(
                        event.target
                    )
                ) {

                    userMenu.classList.remove(
                        "open"
                    );

                }

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

        logoutModal.classList.add(
            "active"
        );

        logoutModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "no-scroll"
        );


        if (userMenu) {

            userMenu.classList.remove(
                "open"
            );

        }

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

        document.body.classList.remove(
            "no-scroll"
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (dropdownLogout) {

        dropdownLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (cancelLogout) {

        cancelLogout.addEventListener(
            "click",
            closeLogoutModal
        );

    }


    const modalBackdrop =
        logoutModal
            ?.querySelector(
                ".modal__backdrop"
            );


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeLogoutModal
        );

    }


    /* =====================================================
       CONFIRMAR CIERRE DE SESIÓN

       Como este es un prototipo, simplemente regresamos
       al login. Cuando conecten Firebase Auth, aquí se
       sustituirá por signOut().
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
       ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeSidebar();

            closeLogoutModal();


            if (userMenu) {

                userMenu.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =====================================================
       SIDEBAR LINKS

       Por ahora las demás vistas todavía no existen.
       Dejamos el dashboard navegable únicamente hacia
       las secciones presentes en esta demostración.
    ====================================================== */

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar__link"
        );


    sidebarLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <=
                    900
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =====================================================
       NOTIFICACIONES

       En este dashboard de demostración, al tocar la
       campana llevamos al bloque de alertas.
    ====================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                const alertsPanel =
                    document.querySelector(
                        ".panel--alerts"
                    );


                if (alertsPanel) {

                    alertsPanel.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }


    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );

});