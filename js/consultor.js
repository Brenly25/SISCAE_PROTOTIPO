/* ============================================================
   SISCAE
   CONSULTOR EXTERNO
   Archivo: /js/consultor.js

   Utilizado por:
   - dashboard.html
   - activos.html
   - sesiones.html
   - sandbox.html
============================================================ */


/* ============================================================
   DATOS SIMULADOS DEL PROTOTIPO
============================================================ */

const activosConsultor = {

    "ACT-2026-001": {
        nombre: "Guía de Matemática 5.º",
        tipo: "Documento",
        version: "2.0",
        vigencia: "10/10/2026",
        estado: "Disponible",
        aplicacion: "Adobe InDesign",
        paquete: "guia_matematica_5_v2.zip"
    },

    "ACT-2026-002": {
        nombre: "Material de Ciencias Naturales",
        tipo: "Documento",
        version: "1.2",
        vigencia: "15/10/2026",
        estado: "Disponible",
        aplicacion: "Adobe InDesign",
        paquete: "ciencias_naturales_v1_2.zip"
    },

    "ACT-2026-003": {
        nombre: "Documento de Lenguaje",
        tipo: "Documento",
        version: "1.0",
        vigencia: "08/10/2026",
        estado: "Próximo a vencer",
        aplicacion: "Microsoft Word",
        paquete: "documento_lenguaje_v1.zip"
    },

    "ACT-2026-004": {
        nombre: "Material de Estudios Sociales",
        tipo: "Documento",
        version: "1.4",
        vigencia: "20/10/2026",
        estado: "Disponible",
        aplicacion: "Adobe InDesign",
        paquete: "estudios_sociales_v1_4.zip"
    }

};


/* ============================================================
   INICIALIZACIÓN GENERAL
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    iniciarSidebar();
    marcarPaginaActiva();
    actualizarFecha();
    iniciarMenuMovil();
    iniciarCerrarSesion();

    const paginaActual = obtenerPaginaActual();

    switch (paginaActual) {

        case "dashboard":
            iniciarDashboard();
            break;

        case "activos":
            iniciarActivos();
            break;

        case "sesiones":
            iniciarSesiones();
            break;

        case "sandbox":
            iniciarSandbox();
            break;
    }

});


/* ============================================================
   OBTENER PÁGINA ACTUAL
============================================================ */

function obtenerPaginaActual() {

    const archivo = window.location.pathname
        .split("/")
        .pop();

    if (!archivo) {
        return "dashboard";
    }

    return archivo.replace(".html", "");
}


/* ============================================================
   ESCAPAR HTML
============================================================ */

function escaparHTML(texto) {

    const elemento = document.createElement("div");

    elemento.textContent = String(texto ?? "");

    return elemento.innerHTML;
}


/* ============================================================
   SIDEBAR
============================================================ */

function iniciarSidebar() {

    const enlaces = document.querySelectorAll(".sidebar-link");

    enlaces.forEach(enlace => {

        enlace.addEventListener("click", () => {

            if (window.innerWidth <= 950) {
                cerrarMenuMovil();
            }

        });

    });

}


/* ============================================================
   PÁGINA ACTIVA DEL SIDEBAR
============================================================ */

function marcarPaginaActiva() {

    const paginaActual = obtenerPaginaActual();

    const enlaces = document.querySelectorAll(
        ".sidebar-link[data-page]"
    );

    enlaces.forEach(enlace => {

        enlace.classList.remove("active");

        const paginaEnlace = enlace.dataset.page
            .replace(".html", "");

        if (paginaEnlace === paginaActual) {
            enlace.classList.add("active");
        }

    });

    /*
        El sandbox pertenece a Activos asignados.
    */

    if (paginaActual === "sandbox") {

        const enlaceActivos = document.querySelector(
            '.sidebar-link[data-page="activos.html"]'
        );

        enlaceActivos?.classList.add("active");
    }

}


/* ============================================================
   FECHA ACTUAL
============================================================ */

function actualizarFecha() {

    const elementos = document.querySelectorAll(
        "#currentDate, .current-date-value"
    );

    if (!elementos.length) {
        return;
    }

    const fecha = new Intl.DateTimeFormat(
        "es-SV",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());

    elementos.forEach(elemento => {
        elemento.textContent = fecha;
    });

}


/* ============================================================
   MENÚ MÓVIL
============================================================ */

function iniciarMenuMovil() {

    const boton = document.querySelector(
        ".mobile-menu-button"
    );

    const overlay = document.querySelector(
        ".mobile-overlay"
    );

    if (boton) {

        boton.addEventListener("click", () => {

            const sidebar = document.querySelector(
                ".sidebar"
            );

            if (!sidebar) {
                return;
            }

            sidebar.classList.toggle("open");

            overlay?.classList.toggle("active");

            document.body.classList.toggle("locked");

        });

    }

    overlay?.addEventListener(
        "click",
        cerrarMenuMovil
    );

    document.addEventListener(
        "keydown",
        evento => {

            if (evento.key === "Escape") {
                cerrarMenuMovil();
            }

        }
    );

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 950) {
                cerrarMenuMovil();
            }

        }
    );

}


/* ============================================================
   CERRAR MENÚ MÓVIL
============================================================ */

function cerrarMenuMovil() {

    document
        .querySelector(".sidebar")
        ?.classList.remove("open");

    document
        .querySelector(".mobile-overlay")
        ?.classList.remove("active");

    document.body.classList.remove("locked");

}


/* ============================================================
   CERRAR SESIÓN DE SISCAE
============================================================ */

function iniciarCerrarSesion() {

    const botones = document.querySelectorAll(
        ".sidebar-logout, [data-action='logout']"
    );

    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const confirmar = confirm(
                "¿Deseas cerrar tu sesión en SISCAE?"
            );

            if (!confirmar) {
                return;
            }

            sessionStorage.removeItem(
                "siscae_consultor_sesion"
            );

            window.location.href = "../login.html";

        });

    });

}


/* ============================================================
   DASHBOARD
============================================================ */

function iniciarDashboard() {
    iniciarBotonesAbrirActivo();
}


/* ============================================================
   BOTONES ABRIR ACTIVO
============================================================ */

function iniciarBotonesAbrirActivo() {

    const botones = document.querySelectorAll(
        "[data-open-asset]"
    );

    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            evento => {

                evento.preventDefault();

                const codigo =
                    boton.dataset.openAsset;

                abrirSandbox(codigo);

            }
        );

    });

}


/* ============================================================
   ABRIR ENTORNO DEL ACTIVO
============================================================ */

function abrirSandbox(codigo) {

    if (!codigo) {
        return;
    }

    const url = new URL(
        "sandbox.html",
        window.location.href
    );

    url.searchParams.set(
        "activo",
        codigo
    );

    window.location.href = url.toString();

}


/* ============================================================
   ACTIVOS ASIGNADOS
============================================================ */

function iniciarActivos() {

    const buscador =
        document.getElementById("buscarActivo");

    const filtroEstado =
        document.getElementById("filtroEstado");

    const filtroTipo =
        document.getElementById("filtroTipo");

    const filas =
        document.querySelectorAll("[data-asset-row]");


    function filtrarActivos() {

        const texto =
            buscador?.value
                .toLowerCase()
                .trim() || "";

        const estado =
            filtroEstado?.value
                .toLowerCase() || "todos";

        const tipo =
            filtroTipo?.value
                .toLowerCase() || "todos";

        let visibles = 0;

        filas.forEach(fila => {

            const nombre =
                (fila.dataset.nombre || "")
                    .toLowerCase();

            const codigo =
                (fila.dataset.codigo || "")
                    .toLowerCase();

            const estadoFila =
                (fila.dataset.estado || "")
                    .toLowerCase();

            const tipoFila =
                (fila.dataset.tipo || "")
                    .toLowerCase();

            const coincideTexto =
                nombre.includes(texto) ||
                codigo.includes(texto);

            const coincideEstado =
                estado === "todos" ||
                estadoFila === estado;

            const coincideTipo =
                tipo === "todos" ||
                tipoFila === tipo;

            const mostrar =
                coincideTexto &&
                coincideEstado &&
                coincideTipo;

            fila.style.display =
                mostrar ? "" : "none";

            if (mostrar) {
                visibles++;
            }

        });

        const vacio =
            document.getElementById(
                "emptyAssets"
            );

        if (vacio) {
            vacio.style.display =
                visibles === 0
                    ? "block"
                    : "none";
        }

    }

    buscador?.addEventListener(
        "input",
        filtrarActivos
    );

    filtroEstado?.addEventListener(
        "change",
        filtrarActivos
    );

    filtroTipo?.addEventListener(
        "change",
        filtrarActivos
    );

    iniciarBotonesAbrirActivo();

}


/* ============================================================
   HISTORIAL DE SESIONES
============================================================ */

function iniciarSesiones() {

    cargarSesionesGuardadas();

    const buscador =
        document.getElementById("buscarSesion");

    const filtro =
        document.getElementById("filtroSesion");


    function filtrarSesiones() {

        const filas =
            document.querySelectorAll(
                "[data-session-row]"
            );

        const texto =
            buscador?.value
                .toLowerCase()
                .trim() || "";

        const estado =
            filtro?.value
                .toLowerCase() || "todos";

        let visibles = 0;

        filas.forEach(fila => {

            const activo =
                (fila.dataset.activo || "")
                    .toLowerCase();

            const codigo =
                (fila.dataset.codigo || "")
                    .toLowerCase();

            const estadoFila =
                (fila.dataset.estado || "")
                    .toLowerCase();

            const coincideTexto =
                activo.includes(texto) ||
                codigo.includes(texto);

            const coincideEstado =
                estado === "todos" ||
                estadoFila === estado;

            const mostrar =
                coincideTexto &&
                coincideEstado;

            fila.style.display =
                mostrar ? "" : "none";

            if (mostrar) {
                visibles++;
            }

        });

        const vacio =
            document.getElementById(
                "emptySessions"
            );

        if (vacio) {

            vacio.style.display =
                visibles === 0
                    ? "block"
                    : "none";

        }

    }

    buscador?.addEventListener(
        "input",
        filtrarSesiones
    );

    filtro?.addEventListener(
        "change",
        filtrarSesiones
    );

}


/* ============================================================
   AGREGAR SESIONES GUARDADAS AL HISTORIAL

   IMPORTANTE:
   La tabla utiliza 7 columnas:

   1. Activo
   2. Código
   3. Versión
   4. Fecha
   5. Inicio
   6. Finalización
   7. Estado
============================================================ */

function cargarSesionesGuardadas() {

    const tbody =
        document.querySelector(
            ".consultor-table tbody"
        );

    if (!tbody) {
        return;
    }

    let historial = [];

    try {

        historial =
            JSON.parse(
                localStorage.getItem(
                    "siscae_historial_consultor"
                )
            ) || [];

    } catch (error) {

        historial = [];

    }


    historial.forEach(sesion => {

        const fila =
            document.createElement("tr");

        fila.setAttribute(
            "data-session-row",
            ""
        );

        fila.dataset.activo =
            sesion.activo || "";

        fila.dataset.codigo =
            sesion.codigo || "";

        fila.dataset.estado =
            sesion.estado || "finalizada";


        const fechaInicio =
            new Date(sesion.inicio);

        const fechaFin =
            sesion.fin
                ? new Date(sesion.fin)
                : null;


        /*
            Si la sesión fue creada con una versión
            anterior del JS y no tiene versionInicial,
            utilizamos la versión registrada como respaldo.
        */

        const versionInicial =
            sesion.versionInicial ||
            sesion.version ||
            "--";

        const versionFinal =
            sesion.version ||
            versionInicial;


        let textoVersion = "";

        if (
            versionInicial !== "--" &&
            versionFinal !== "--" &&
            versionInicial !== versionFinal
        ) {

            textoVersion = `
                <span class="version-change">
                    ${escaparHTML(versionInicial)}
                    →
                    ${escaparHTML(versionFinal)}
                </span>
            `;

        } else {

            textoVersion = `
                <span class="version-static">
                    ${escaparHTML(versionFinal)}
                </span>
            `;

        }


        fila.innerHTML = `

            <td>
                <strong>
                    ${escaparHTML(sesion.activo)}
                </strong>
            </td>

            <td>
                ${escaparHTML(sesion.codigo)}
            </td>

            <td>
                ${textoVersion}
            </td>

            <td>
                ${formatearFecha(fechaInicio)}
            </td>

            <td>
                ${formatearHora(fechaInicio)}
            </td>

            <td>
                ${
                    fechaFin
                        ? formatearHora(fechaFin)
                        : "--"
                }
            </td>

            <td>
                <span class="badge badge-success">
                    Finalizada
                </span>
            </td>

        `;

        tbody.prepend(fila);

    });

}


/* ============================================================
   SANDBOX / ENTORNO SEGURO
============================================================ */

function iniciarSandbox() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const codigo =
        parametros.get("activo");

    const activo =
        activosConsultor[codigo];


    if (!codigo || !activo) {

        mostrarErrorSandbox();

        return;
    }


    cargarInformacionActivo(
        codigo,
        activo
    );


    /*
        Crear o recuperar sesión.
        Aquí se conserva la versión con la que
        comenzó el trabajo.
    */

    registrarInicioSesion(
        codigo,
        activo
    );


    iniciarEditor(
        codigo,
        activo
    );


    iniciarRegistroVersion(
        codigo,
        activo
    );


    iniciarFinalizacionSesion(
        codigo,
        activo
    );

}


/* ============================================================
   CARGAR INFORMACIÓN DEL ACTIVO
============================================================ */

function cargarInformacionActivo(
    codigo,
    activo
) {

    establecerTexto(
        "sandboxAssetCode",
        codigo
    );

    establecerTexto(
        "sandboxAssetName",
        activo.nombre
    );

    establecerTexto(
        "sandboxAssetType",
        activo.tipo
    );

    establecerTexto(
        "sandboxAssetVersion",
        activo.version
    );

    establecerTexto(
        "sandboxAssetExpiration",
        activo.vigencia
    );

    establecerTexto(
        "sandboxAssetStatus",
        activo.estado
    );

    establecerTexto(
        "sandboxPackageName",
        activo.paquete
    );

    establecerTexto(
        "sandboxApplication",
        activo.aplicacion
    );


    const textoBoton =
        document.getElementById(
            "openEditorText"
        );

    if (textoBoton) {

        textoBoton.textContent =
            `Abrir en ${activo.aplicacion}`;

    }


    establecerTexto(
        "currentWorkVersion",
        activo.version
    );

    establecerTexto(
        "nextWorkVersion",
        calcularNuevaVersion(
            activo.version
        )
    );

}


/* ============================================================
   ESTABLECER TEXTO
============================================================ */

function establecerTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }

}


/* ============================================================
   ERROR DEL ENTORNO
============================================================ */

function mostrarErrorSandbox() {

    const contenedor =
        document.getElementById(
            "sandboxContent"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `

        <section class="content-panel">

            <div class="empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Recurso no disponible
                </h3>

                <p>
                    El activo solicitado no existe,
                    no está asignado a tu cuenta
                    o el acceso ya no se encuentra vigente.
                </p>

                <a href="activos.html"
                   class="btn-primary">

                    <i class="fa-solid fa-arrow-left"></i>

                    Volver a activos

                </a>

            </div>

        </section>

    `;

}


/* ============================================================
   REGISTRAR INICIO DE SESIÓN
============================================================ */

function registrarInicioSesion(
    codigo,
    activo
) {

    const sesionGuardada =
        sessionStorage.getItem(
            "siscae_consultor_sesion"
        );

    if (sesionGuardada) {

        try {

            const sesion =
                JSON.parse(
                    sesionGuardada
                );

            /*
                Ya existe una sesión activa
                para este mismo recurso.
            */

            if (
                sesion.codigo === codigo &&
                sesion.estado === "activa"
            ) {

                /*
                    Compatibilidad con sesiones creadas
                    antes de agregar versionInicial.
                */

                if (!sesion.versionInicial) {

                    sesion.versionInicial =
                        sesion.version ||
                        activo.version;

                    sessionStorage.setItem(
                        "siscae_consultor_sesion",
                        JSON.stringify(sesion)
                    );

                }

                return;
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar la sesión anterior."
            );

        }

    }


    const sesion = {

        codigo:
            codigo,

        activo:
            activo.nombre,

        /*
            Esta NO debe cambiar aunque el consultor
            registre una versión nueva.
        */

        versionInicial:
            activo.version,

        /*
            Esta sí se irá actualizando.
        */

        version:
            activo.version,

        inicio:
            new Date().toISOString(),

        estado:
            "activa",

        editorAbierto:
            false

    };


    sessionStorage.setItem(
        "siscae_consultor_sesion",
        JSON.stringify(sesion)
    );


    registrarEventoSesion(
        "sesion_iniciada",
        codigo,
        {
            versionInicial:
                activo.version
        }
    );

}


/* ============================================================
   ABRIR APLICACIÓN DE EDICIÓN
============================================================ */

function iniciarEditor(
    codigo,
    activo
) {

    const boton =
        document.getElementById(
            "openEditorButton"
        );

    if (!boton) {
        return;
    }

    boton.addEventListener(
        "click",
        async () => {

            boton.disabled = true;

            boton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Iniciando entorno...

            `;

            await esperar(800);

            boton.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                ${escaparHTML(activo.aplicacion)} abierto

            `;

            boton.classList.add(
                "editor-active"
            );

            actualizarEstadoSesionEditor();

            registrarEventoSesion(
                "entorno_edicion_iniciado",
                codigo,
                {
                    aplicacion:
                        activo.aplicacion
                }
            );

            mostrarMensajeTemporal(
                `Sesión de edición iniciada en ${activo.aplicacion}.`,
                "success"
            );

        }
    );

}


/* ============================================================
   MARCAR EDITOR COMO ABIERTO
============================================================ */

function actualizarEstadoSesionEditor() {

    const sesionGuardada =
        sessionStorage.getItem(
            "siscae_consultor_sesion"
        );

    if (!sesionGuardada) {
        return;
    }

    try {

        const sesion =
            JSON.parse(
                sesionGuardada
            );

        sesion.editorAbierto = true;

        sessionStorage.setItem(
            "siscae_consultor_sesion",
            JSON.stringify(sesion)
        );

    } catch (error) {

        console.warn(
            "No fue posible actualizar el estado del entorno."
        );

    }

}


/* ============================================================
   REGISTRAR NUEVA VERSIÓN
============================================================ */

function iniciarRegistroVersion(
    codigo,
    activo
) {

    const boton =
        document.getElementById(
            "registerVersionButton"
        );

    const comentario =
        document.getElementById(
            "versionComment"
        );

    const versionActualElemento =
        document.getElementById(
            "currentWorkVersion"
        );

    const versionNuevaElemento =
        document.getElementById(
            "nextWorkVersion"
        );

    if (!boton) {
        return;
    }


    let versionActual =
        activo.version;

    let nuevaVersion =
        calcularNuevaVersion(
            versionActual
        );


    if (versionActualElemento) {

        versionActualElemento.textContent =
            versionActual;

    }

    if (versionNuevaElemento) {

        versionNuevaElemento.textContent =
            nuevaVersion;

    }


    boton.addEventListener(
        "click",
        async () => {

            const descripcion =
                comentario?.value
                    .trim() || "";


            if (!descripcion) {

                mostrarResultadoVersion(
                    "error",
                    "Describe brevemente los cambios realizados antes de registrar la nueva versión."
                );

                comentario?.focus();

                return;
            }


            boton.disabled = true;


            /* ==========================
               VERIFICAR SINCRONIZACIÓN
            ========================== */

            boton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Verificando sincronización...

            `;

            mostrarResultadoVersion(
                "processing",
                "Verificando los cambios sincronizados con el almacenamiento central..."
            );

            await esperar(700);


            /* ==========================
               SHA-256
            ========================== */

            boton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Verificando integridad...

            `;

            mostrarResultadoVersion(
                "processing",
                "Generando la firma de integridad SHA-256 de la nueva versión..."
            );

            await esperar(700);

            const hash =
                generarHashSimulado();


            /* ==========================
               REGISTRAR VERSIÓN
            ========================== */

            boton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Registrando versión...

            `;

            mostrarResultadoVersion(
                "processing",
                `Registrando la versión ${escaparHTML(nuevaVersion)} en la trazabilidad del activo...`
            );

            await esperar(700);


            const registro = {

                codigo:
                    codigo,

                activo:
                    activo.nombre,

                versionAnterior:
                    versionActual,

                nuevaVersion:
                    nuevaVersion,

                comentario:
                    descripcion,

                hash:
                    hash,

                fecha:
                    new Date().toISOString(),

                usuario:
                    "Consultor externo"

            };


            guardarVersionLocal(
                registro
            );


            registrarEventoSesion(
                "nueva_version_registrada",
                codigo,
                {
                    versionAnterior:
                        versionActual,

                    version:
                        nuevaVersion,

                    hash:
                        hash
                }
            );


            /*
                Actualizamos la versión final,
                pero NO versionInicial.
            */

            activo.version =
                nuevaVersion;


            establecerTexto(
                "sandboxAssetVersion",
                nuevaVersion
            );


            versionActual =
                nuevaVersion;

            nuevaVersion =
                calcularNuevaVersion(
                    versionActual
                );


            if (versionActualElemento) {

                versionActualElemento.textContent =
                    versionActual;

            }


            if (versionNuevaElemento) {

                versionNuevaElemento.textContent =
                    nuevaVersion;

            }


            /*
                Solo cambia sesion.version.
                sesion.versionInicial permanece intacta.
            */

            actualizarVersionSesion(
                versionActual
            );


            mostrarResultadoVersion(
                "success",
                `
                    <strong>
                        Versión ${escaparHTML(versionActual)}
                        registrada correctamente.
                    </strong>

                    <span>
                        Los cambios fueron sincronizados
                        con el almacenamiento central.
                    </span>

                    <span>
                        Integridad registrada mediante SHA-256.
                    </span>

                    <small>
                        SHA-256:
                        ${escaparHTML(hash)}
                    </small>
                `
            );


            if (comentario) {
                comentario.value = "";
            }


            boton.disabled = false;

            boton.innerHTML = `

                <i class="fa-solid fa-check"></i>

                Registrar nueva versión

            `;


            mostrarMensajeTemporal(
                `Versión ${versionActual} registrada correctamente.`,
                "success"
            );

        }
    );

}


/* ============================================================
   ACTUALIZAR VERSIÓN FINAL DE LA SESIÓN
============================================================ */

function actualizarVersionSesion(
    version
) {

    const sesionGuardada =
        sessionStorage.getItem(
            "siscae_consultor_sesion"
        );

    if (!sesionGuardada) {
        return;
    }

    try {

        const sesion =
            JSON.parse(
                sesionGuardada
            );


        /*
            IMPORTANTE:
            versionInicial NO se modifica.
        */

        sesion.version =
            version;


        sessionStorage.setItem(
            "siscae_consultor_sesion",
            JSON.stringify(sesion)
        );

    } catch (error) {

        console.warn(
            "No fue posible actualizar la versión de la sesión."
        );

    }

}


/* ============================================================
   CALCULAR SIGUIENTE VERSIÓN
============================================================ */

function calcularNuevaVersion(
    versionActual
) {

    const partes =
        String(versionActual)
            .split(".");

    let mayor =
        parseInt(partes[0]);

    let menor =
        parseInt(partes[1]);

    if (Number.isNaN(mayor)) {
        mayor = 1;
    }

    if (Number.isNaN(menor)) {
        menor = 0;
    }

    menor++;

    return `${mayor}.${menor}`;

}


/* ============================================================
   GENERAR HASH SHA-256 SIMULADO
============================================================ */

function generarHashSimulado() {

    const caracteres =
        "abcdef0123456789";

    let hash = "";

    for (
        let i = 0;
        i < 64;
        i++
    ) {

        const indice =
            Math.floor(
                Math.random() *
                caracteres.length
            );

        hash +=
            caracteres[indice];

    }

    return hash;

}


/* ============================================================
   MOSTRAR RESULTADO DE VERSIÓN
============================================================ */

function mostrarResultadoVersion(
    tipo,
    mensaje
) {

    const contenedor =
        document.getElementById(
            "versionResult"
        );

    if (!contenedor) {
        return;
    }


    let icono =
        "fa-circle-info";

    let color =
        "#0d4fa3";

    let fondo =
        "#f6f9fd";


    if (tipo === "success") {

        icono =
            "fa-circle-check";

        color =
            "#178653";

        fondo =
            "#f4fbf7";

    }


    if (tipo === "error") {

        icono =
            "fa-circle-exclamation";

        color =
            "#b42318";

        fondo =
            "#fff7f6";

    }


    contenedor.style.display =
        "block";


    contenedor.innerHTML = `

        <div style="
            display:flex;
            align-items:flex-start;
            gap:12px;
            padding:16px 18px;
            background:${fondo};
            border-left:3px solid ${color};
        ">

            <i class="fa-solid ${icono}"
               style="
                    margin-top:2px;
                    color:${color};
               ">
            </i>

            <div style="
                display:flex;
                flex-direction:column;
                gap:5px;
                color:#526177;
                font-size:12px;
                line-height:1.6;
                word-break:break-word;
            ">

                ${mensaje}

            </div>

        </div>

    `;

}


/* ============================================================
   GUARDAR REGISTRO DE VERSIONES
============================================================ */

function guardarVersionLocal(
    registro
) {

    let versiones = [];

    try {

        versiones =
            JSON.parse(
                localStorage.getItem(
                    "siscae_versiones_consultor"
                )
            ) || [];

    } catch (error) {

        versiones = [];

    }


    versiones.unshift(
        registro
    );


    localStorage.setItem(
        "siscae_versiones_consultor",
        JSON.stringify(versiones)
    );

}


/* ============================================================
   REGISTRAR EVENTO
============================================================ */

function registrarEventoSesion(
    evento,
    codigo,
    datos = {}
) {

    let eventos = [];

    try {

        eventos =
            JSON.parse(
                localStorage.getItem(
                    "siscae_eventos_consultor"
                )
            ) || [];

    } catch (error) {

        eventos = [];

    }


    eventos.unshift({

        evento:
            evento,

        codigo:
            codigo,

        fecha:
            new Date().toISOString(),

        ...datos

    });


    localStorage.setItem(
        "siscae_eventos_consultor",
        JSON.stringify(eventos)
    );

}


/* ============================================================
   FINALIZAR SESIÓN
============================================================ */

function iniciarFinalizacionSesion(
    codigo,
    activo
) {

    const botones =
        document.querySelectorAll(
            "[data-action='finish-session']"
        );

    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const confirmar =
                    confirm(
                        "¿Deseas finalizar esta sesión de trabajo?"
                    );

                if (!confirmar) {
                    return;
                }

                finalizarSesion(
                    codigo,
                    activo
                );

            }
        );

    });

}


/* ============================================================
   GUARDAR SESIÓN FINALIZADA
============================================================ */

function finalizarSesion(
    codigo,
    activo
) {

    let inicio =
        new Date().toISOString();

    /*
        Versión con la que comenzó el trabajo.
    */

    let versionInicial =
        activo.version;

    /*
        Versión existente al finalizar.
    */

    let version =
        activo.version;


    const sesionGuardada =
        sessionStorage.getItem(
            "siscae_consultor_sesion"
        );


    if (sesionGuardada) {

        try {

            const sesion =
                JSON.parse(
                    sesionGuardada
                );


            inicio =
                sesion.inicio ||
                inicio;


            versionInicial =
                sesion.versionInicial ||
                sesion.version ||
                versionInicial;


            version =
                sesion.version ||
                version;


        } catch (error) {

            console.warn(
                "No fue posible recuperar los datos de la sesión."
            );

        }

    }


    const sesionFinalizada = {

        codigo:
            codigo,

        activo:
            activo.nombre,

        /*
            Ejemplo:
            versionInicial = 2.0
            version = 2.1
        */

        versionInicial:
            versionInicial,

        version:
            version,

        inicio:
            inicio,

        fin:
            new Date().toISOString(),

        estado:
            "finalizada"

    };


    /* ==========================
       ÚLTIMA SESIÓN
    ========================== */

    localStorage.setItem(
        "siscae_ultima_sesion_consultor",
        JSON.stringify(
            sesionFinalizada
        )
    );


    /* ==========================
       HISTORIAL
    ========================== */

    guardarSesionEnHistorial(
        sesionFinalizada
    );


    /* ==========================
       EVENTO
    ========================== */

    registrarEventoSesion(
        "sesion_finalizada",
        codigo,
        {
            versionInicial:
                versionInicial,

            version:
                version
        }
    );


    /* ==========================
       ELIMINAR SESIÓN ACTIVA
    ========================== */

    sessionStorage.removeItem(
        "siscae_consultor_sesion"
    );


    /* ==========================
       IR AL HISTORIAL
    ========================== */

    window.location.href =
        "sesiones.html";

}


/* ============================================================
   GUARDAR HISTORIAL
============================================================ */

function guardarSesionEnHistorial(
    sesion
) {

    let historial = [];

    try {

        historial =
            JSON.parse(
                localStorage.getItem(
                    "siscae_historial_consultor"
                )
            ) || [];

    } catch (error) {

        historial = [];

    }


    historial.unshift(
        sesion
    );


    /*
        Mantener máximo 50 registros
        para el prototipo.
    */

    if (historial.length > 50) {

        historial =
            historial.slice(
                0,
                50
            );

    }


    localStorage.setItem(
        "siscae_historial_consultor",
        JSON.stringify(historial)
    );

}


/* ============================================================
   FORMATEAR FECHA
============================================================ */

function formatearFecha(
    fecha
) {

    if (
        !(fecha instanceof Date) ||
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return "--";

    }


    return new Intl.DateTimeFormat(
        "es-SV",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(fecha);

}


/* ============================================================
   FORMATEAR HORA
============================================================ */

function formatearHora(
    fecha
) {

    if (
        !(fecha instanceof Date) ||
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return "--";

    }


    return new Intl.DateTimeFormat(
        "es-SV",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    ).format(fecha);

}


/* ============================================================
   MENSAJE TEMPORAL
============================================================ */

function mostrarMensajeTemporal(
    mensaje,
    tipo = "info"
) {

    const existente =
        document.getElementById(
            "consultorTemporaryMessage"
        );

    existente?.remove();


    const elemento =
        document.createElement(
            "div"
        );


    elemento.id =
        "consultorTemporaryMessage";


    elemento.textContent =
        mensaje;


    elemento.style.position =
        "fixed";

    elemento.style.right =
        "25px";

    elemento.style.bottom =
        "25px";

    elemento.style.zIndex =
        "9999";

    elemento.style.padding =
        "14px 18px";

    elemento.style.background =
        "#ffffff";

    elemento.style.border =
        "1px solid #dce3ed";

    elemento.style.borderLeft =
        tipo === "success"
            ? "4px solid #178653"
            : "4px solid #0d4fa3";

    elemento.style.boxShadow =
        "0 8px 25px rgba(20,45,82,.12)";

    elemento.style.color =
        "#334155";

    elemento.style.fontSize =
        "12px";

    elemento.style.maxWidth =
        "360px";


    document.body.appendChild(
        elemento
    );


    setTimeout(
        () => {
            elemento.remove();
        },
        3200
    );

}


/* ============================================================
   ESPERA PARA SIMULACIONES DEL PROTOTIPO
============================================================ */

function esperar(
    milisegundos
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milisegundos
            );

        }
    );

}