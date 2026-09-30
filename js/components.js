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
