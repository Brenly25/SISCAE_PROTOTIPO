document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       DETECTAR UBICACIÓN
    ===================================================== */

    const isInsidePages =
        window.location.pathname.includes("/pages/");

    const basePath =
        isInsidePages ? "../" : "";


    /* =====================================================
       HEADER
    ===================================================== */

    const headerContainer =
        document.getElementById("header-component");

    if (headerContainer) {

        try {

            const response =
                await fetch(
                    `${basePath}components/navbar_home.html`
                );

            if (!response.ok) {
                throw new Error(
                    "No se pudo cargar el header."
                );
            }

            const html =
                await response.text();

            headerContainer.innerHTML = html;


            /* =============================================
               RUTAS DEL HEADER
            ============================================= */

            const logo =
                headerContainer.querySelector(
                    ".header__brand"
                );

            const logoImage =
                headerContainer.querySelector(
                    ".header__brand img"
                );

            const loginButton =
                headerContainer.querySelector(
                    ".nav__login"
                );


            if (logo) {
                logo.href =
                    `${basePath}index.html#inicio`;
            }

            if (logoImage) {
                logoImage.src =
                    `${basePath}assets/img/logo.png`;
            }

            if (loginButton) {
                loginButton.href =
                    `${basePath}pages/login.html`;
            }


            /* =============================================
               LINKS DE NAVEGACIÓN
            ============================================= */

            const navLinks =
                headerContainer.querySelectorAll(
                    ".nav__link"
                );


            if (navLinks[0]) {
                navLinks[0].href =
                    `${basePath}index.html#inicio`;
            }

            if (navLinks[1]) {
                navLinks[1].href =
                    `${basePath}index.html#acerca`;
            }

            if (navLinks[2]) {
                navLinks[2].href =
                    `${basePath}index.html#soporte`;
            }


            /* =============================================
               SECCIÓN ACTIVA DEL NAVBAR
            ============================================= */

            const isHomePage =
                !isInsidePages;


            if (isHomePage) {

                const sections = [
                    document.getElementById("inicio"),
                    document.getElementById("acerca"),
                    document.getElementById("soporte")
                ].filter(Boolean);


                function updateActiveSection() {

                    const scrollPosition =
                        window.scrollY + 160;

                    let currentSection = "inicio";


                    sections.forEach(section => {

                        if (
                            scrollPosition >=
                            section.offsetTop
                        ) {
                            currentSection =
                                section.id;
                        }

                    });


                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            href ===
                            `index.html#${currentSection}`
                        ) {
                            link.classList.add(
                                "active"
                            );
                        }

                    });

                }


                window.addEventListener(
                    "scroll",
                    updateActiveSection,
                    { passive: true }
                );

                updateActiveSection();

            }


            /* =============================================
               MENÚ MÓVIL
            ============================================= */

            const menuButton =
                headerContainer.querySelector(
                    "#menuButton"
                );

            const nav =
                headerContainer.querySelector(
                    "#nav"
                );


            if (menuButton && nav) {

                menuButton.addEventListener(
                    "click",
                    function () {

                        nav.classList.toggle(
                            "open"
                        );

                        const expanded =
                            menuButton.getAttribute(
                                "aria-expanded"
                            ) === "true";

                        menuButton.setAttribute(
                            "aria-expanded",
                            String(!expanded)
                        );

                    }
                );


                /* CERRAR AL SELECCIONAR */

                navLinks.forEach(link => {

                    link.addEventListener(
                        "click",
                        function () {

                            nav.classList.remove(
                                "open"
                            );

                            menuButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }
                    );

                });

            }

        } catch (error) {

            console.error(
                "Error cargando el header:",
                error
            );

        }

    }


    /* =====================================================
       NAVBAR LOGIN
    ===================================================== */

    const loginHeaderContainer =
        document.getElementById(
            "login-header-component"
        );


    if (loginHeaderContainer) {

        try {

            const response =
                await fetch(
                    `${basePath}components/navbar_login.html`
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar el navbar del login."
                );

            }


            const html =
                await response.text();

            loginHeaderContainer.innerHTML = html;


            /* =============================================
               LOGO
            ============================================= */

            const loginLogo =
                loginHeaderContainer.querySelector(
                    ".login-header__brand"
                );

            const loginLogoImage =
                loginHeaderContainer.querySelector(
                    ".login-header__brand img"
                );


            if (loginLogo) {

                loginLogo.href =
                    `${basePath}index.html#inicio`;

            }


            if (loginLogoImage) {

                loginLogoImage.src =
                    `${basePath}assets/img/logo.png`;

            }


            /* =============================================
               LINKS DEL NAVBAR
            ============================================= */

            const loginNavLinks =
                loginHeaderContainer.querySelectorAll(
                    ".login-nav__link"
                );


            if (loginNavLinks[0]) {

                loginNavLinks[0].href =
                    `${basePath}index.html#inicio`;

            }


            if (loginNavLinks[1]) {

                loginNavLinks[1].href =
                    `${basePath}index.html#acerca`;

            }


            if (loginNavLinks[2]) {

                loginNavLinks[2].href =
                    `${basePath}index.html#soporte`;

            }


            /* =============================================
               MENÚ MÓVIL
            ============================================= */

            const loginMenuButton =
                loginHeaderContainer.querySelector(
                    "#loginMenuButton"
                );

            const loginNav =
                loginHeaderContainer.querySelector(
                    "#loginNav"
                );


            if (
                loginMenuButton &&
                loginNav
            ) {

                loginMenuButton.addEventListener(
                    "click",
                    function () {

                        loginNav.classList.toggle(
                            "active"
                        );

                        loginMenuButton
                            .classList
                            .toggle(
                                "active"
                            );

                        const expanded =
                            loginMenuButton
                                .getAttribute(
                                    "aria-expanded"
                                ) === "true";

                        loginMenuButton
                            .setAttribute(
                                "aria-expanded",
                                String(!expanded)
                            );

                    }
                );


                /* CERRAR AL SELECCIONAR */

                loginNavLinks.forEach(link => {

                    link.addEventListener(
                        "click",
                        function () {

                            loginNav
                                .classList
                                .remove(
                                    "active"
                                );

                            loginMenuButton
                                .classList
                                .remove(
                                    "active"
                                );

                            loginMenuButton
                                .setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                        }
                    );

                });

            }

        } catch (error) {

            console.error(
                "Error cargando navbar del login:",
                error
            );

        }

    }


    /* =====================================================
       FOOTER
    ===================================================== */

    const footerContainer =
        document.getElementById(
            "footer-component"
        );


    if (footerContainer) {

        try {

            const response =
                await fetch(
                    `${basePath}components/footer_home.txt`
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar el footer."
                );

            }


            const html =
                await response.text();

            footerContainer.innerHTML = html;


            /* =============================================
               LOGO FOOTER
            ============================================= */

            const footerLogo =
                footerContainer.querySelector(
                    ".footer__brand img"
                );


            if (footerLogo) {

                footerLogo.src =
                    `${basePath}assets/img/logo.png`;

            }


            /* =============================================
               BOTÓN VOLVER ARRIBA
            ============================================= */

            const topButton =
                footerContainer.querySelector(
                    ".footer__top"
                );


            if (topButton) {

                topButton.href = "#top";

            }

        } catch (error) {

            console.error(
                "Error cargando el footer:",
                error
            );

        }

    }

});


/* =========================================================
   SISCAE - SISTEMA DE SIDEBARS
========================================================= */


/* =========================================================
   FUNCIÓN BASE
========================================================= */

async function loadSidebar(config) {

    const sidebarContainer =
        document.getElementById(
            "sidebar-component"
        );


    if (!sidebarContainer) {
        return;
    }


    try {

        /* =============================================
           CARGAR COMPONENTE
        ============================================= */

        const response =
            await fetch(
                `../components/${config.file}`
            );


        if (!response.ok) {

            throw new Error(
                `No se pudo cargar el sidebar. Error ${response.status}`
            );

        }


        const html =
            await response.text();

        sidebarContainer.innerHTML = html;


        /* =============================================
           SIDEBAR
        ============================================= */

        const sidebar =
            sidebarContainer.querySelector(
                "#sidebar"
            );


        /* =============================================
           LOGO
        ============================================= */

        const sidebarLogo =
            sidebarContainer.querySelector(
                "#sidebarLogo"
            );

        const sidebarLogoLink =
            sidebarContainer.querySelector(
                "#sidebarLogoLink"
            );


        if (sidebarLogo) {

            sidebarLogo.src =
                "../assets/img/logo.png";

        }


        if (sidebarLogoLink) {

            sidebarLogoLink.href =
                config.home;

        }


        /* =============================================
           ENLACES
        ============================================= */

        const sidebarLinks =
            sidebarContainer.querySelectorAll(
                "[data-page]"
            );


        sidebarLinks.forEach(link => {

            link.href =
                link.dataset.page;

        });


        /* =============================================
           PÁGINA ACTIVA
        ============================================= */

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        sidebarLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.page === currentPage
            );

        });


        /* =============================================
           ELEMENTOS MÓVILES
        ============================================= */

        const menuButton =
            document.getElementById(
                "menuButton"
            );

        const mobileOverlay =
            document.getElementById(
                "mobileOverlay"
            );


        /* =============================================
           ABRIR SIDEBAR
        ============================================= */

        function openSidebar() {

            if (!sidebar) {
                return;
            }

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


        /* =============================================
           CERRAR SIDEBAR
        ============================================= */

        function closeSidebar() {

            if (!sidebar) {
                return;
            }


            sidebar.classList.remove(
                "open"
            );


            if (mobileOverlay) {

                mobileOverlay.classList.remove(
                    "active"
                );

            }


            /*
               No quitamos locked si hay un modal
               o drawer abierto en la página.
            */

            const modalOpen =
                document.querySelector(
                    ".modal.active"
                );

            const drawerOpen =
                document.querySelector(
                    ".detail-drawer.active, .alert-drawer.active"
                );


            if (
                !modalOpen &&
                !drawerOpen
            ) {

                document.body.classList.remove(
                    "locked"
                );

            }

        }


        /* =============================================
           BOTÓN MÓVIL
        ============================================= */

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


        /* =============================================
           OVERLAY
        ============================================= */

        if (mobileOverlay) {

            mobileOverlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* =============================================
           CERRAR AL NAVEGAR EN MÓVIL
        ============================================= */

        const navItems =
            sidebarContainer.querySelectorAll(
                ".sidebar-link, .sidebar-footer-link[data-page]"
            );


        navItems.forEach(item => {

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


        /* =============================================
           ESCAPE
        ============================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
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


        /* =============================================
           RESIZE
        ============================================= */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 950 &&
                    sidebar &&
                    sidebar.classList.contains(
                        "open"
                    )
                ) {

                    closeSidebar();

                }

            }
        );


        console.log(
            `${config.role} cargado correctamente`
        );


    } catch (error) {

        console.error(
            `Error cargando ${config.role}:`,
            error
        );

    }

}


/* =========================================================
   SIDEBAR ADMINISTRADOR
========================================================= */

async function loadAdminSidebar() {

    await loadSidebar({

        file:
            "sidebar_admin.txt",

        role:
            "Sidebar Administrador",

        home:
            "dashboardAdmin.html"

    });

}


/* =========================================================
   SIDEBAR AUDITOR
========================================================= */

async function loadAuditorSidebar() {

    await loadSidebar({

        file:
            "sidebar_auditor.txt",

        role:
            "Sidebar Auditor",

        home:
            "dashboardAuditor.html"

    });

}