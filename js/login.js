/* ==========================================================
   SISCAE - LOGIN
========================================================== */


/* ==========================================================
   MENÚ MÓVIL
========================================================== */

const menuButton =
    document.getElementById("loginMenuButton");
    

const nav =
    document.getElementById("loginNav");


if (menuButton && nav) {

    menuButton.addEventListener(
        "click",
        function () {

            nav.classList.toggle("active");

            menuButton.classList.toggle("active");


            const expanded =
                menuButton.getAttribute("aria-expanded") === "true";


            menuButton.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

        }
    );

}


/* ==========================================================
   BOTÓN GOOGLE
   Temporal hasta Firebase
========================================================== */

const googleLogin = document.getElementById("googleLogin");

googleLogin.addEventListener("click", () => {
    window.location.href = "interfaces.html";
});