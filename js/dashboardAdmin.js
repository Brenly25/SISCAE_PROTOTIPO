document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("menuButton");

    const mobileOverlay =
        document.getElementById("mobileOverlay");

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const logoutModal =
        document.getElementById("logoutModal");

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const profileLogout =
        document.getElementById("profileLogout");

    const confirmLogout =
        document.getElementById("confirmLogout");

    const currentDate =
        document.getElementById("currentDate");


    /* =====================================================
       FECHA ACTUAL
    ====================================================== */

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


    /* =====================================================
       MENÚ MOBILE
    ====================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (mobileOverlay) {
            mobileOverlay.classList.add("active");
        }

        document.body.classList.add("locked");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (mobileOverlay) {
            mobileOverlay.classList.remove("active");
        }

        document.body.classList.remove("locked");
    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                if (
                    sidebar.classList.contains("open")
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );
    }


    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    /* =====================================================
       CERRAR SIDEBAR AL NAVEGAR
    ====================================================== */

    const navItems =
        document.querySelectorAll(
            ".sidebar-nav .nav-item"
        );

    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 950
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =====================================================
       PERFIL
    ====================================================== */

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


    /* =====================================================
       CERRAR PERFIL AL HACER CLICK FUERA
    ====================================================== */

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


    /* =====================================================
       NOTIFICACIONES
    ====================================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "alertas.html";

            }
        );

    }


    /* =====================================================
       MODAL CERRAR SESIÓN
    ====================================================== */

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


    if (sidebarLogout) {

        sidebarLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    /* =====================================================
       CERRAR MODAL
    ====================================================== */

    const closeModalButtons =
        document.querySelectorAll(
            "[data-close-modal]"
        );

    closeModalButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                closeLogoutModal
            );

        }
    );


    /* =====================================================
       CONFIRMAR CIERRE
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


            if (
                sidebar &&
                sidebar.classList.contains(
                    "open"
                ) &&
                window.innerWidth <= 950
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 950
            ) {

                closeSidebar();

            }

        }
    );

});