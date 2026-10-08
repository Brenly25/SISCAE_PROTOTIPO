
/* ==========================================================
   SISCAE - LIBROS PUBLICADOS
   Archivo: js/pages/publicados.js
   Prototipo de consulta de publicaciones
========================================================== */

const librosPublicados = [
    {
        codigo: "PUB-2026-001",
        titulo: "Matemática 5.º grado",
        asignatura: "Matemática",
        grado: "5.º grado",
        version: "2.1",
        fecha: "2026-09-15",
        responsable: "Unidad Editorial",
        estilo: "math",
        url: null,
        hash: null,
        estado: "Publicado"
    },
    {
        codigo: "PUB-2026-002",
        titulo: "Ciencias Naturales 4.º grado",
        asignatura: "Ciencias Naturales",
        grado: "4.º grado",
        version: "1.2",
        fecha: "2026-09-22",
        responsable: "Unidad Editorial",
        estilo: "science",
        url: null,
        hash: null,
        estado: "Publicado"
    },
    {
        codigo: "PUB-2026-003",
        titulo: "Lenguaje 3.º grado",
        asignatura: "Lenguaje",
        grado: "3.º grado",
        version: "1.0",
        fecha: "2026-09-27",
        responsable: "Unidad Editorial",
        estilo: "language",
        url: null,
        hash: null,
        estado: "Publicado"
    },
    {
        codigo: "PUB-2026-004",
        titulo: "Estudios Sociales 6.º grado",
        asignatura: "Estudios Sociales",
        grado: "6.º grado",
        version: "1.4",
        fecha: "2026-10-02",
        responsable: "Unidad Editorial",
        estilo: "social",
        url: null,
        hash: null,
        estado: "Publicado"
    },
    {
        codigo: "PUB-2026-005",
        titulo: "Inglés 5.º grado",
        asignatura: "Inglés",
        grado: "5.º grado",
        version: "1.0",
        fecha: "2026-10-04",
        responsable: "Unidad Editorial",
        estilo: "english",
        url: null,
        hash: null,
        estado: "Publicado"
    },
    {
        codigo: "PUB-2026-006",
        titulo: "Educación Artística 4.º grado",
        asignatura: "Educación Artística",
        grado: "4.º grado",
        version: "1.1",
        fecha: "2026-10-06",
        responsable: "Unidad Editorial",
        estilo: "art",
        url: null,
        hash: null,
        estado: "Publicado"
    }
];

/* ==========================================================
   INICIALIZACIÓN
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    actualizarFechaPublicados();
    actualizarIndicadoresPublicados();
    configurarFiltrosPublicados();
    configurarAccionesPublicados();
    configurarModalPublicados();
    renderizarPublicados();
});

/* ==========================================================
   UTILIDADES
========================================================== */

function escaparHTMLPublicados(valor) {
    const elemento = document.createElement("div");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function formatearFechaPublicados(fecha) {
    if (!fecha) return "No disponible";

    const partes = String(fecha).split("-");

    if (partes.length !== 3) return String(fecha);

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerPublicaciones() {
    return librosPublicados.filter(
        libro => libro.estado === "Publicado"
    );
}

/* ==========================================================
   FECHA ACTUAL
========================================================== */

function actualizarFechaPublicados() {
    const elemento = document.getElementById("currentDate");

    if (!elemento) return;

    elemento.textContent = new Intl.DateTimeFormat("es-SV", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

/* ==========================================================
   INDICADORES
========================================================== */

function actualizarIndicadoresPublicados() {
    const publicaciones = obtenerPublicaciones();

    const total = document.getElementById("totalBooks");
    const asignaturas = document.getElementById("totalSubjects");
    const publicacionesAnio = document.getElementById("yearBooks");

    const anioActual = String(new Date().getFullYear());

    if (total) {
        total.textContent = publicaciones.length;
    }

    if (asignaturas) {
        asignaturas.textContent = new Set(
            publicaciones.map(libro => libro.asignatura)
        ).size;
    }

    if (publicacionesAnio) {
        publicacionesAnio.textContent = publicaciones.filter(
            libro => libro.fecha.startsWith(anioActual)
        ).length;
    }
}

/* ==========================================================
   TARJETAS DEL CATÁLOGO
========================================================== */

function crearTarjetaPublicado(libro) {
    const tarjeta = document.createElement("article");

    tarjeta.className = "book-card";

    tarjeta.innerHTML = `
        <div class="book-cover">
            <div class="cover-design ${escaparHTMLPublicados(libro.estilo)}">

                <span class="cover-ministry">
                    MINISTERIO DE EDUCACIÓN
                </span>

                <span class="cover-title">
                    ${escaparHTMLPublicados(libro.asignatura)}
                </span>

                <span class="cover-grade">
                    ${escaparHTMLPublicados(libro.grado)}
                </span>

            </div>
        </div>

        <div class="book-info">

            <span class="book-status">
                Publicado
            </span>

            <h3>${escaparHTMLPublicados(libro.titulo)}</h3>

            <div class="book-code">
                ${escaparHTMLPublicados(libro.codigo)}
            </div>

            <div class="book-metadata">

                <div>
                    <span>VERSIÓN OFICIAL</span>
                    <strong>
                        ${escaparHTMLPublicados(libro.version)}
                    </strong>
                </div>

                <div>
                    <span>PUBLICADO EL</span>
                    <strong>
                        ${formatearFechaPublicados(libro.fecha)}
                    </strong>
                </div>

            </div>

            <div class="book-actions">

                <button
                    class="btn-book"
                    type="button"
                    data-action="view"
                    data-code="${escaparHTMLPublicados(libro.codigo)}"
                >
                    Ver libro
                </button>

                <button
                    class="btn-book secondary"
                    type="button"
                    data-action="detail"
                    data-code="${escaparHTMLPublicados(libro.codigo)}"
                >
                    Ver ficha
                </button>

            </div>

        </div>
    `;

    return tarjeta;
}

/* ==========================================================
   BÚSQUEDA Y FILTROS
========================================================== */

function renderizarPublicados() {
    const contenedor = document.getElementById("booksGrid");

    if (!contenedor) return;

    const busqueda = (
        document.getElementById("searchBook")?.value || ""
    ).trim().toLocaleLowerCase("es");

    const asignatura =
        document.getElementById("filterSubject")?.value || "todos";

    const grado =
        document.getElementById("filterGrade")?.value || "todos";

    const publicaciones = obtenerPublicaciones();

    const filtrados = publicaciones.filter(libro => {
        const texto = [
            libro.titulo,
            libro.codigo,
            libro.asignatura,
            libro.responsable
        ].join(" ").toLocaleLowerCase("es");

        const coincideBusqueda = texto.includes(busqueda);

        const coincideAsignatura =
            asignatura === "todos" ||
            libro.asignatura === asignatura;

        const coincideGrado =
            grado === "todos" ||
            libro.grado === grado;

        return (
            coincideBusqueda &&
            coincideAsignatura &&
            coincideGrado
        );
    });

    contenedor.replaceChildren();

    filtrados.forEach(libro => {
        contenedor.appendChild(crearTarjetaPublicado(libro));
    });

    const contador = document.getElementById("catalogCount");

    if (contador) {
        contador.textContent =
            `${filtrados.length} de ${publicaciones.length} publicaciones`;
    }

    const estadoVacio = document.getElementById("emptyBooks");

    if (estadoVacio) {
        estadoVacio.style.display =
            filtrados.length === 0 ? "block" : "none";
    }
}

function configurarFiltrosPublicados() {
    document.getElementById("searchBook")
        ?.addEventListener("input", renderizarPublicados);

    document.getElementById("filterSubject")
        ?.addEventListener("change", renderizarPublicados);

    document.getElementById("filterGrade")
        ?.addEventListener("change", renderizarPublicados);
}

/* ==========================================================
   ACCIONES DE LAS TARJETAS
========================================================== */

function configurarAccionesPublicados() {
    const contenedor = document.getElementById("booksGrid");

    contenedor?.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-action]");

        if (!boton) return;

        const codigo = boton.dataset.code;
        const accion = boton.dataset.action;

        if (accion === "view") {
            verLibroPublicado(codigo);
        }

        if (accion === "detail") {
            mostrarFichaPublicado(codigo);
        }
    });
}

/* ==========================================================
   VISUALIZACIÓN DEL LIBRO
========================================================== */

function verLibroPublicado(codigo) {
    const libro = obtenerPublicaciones().find(
        item => item.codigo === codigo
    );

    if (!libro) return;

    if (!libro.url) {
        alert(
            `El libro "${libro.titulo}" todavía no tiene ` +
            "un documento de consulta asociado en este prototipo."
        );
        return;
    }

    // La URL real deberá ser proporcionada por el backend.
    // Solo se permite abrir una dirección HTTPS.
    try {
        const destino = new URL(libro.url, window.location.href);

        if (destino.protocol !== "https:") {
            alert("La dirección de consulta no es válida.");
            return;
        }

        window.open(
            destino.href,
            "_blank",
            "noopener,noreferrer"
        );
    } catch {
        alert("No se pudo abrir el documento.");
    }
}

/* ==========================================================
   FICHA DE PUBLICACIÓN
========================================================== */

function mostrarFichaPublicado(codigo) {
    const libro = obtenerPublicaciones().find(
        item => item.codigo === codigo
    );

    if (!libro) return;

    const modal = document.getElementById("bookModal");
    const titulo = document.getElementById("modalTitle");
    const contenido = document.getElementById("modalDetails");
    const hash = document.getElementById("modalHash");

    if (!modal || !contenido) return;

    if (titulo) {
        titulo.textContent = libro.titulo;
    }

    const datos = [
        ["Código", libro.codigo],
        ["Asignatura", libro.asignatura],
        ["Grado", libro.grado],
        ["Versión oficial", libro.version],
        [
            "Fecha de publicación",
            formatearFechaPublicados(libro.fecha)
        ],
        ["Responsable", libro.responsable],
        ["Estado", libro.estado],
        [
            "Enlace público",
            libro.url || "No disponible en el prototipo"
        ]
    ];

    contenido.replaceChildren();

    datos.forEach(([etiqueta, valor]) => {
        const elemento = document.createElement("div");
        elemento.className = "detail-item";

        const etiquetaElemento = document.createElement("span");
        etiquetaElemento.textContent = etiqueta;

        const valorElemento = document.createElement("strong");
        valorElemento.textContent = valor;

        elemento.append(etiquetaElemento, valorElemento);
        contenido.appendChild(elemento);
    });

    if (hash) {
        hash.textContent =
            libro.hash || "No disponible en el prototipo";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

/* ==========================================================
   MODAL
========================================================== */

function cerrarModal() {
    const modal = document.getElementById("bookModal");

    modal?.classList.remove("open");
    document.body.style.overflow = "";
}

function configurarModalPublicados() {
    const modal = document.getElementById("bookModal");

    modal?.addEventListener("click", evento => {
        if (evento.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            cerrarModal();
        }
    });
}
