/* =========================================================
   SISCAE
   COMPONENTES GENERALES
========================================================= */


/* =========================================================
   COMPONENTES PÚBLICOS
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {


    /* =====================================================
       DETECTAR UBICACIÓN
    ===================================================== */

    const isInsidePages =
        window.location.pathname.includes("/pages/");

    const basePath =
        isInsidePages ? "../" : "";


    /* =====================================================
       HEADER PÚBLICO
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
               LOGO
            ============================================= */

            const logo =
                headerContainer.querySelector(
                    ".header__brand"
                );


            const logoImage =
                headerContainer.querySelector(
                    ".header__brand img"
                );


            if (logo) {

                logo.href =
                    `${basePath}index.html#inicio`;

            }


            if (logoImage) {

                logoImage.src =
                    `${basePath}assets/img/logo.png`;

            }


            /* =============================================
               BOTÓN LOGIN
            ============================================= */

            const loginButton =
                headerContainer.querySelector(
                    ".nav__login"
                );


            if (loginButton) {

                loginButton.href =
                    `${basePath}pages/login.html`;

            }


            /* =============================================
               LINKS DEL NAVBAR
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
               SECCIÓN ACTIVA
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


                    let currentSection =
                        "inicio";


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
                    {
                        passive: true
                    }
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


            if (
                menuButton &&
                nav
            ) {

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


                /* =========================================
                   CERRAR AL SELECCIONAR
                ========================================= */

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


            loginHeaderContainer.innerHTML =
                html;


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


                /* =========================================
                   CERRAR AL SELECCIONAR
                ========================================= */

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


            footerContainer.innerHTML =
                html;


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
               VOLVER ARRIBA
            ============================================= */

            const topButton =
                footerContainer.querySelector(
                    ".footer__top"
                );


            if (topButton) {

                topButton.href =
                    "#top";

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
   SISCAE
   SISTEMA GENERAL DE SIDEBARS
========================================================= */


/* =========================================================
   FUNCIÓN BASE
========================================================= */

async function loadSidebar(config) {


    /* =====================================================
       VALIDAR CONFIGURACIÓN
    ===================================================== */

    if (
        !config ||
        typeof config !== "object" ||
        !config.file
    ) {

        console.error(
            "Configuración de sidebar inválida."
        );

        return;

    }


    /* =====================================================
       CONTENEDOR
    ===================================================== */

    const sidebarContainer =
        document.getElementById(
            "sidebar-component"
        );


    if (!sidebarContainer) {

        console.error(
            "No se encontró #sidebar-component."
        );

        return;

    }


    try {


        /* =================================================
           CARGAR ARCHIVO DEL SIDEBAR
        ================================================= */

        const response =
            await fetch(
                `../components/${config.file}`
            );


        if (!response.ok) {

            throw new Error(
                `No se pudo cargar ${config.file}. Error ${response.status}`
            );

        }


        const html =
            await response.text();


        sidebarContainer.innerHTML =
            html;


        /* =================================================
           OBTENER SIDEBAR
        ================================================= */

        const sidebar =
            sidebarContainer.querySelector(
                "#sidebar"
            );


        if (!sidebar) {

            throw new Error(
                `El archivo ${config.file} no contiene un elemento con id="sidebar".`
            );

        }


        /* =================================================
           LOGO
        ================================================= */

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
                config.home || "#";

        }


        /* =================================================
           ENLACES DEL SIDEBAR
        ================================================= */

        const sidebarLinks =
            sidebarContainer.querySelectorAll(
                "[data-page]"
            );


        sidebarLinks.forEach(link => {

            const page =
                link.dataset.page;


            if (page) {

                link.href =
                    page;

            }

        });


        /* =================================================
           PÁGINA ACTUAL
        ================================================= */

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        const currentHash =
            window.location.hash
                .replace("#", "");


        /* =================================================
           MARCAR OPCIÓN ACTIVA
        ================================================= */

        function updateActiveLink() {

            sidebarLinks.forEach(link => {

                const target =
                    link.dataset.page || "";


                const parts =
                    target.split("#");


                const page =
                    parts[0];


                const hash =
                    parts[1] || "";


                let active =
                    false;


                /* =========================================
                   PÁGINA DIFERENTE
                ========================================= */

                if (
                    page === currentPage &&
                    !hash
                ) {

                    active =
                        true;

                }


                /* =========================================
                   MISMA PÁGINA + SECCIÓN
                ========================================= */

                if (
                    page === currentPage &&
                    hash &&
                    hash === currentHash
                ) {

                    active =
                        true;

                }


                link.classList.toggle(
                    "active",
                    active
                );

            });

        }


        updateActiveLink();


        /* =================================================
           SOPORTE PARA SECCIONES DE LA MISMA PÁGINA
        ================================================= */

        const sectionLinks =
            Array.from(
                sidebarLinks
            ).filter(link => {

                const target =
                    link.dataset.page || "";


                const parts =
                    target.split("#");


                return (
                    parts[0] === currentPage &&
                    parts[1]
                );

            });


        const sections =
            sectionLinks
                .map(link => {

                    const target =
                        link.dataset.page || "";


                    const hash =
                        target.split("#")[1];


                    return document.getElementById(
                        hash
                    );

                })
                .filter(Boolean);


        if (sections.length > 0) {

            function updateSectionFromScroll() {

                const marker =
                    window.scrollY + 160;


                let activeSection =
                    sections[0].id;


                sections.forEach(section => {

                    const sectionTop =
                        section
                            .getBoundingClientRect()
                            .top +
                        window.scrollY;


                    if (
                        marker >=
                        sectionTop
                    ) {

                        activeSection =
                            section.id;

                    }

                });


                const atBottom =
                    window.innerHeight +
                    window.scrollY >=
                    document.documentElement
                        .scrollHeight - 4;


                if (atBottom) {

                    activeSection =
                        sections[
                            sections.length - 1
                        ].id;

                }


                sectionLinks.forEach(link => {

                    const target =
                        link.dataset.page || "";


                    const hash =
                        target.split("#")[1];


                    link.classList.toggle(
                        "active",
                        hash === activeSection
                    );

                });

            }


            window.addEventListener(
                "scroll",
                updateSectionFromScroll,
                {
                    passive: true
                }
            );


            updateSectionFromScroll();

        }


        /* =================================================
           ELEMENTOS MÓVILES
        ================================================= */

        const menuButton =
            document.getElementById(
                "menuButton"
            );


        const mobileOverlay =
            document.getElementById(
                "mobileOverlay"
            );


        /* =================================================
           ABRIR SIDEBAR
        ================================================= */

        function openSidebar() {

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

            sidebar.classList.remove(
                "open"
            );


            if (mobileOverlay) {

                mobileOverlay.classList.remove(
                    "active"
                );

            }


            /*
               No quitar locked si existe
               un modal o drawer abierto.
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


        /* =================================================
           BOTÓN MENÚ MÓVIL
        ================================================= */

        if (menuButton) {

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
           OVERLAY
        ================================================= */

        if (mobileOverlay) {

            mobileOverlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* =================================================
           CERRAR AL NAVEGAR EN MÓVIL
        ================================================= */

        const navItems =
            sidebarContainer.querySelectorAll(
                ".sidebar-link, .sidebar-footer-link[data-page], .nav-item[data-page]"
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


        /* =================================================
           ESCAPE
        ================================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
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
                    window.innerWidth > 950 &&
                    sidebar.classList.contains(
                        "open"
                    )
                ) {

                    closeSidebar();

                }

            }
        );


        /* =================================================
           LOG
        ================================================= */

        console.log(
            `${config.role || "Sidebar"} cargado correctamente`
        );


    } catch (error) {

        console.error(
            `Error cargando ${config.role || config.file}:`,
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
   SIDEBAR REVISOR
========================================================= */

async function loadRevisorSidebar() {

    await loadSidebar({

        file:
            "sidebar_revisor.txt",

        role:
            "Sidebar Revisor",

        home:
            "dashboardRevisor.html"

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