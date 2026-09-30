/* =====================================================
   INICIAR DASHBOARD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* =================================================
           CARGAR SIDEBAR ADMIN
        ================================================= */

        const sidebarContainer =
            document.getElementById(
                "sidebar-component"
            );

        if (sidebarContainer) {

            try {

                const response =
                    await fetch(
                        "../components/sidebar_admin.txt"
                    );

                if (!response.ok) {

                    throw new Error(
                        `No se pudo cargar el sidebar. Error ${response.status}`
                    );

                }

                const html =
                    await response.text();

                sidebarContainer.innerHTML =
                    html;


                /* =========================================
                   LOGO
                ========================================= */

                const sidebarLogo =
                    document.getElementById(
                        "sidebarLogo"
                    );

                if (sidebarLogo) {

                    sidebarLogo.src =
                        "../assets/img/logo.png";

                }


                /* =========================================
                   ENLACES
                ========================================= */

                const sidebarLinks =
                    sidebarContainer.querySelectorAll(
                        "[data-page]"
                    );

                sidebarLinks.forEach(
                    link => {

                        link.href =
                            link.dataset.page;

                    }
                );


                /* =========================================
                   PÁGINA ACTIVA
                ========================================= */

                const currentPage =
                    window.location.pathname
                        .split("/")
                        .pop();

                sidebarLinks.forEach(
                    link => {

                        link.classList.toggle(
                            "active",
                            link.dataset.page ===
                                currentPage
                        );

                    }
                );


                console.log(
                    "Sidebar cargado correctamente"
                );

            } catch (error) {

                console.error(
                    "Error cargando sidebar:",
                    error
                );

            }

        }


        /* =================================================
           INICIAR FUNCIONES DEL DASHBOARD
        ================================================= */

        initDashboard();

    }
);


/* =====================================================
   DASHBOARD
===================================================== */

function initDashboard() {

    /* =================================================
       ELEMENTOS DEL DASHBOARD
    ================================================= */

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const mobileOverlay =
        document.getElementById(
            "mobileOverlay"
        );

    const sidebarLogout =
        document.getElementById(
            "sidebarLogout"
        );

    const profile =
        document.getElementById(
            "profile"
        );

    const profileButton =
        document.getElementById(
            "profileButton"
        );

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const logoutModal =
        document.getElementById(
            "logoutModal"
        );

    const profileLogout =
        document.getElementById(
            "profileLogout"
        );

    const confirmLogout =
        document.getElementById(
            "confirmLogout"
        );

    const currentDate =
        document.getElementById(
            "currentDate"
        );


    /* =================================================
       FECHA ACTUAL
    ================================================= */

    if (currentDate) {

        const today =
            new Date();

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
       ABRIR SIDEBAR
    ================================================= */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add(
            "open"
        );

        if (mobileOverlay) {

            mobileOverlay.classList.add(
                "active"
            );

        }

        document.body.classList.add(
            "locked"
        );

    }


    /* =================================================
       CERRAR SIDEBAR
    ================================================= */

    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove(
            "open"
        );

        if (mobileOverlay) {

            mobileOverlay.classList.remove(
                "active"
            );

        }

        document.body.classList.remove(
            "locked"
        );

    }


    /* =================================================
       BOTÓN HAMBURGUESA
    ================================================= */

    if (
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                if (
                    sidebar.classList.contains(
                        "open"
                    )
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    /* =================================================
       OVERLAY SIDEBAR
    ================================================= */

    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =================================================
       CERRAR SIDEBAR AL NAVEGAR
    ================================================= */

    if (sidebar) {

        const navItems =
            sidebar.querySelectorAll(
                ".nav-item"
            );

        navItems.forEach(
            item => {

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

            }
        );

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


    /* =================================================
       RESIZE
    ================================================= */

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

}