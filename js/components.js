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
                await fetch(`${basePath}components/navbar_home.html`);

            if (!response.ok) {
                throw new Error("No se pudo cargar el header.");
            }

            const html =
                await response.text();

            headerContainer.innerHTML = html;


            /* =================================================
               RUTAS DEL HEADER
            ================================================= */

            const logo =
                headerContainer.querySelector(".header__brand");

            const logoImage =
                headerContainer.querySelector(".header__brand img");

            const loginButton =
                headerContainer.querySelector(".nav__login");


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


            /* =================================================
               LINKS DE NAVEGACIÓN
            ================================================= */

            const navLinks =
                headerContainer.querySelectorAll(".nav__link");


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


            /* =================================================
               SECCIÓN ACTIVA DEL NAVBAR
            ================================================= */

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

                        link.classList.remove("active");

                        const href =
                            link.getAttribute("href");


                        if (
                            href ===
                            `index.html#${currentSection}`
                        ) {
                            link.classList.add("active");
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


            /* =================================================
               MENÚ MÓVIL
            ================================================= */

            const menuButton =
                headerContainer.querySelector("#menuButton");

            const nav =
                headerContainer.querySelector("#nav");


            if (menuButton && nav) {

                menuButton.addEventListener(
                    "click",
                    function () {

                        nav.classList.toggle("open");


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


                /* CERRAR MENÚ AL SELECCIONAR */

                navLinks.forEach(link => {

                    link.addEventListener(
                        "click",
                        function () {

                            nav.classList.remove("open");

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
       FOOTER
    ===================================================== */

    const footerContainer =
        document.getElementById("footer-component");

    if (footerContainer) {

        try {

            const response =
                await fetch(`${basePath}components/footer_home.txt`);

            if (!response.ok) {
                throw new Error("No se pudo cargar el footer.");
            }

            const html =
                await response.text();

            footerContainer.innerHTML = html;


            /* =================================================
               LOGO FOOTER
            ================================================= */

            const footerLogo =
                footerContainer.querySelector(
                    ".footer__brand img"
                );


            if (footerLogo) {

                footerLogo.src =
                    `${basePath}assets/img/logo.png`;

            }


            /* =================================================
               BOTÓN VOLVER ARRIBA
            ================================================= */

            const topButton =
                footerContainer.querySelector(".footer__top");


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


/* =====================================================
   SISCAE - SIDEBAR ADMIN
===================================================== */

async function loadAdminSidebar() {

    const sidebarContainer =
        document.getElementById("sidebar-component");

    if (!sidebarContainer) {
        return;
    }

    try {

        const response = await fetch(
            "../components/sidebar_admin.txt"
        );

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar el sidebar. Error ${response.status}`
            );
        }

        const html = await response.text();

        sidebarContainer.innerHTML = html;


        /* =============================================
           LOGO
        ============================================= */

        const sidebarLogo =
            document.getElementById("sidebarLogo");

        if (sidebarLogo) {
            sidebarLogo.src =
                "../assets/img/logo.png";
        }


        /* =============================================
           ENLACES
        ============================================= */

        const sidebarLinks =
            sidebarContainer.querySelectorAll(
                "[data-page]"
            );

        sidebarLinks.forEach(link => {
            link.href = link.dataset.page;
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
           FUNCIONALIDAD MÓVIL
        ============================================= */

        const sidebar =
            document.getElementById("sidebar");

        const menuButton =
            document.getElementById("menuButton");

        const mobileOverlay =
            document.getElementById("mobileOverlay");


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


        if (menuButton && sidebar) {

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


        /* CERRAR AL NAVEGAR EN MÓVIL */

        const navItems =
            sidebarContainer.querySelectorAll(
                ".nav-item"
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


        /* ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    sidebar &&
                    sidebar.classList.contains("open") &&
                    window.innerWidth <= 950
                ) {
                    closeSidebar();
                }

            }
        );


        /* RESIZE */

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


/* =====================================================
   SISCAE - SIDEBAR POR ROL (genérico)

   Carga cualquier sidebar de /components y le da el
   mismo comportamiento que el del admin: logo, enlaces,
   opción activa y menú móvil.

   Además soporta enlaces a secciones de la misma página
   (data-page="pagina.html#seccion"): la opción se marca
   activa según la sección visible al hacer scroll.

   Uso:  await loadSidebar("sidebar_revisor.txt");
===================================================== */

async function loadSidebar(componentFile) {

    const sidebarContainer =
        document.getElementById("sidebar-component");

    if (!sidebarContainer) {
        return;
    }

    try {

        const response = await fetch(
            `../components/${componentFile}`
        );

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar ${componentFile}. Error ${response.status}`
            );
        }

        sidebarContainer.innerHTML = await response.text();


        /* LOGO */

        const sidebarLogo =
            document.getElementById("sidebarLogo");

        if (sidebarLogo) {
            sidebarLogo.src = "../assets/img/logo.png";
        }


        /* ENLACES */

        const sidebarLinks =
            [...sidebarContainer.querySelectorAll("[data-page]")];

        sidebarLinks.forEach(link => {
            link.href = link.dataset.page;
        });

        const currentPage =
            window.location.pathname.split("/").pop();

        const samePageLinks = sidebarLinks.filter(link => {
            const [page] = link.dataset.page.split("#");
            return page === currentPage;
        });

        function setActive(hash) {

            samePageLinks.forEach(link => {

                const [, linkHash = ""] =
                    link.dataset.page.split("#");

                link.classList.toggle(
                    "active",
                    linkHash === hash
                );

            });

        }

        setActive(window.location.hash.replace("#", ""));


        /* OPCIÓN ACTIVA SEGÚN LA SECCIÓN VISIBLE */

        const sections = samePageLinks
            .map(link => link.dataset.page.split("#")[1])
            .filter(Boolean)
            .map(id => document.getElementById(id))
            .filter(Boolean);

        if (sections.length) {

            function updateFromScroll() {

                const marker = window.scrollY + 160;

                let current = "";

                sections.forEach(section => {

                    const top =
                        section.getBoundingClientRect().top +
                        window.scrollY;

                    if (marker >= top) {
                        current = section.id;
                    }

                });

                // Al llegar al final, la última sección puede no
                // alcanzar la parte superior: se marca igual
                const atBottom =
                    window.innerHeight + window.scrollY >=
                    document.documentElement.scrollHeight - 4;

                if (atBottom) {
                    current = sections[sections.length - 1].id;
                }

                setActive(current);
            }

            window.addEventListener(
                "scroll",
                updateFromScroll,
                { passive: true }
            );

            updateFromScroll();
        }


        /* MENÚ MÓVIL */

        const sidebar =
            document.getElementById("sidebar");

        const menuButton =
            document.getElementById("menuButton");

        const mobileOverlay =
            document.getElementById("mobileOverlay");

        function openSidebar() {
            sidebar?.classList.add("open");
            mobileOverlay?.classList.add("active");
            document.body.classList.add("locked");
        }

        function closeSidebar() {
            sidebar?.classList.remove("open");
            mobileOverlay?.classList.remove("active");
            document.body.classList.remove("locked");
        }

        menuButton?.addEventListener("click", () => {
            sidebar?.classList.contains("open")
                ? closeSidebar()
                : openSidebar();
        });

        mobileOverlay?.addEventListener("click", closeSidebar);

        sidebarLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 950) {
                    closeSidebar();
                }
            });
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                sidebar?.classList.contains("open") &&
                window.innerWidth <= 950
            ) {
                closeSidebar();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 950) {
                closeSidebar();
            }
        });

    } catch (error) {

        console.error(
            "Error cargando sidebar:",
            error
        );

    }

}


/* =====================================================
   SISCAE - SIDEBAR REVISOR
===================================================== */

function loadRevisorSidebar() {
    return loadSidebar("sidebar_revisor.txt");
}