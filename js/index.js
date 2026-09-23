/* =========================================================
   SISCAE
   PÁGINA PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header =
        document.getElementById("header");

    const menuButton =
        document.getElementById("menuButton");

    const nav =
        document.getElementById("nav");

    const navLinks =
        document.querySelectorAll(
            '.nav__link[href^="#"]'
        );

    const sections =
        document.querySelectorAll(
            "#inicio, #acerca, #soporte"
        );


    /* =====================================================
       MENÚ MÓVIL
    ====================================================== */

    function closeMenu() {

        nav.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            nav.classList.toggle("open");

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Cerrar menú"
                : "Abrir menú"
        );

    });


    /* =====================================================
       CERRAR MENÚ AL SELECCIONAR
    ====================================================== */

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 780) {
                closeMenu();
            }

        });

    });


    /* =====================================================
       HEADER AL HACER SCROLL
    ====================================================== */

    function updateHeader() {

        if (window.scrollY > 35) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    /* =====================================================
       PESTAÑA ACTIVA
    ====================================================== */

    function updateNavigation() {

        let currentSection =
            "inicio";

        sections.forEach(section => {

            const position =
                section.getBoundingClientRect();

            if (position.top <= 190) {

                currentSection =
                    section.id;

            }

        });


        const bottomReached =
            window.innerHeight +
            window.scrollY >=
            document.documentElement
                .scrollHeight - 80;


        if (bottomReached) {

            currentSection =
                "soporte";

        }


        navLinks.forEach(link => {

            const target =
                link.getAttribute("href");

            const active =
                target ===
                `#${currentSection}`;

            link.classList.toggle(
                "active",
                active
            );


            if (active) {

                link.setAttribute(
                    "aria-current",
                    "location"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    }


    /* =====================================================
       FAQ
       SOLO UNA PREGUNTA ABIERTA
    ====================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq__item"
        );


    faqItems.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) {
                    return;
                }


                faqItems.forEach(
                    otherItem => {

                        if (
                            otherItem !== item
                        ) {

                            otherItem.open =
                                false;

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

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
                window.innerWidth > 780
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       SCROLL OPTIMIZADO
    ====================================================== */

    let ticking = false;


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    () => {

                        updateHeader();

                        updateNavigation();

                        ticking = false;

                    }
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       INICIO
    ====================================================== */

    updateHeader();

    updateNavigation();

});