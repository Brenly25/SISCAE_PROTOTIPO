/* =====================================================
   SISCAE
   VISTA PRINCIPAL
===================================================== */

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

const navLinks = document.querySelectorAll(
    '.nav__link[href^="#"]'
);

const sections = document.querySelectorAll(
    "main section[id]"
);


/* =====================================================
   MENÚ MÓVIL
===================================================== */

menuButton.addEventListener("click", () => {

    const isOpen =
        nav.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    document.body.classList.toggle(
        "menu-open",
        isOpen
    );

});


/* =====================================================
   CERRAR MENÚ
===================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );

    });

});


/* =====================================================
   NAVEGACIÓN ACTIVA
===================================================== */

function updateNavigation() {

    let currentSection = "inicio";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        if (
            window.scrollY >= sectionTop
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateNavigation
);


/* =====================================================
   CERRAR MENÚ AL CAMBIAR TAMAÑO
===================================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 760) {

        nav.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

});


updateNavigation();