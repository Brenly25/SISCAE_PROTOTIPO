
/* ==========================================================
   SISCAE - ACTIVOS APROBADOS
   Archivo: js/pages/aprobados.js
   Panel del administrador
========================================================== */

"use strict";

/* ==========================================================
   1. DATOS DE DEMOSTRACIÓN
========================================================== */

const activosAprobados = [
    {
        id: "APR-2026-001",
        nombre: "Guía de Matemática - Quinto Grado",
        proyecto: "Materiales Educativos 2026",
        tipo: "documento",
        version: "2.1",
        fechaAprobacion: "2026-09-22",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    },
    {
        id: "APR-2026-002",
        nombre: "Ciencias Naturales - Cuarto Grado",
        proyecto: "Materiales Educativos 2026",
        tipo: "documento",
        version: "1.2",
        fechaAprobacion: "2026-09-25",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    },
    {
        id: "APR-2026-003",
        nombre: "Infografía del Sistema Solar",
        proyecto: "Recursos Multimedia",
        tipo: "imagen",
        version: "1.0",
        fechaAprobacion: "2026-09-29",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    },
    {
        id: "APR-2026-004",
        nombre: "Video educativo - Ciclo del Agua",
        proyecto: "Recursos Multimedia",
        tipo: "video",
        version: "1.1",
        fechaAprobacion: "2026-10-02",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    },
    {
        id: "APR-2026-005",
        nombre: "Lecturas para Tercer Grado",
        proyecto: "Lectoescritura Escolar",
        tipo: "documento",
        version: "1.3",
        fechaAprobacion: "2026-10-04",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    },
    {
        id: "APR-2026-006",
        nombre: "Audio de Comprensión Lectora",
        proyecto: "Lectoescritura Escolar",
        tipo: "audio",
        version: "1.0",
        fechaAprobacion: "2026-10-06",
        aprobadoPor: "Revisor editorial",
        estado: "aprobado"
    }
];

/*
   Estos registros son demostrativos.
   En producción deben provenir del backend de SISCAE.
*/

let activoSeleccionado = null;

/* ==========================================================
   2. INICIALIZACIÓN
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    inicializarAprobados();

});

function inicializarAprobados() {

    cargarFiltroProyectos();

    actualizarIndicadores();

    renderizarAprobados();

    configurarFiltros();

    configurarTabla();

    configurarModalPublicacion();

}

/* ==========================================================
   3. FUNCIONES AUXILIARES
========================================================== */

function obtenerElemento(id) {
    return document.getElementById(id);
}

function escaparHTML(valor) {

    const elemento = document.createElement("div");

    elemento.textContent = String(valor ?? "");

    return elemento.innerHTML;

}

function formatearFecha(fecha) {

    if (!fecha) {
        return "No disponible";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

function obtenerTipoLegible(tipo) {

    const tipos = {
        documento: "Documento",
        imagen: "Imagen",
        video: "Video",
        audio: "Audio"
    };

    return tipos[tipo] || "Archivo";

}

function obtenerPendientes() {

    return activosAprobados.filter(
        activo => activo.estado === "aprobado"
    );

}

/* ==========================================================
   4. INDICADORES
========================================================== */

function actualizarIndicadores() {

    const pendientes = obtenerPendientes();

    const proyectos = new Set(
        pendientes.map(activo => activo.proyecto)
    );

    const totalApproved = obtenerElemento("totalApproved");
    const pendingPublication = obtenerElemento("pendingPublication");
    const relatedProjects = obtenerElemento("relatedProjects");

    if (totalApproved) {
        totalApproved.textContent = pendientes.length;
    }

    if (pendingPublication) {
        pendingPublication.textContent = pendientes.length;
    }

    if (relatedProjects) {
        relatedProjects.textContent = proyectos.size;
    }

}

/* ==========================================================
   5. FILTRO DE PROYECTOS
========================================================== */

function cargarFiltroProyectos() {

    const select = obtenerElemento("filterProject");

    if (!select) {
        return;
    }

    const proyectos = [
        ...new Set(
            obtenerPendientes().map(activo => activo.proyecto)
        )
    ].sort((a, b) => a.localeCompare(b, "es"));

    select.innerHTML = `
        <option value="todos">
            Todos los proyectos
        </option>
    `;

    proyectos.forEach(proyecto => {

        const opcion = document.createElement("option");

        opcion.value = proyecto;
        opcion.textContent = proyecto;

        select.appendChild(opcion);

    });

}

/* ==========================================================
   6. FILTRADO
========================================================== */

function filtrarAprobados() {

    const busqueda = (
        obtenerElemento("searchApproved")?.value || ""
    ).trim().toLocaleLowerCase("es");

    const proyecto = (
        obtenerElemento("filterProject")?.value || "todos"
    );

    const tipo = (
        obtenerElemento("filterType")?.value || "todos"
    );

    return obtenerPendientes().filter(activo => {

        const contenido = [
            activo.id,
            activo.nombre,
            activo.proyecto,
            activo.tipo,
            activo.aprobadoPor
        ].join(" ").toLocaleLowerCase("es");

        const coincideBusqueda = contenido.includes(busqueda);

        const coincideProyecto =
            proyecto === "todos" ||
            activo.proyecto === proyecto;

        const coincideTipo =
            tipo === "todos" ||
            activo.tipo === tipo;

        return (
            coincideBusqueda &&
            coincideProyecto &&
            coincideTipo
        );

    });

}

/* ==========================================================
   7. RENDERIZADO DE TABLA
========================================================== */

function renderizarAprobados() {

    const tbody = obtenerElemento("approvedTableBody");

    if (!tbody) {
        return;
    }

    const filtrados = filtrarAprobados();

    tbody.innerHTML = "";

    filtrados.forEach(activo => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                <strong>
                    ${escaparHTML(activo.nombre)}
                </strong>

                <small>
                    ${escaparHTML(activo.id)}
                    · ${escaparHTML(obtenerTipoLegible(activo.tipo))}
                </small>
            </td>

            <td>
                ${escaparHTML(activo.proyecto)}
            </td>

            <td>
                v${escaparHTML(activo.version)}
            </td>

            <td>
                ${formatearFecha(activo.fechaAprobacion)}
            </td>

            <td>
                <span class="status-approved">
                    Aprobado
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="btn-publish"
                    data-publicar="${escaparHTML(activo.id)}"
                >
                    Publicar
                </button>
            </td>
        `;

        tbody.appendChild(fila);

    });

    const contador = obtenerElemento("approvedCount");

    if (contador) {

        contador.textContent =
            `${filtrados.length} de ` +
            `${obtenerPendientes().length} activos aprobados`;

    }

    const estadoVacio = obtenerElemento("emptyApproved");

    if (estadoVacio) {
        estadoVacio.hidden = filtrados.length > 0;
    }

}

/* ==========================================================
   8. EVENTOS DE FILTROS
========================================================== */

function configurarFiltros() {

    obtenerElemento("searchApproved")
        ?.addEventListener("input", renderizarAprobados);

    obtenerElemento("filterProject")
        ?.addEventListener("change", renderizarAprobados);

    obtenerElemento("filterType")
        ?.addEventListener("change", renderizarAprobados);

}

/* ==========================================================
   9. ACCIONES DE TABLA
========================================================== */

function configurarTabla() {

    const tbody = obtenerElemento("approvedTableBody");

    tbody?.addEventListener("click", evento => {

        const boton = evento.target.closest(
            "[data-publicar]"
        );

        if (!boton) {
            return;
        }

        abrirModalPublicacion(boton.dataset.publicar);

    });

}

/* ==========================================================
   10. ABRIR MODAL DE PUBLICACIÓN
========================================================== */

function abrirModalPublicacion(id) {

    const activo = obtenerPendientes().find(
        item => item.id === id
    );

    if (!activo) {
        return;
    }

    activoSeleccionado = activo;

    const modal = obtenerElemento("publishModal");
    const nombre = obtenerElemento("publishAssetName");
    const codigo = obtenerElemento("publishAssetCode");
    const input = obtenerElemento("totpCode");
    const error = obtenerElemento("publishError");

    if (!modal) {
        return;
    }

    if (nombre) {
        nombre.textContent = activo.nombre;
    }

    if (codigo) {
        codigo.textContent = `${activo.id} · v${activo.version}`;
    }

    if (input) {
        input.value = "";
    }

    if (error) {
        error.textContent = "";
        error.hidden = true;
    }

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    input?.focus();

}

/* ==========================================================
   11. CERRAR MODAL
========================================================== */

function cerrarModalPublicacion() {

    const modal = obtenerElemento("publishModal");

    if (modal) {
        modal.hidden = true;
    }

    document.body.style.overflow = "";

    activoSeleccionado = null;

}

/* ==========================================================
   12. MOSTRAR ERRORES
========================================================== */

function mostrarErrorPublicacion(mensaje) {

    const error = obtenerElemento("publishError");

    if (!error) {
        return;
    }

    error.textContent = mensaje;
    error.hidden = false;

}

/* ==========================================================
   13. VALIDACIÓN DEL FORMATO TOTP
========================================================== */

function validarFormatoTOTP(codigo) {

    return /^\d{6}$/.test(codigo);

}

/* ==========================================================
   14. CONFIRMACIÓN DE PUBLICACIÓN
========================================================== */

function confirmarPublicacion() {

    if (!activoSeleccionado) {
        return;
    }

    const codigo = (
        obtenerElemento("totpCode")?.value || ""
    ).trim();

    if (!validarFormatoTOTP(codigo)) {

        mostrarErrorPublicacion(
            "Ingrese un código de verificación de seis dígitos."
        );

        return;
    }

    /*
       PROTOTIPO SISCAE

       Aquí NO se valida realmente Google Authenticator.

       En la versión funcional, el backend debe:
       1. Comprobar permisos del usuario.
       2. Verificar el TOTP en el servidor.
       3. Registrar la publicación y su auditoría.
       4. Cambiar el estado a "publicado".
       5. Devolver la fecha, versión y enlace autorizado.

       No se modifica el estado sin esas comprobaciones.
    */

    mostrarErrorPublicacion(
        "La publicación está disponible solo como prototipo. " +
        "La verificación de Google Authenticator requiere " +
        "conexión con el servidor de SISCAE."
    );

}

/* ==========================================================
   15. EVENTOS DEL MODAL
========================================================== */

function configurarModalPublicacion() {

    const modal = obtenerElemento("publishModal");

    obtenerElemento("closePublishModal")
        ?.addEventListener(
            "click",
            cerrarModalPublicacion
        );

    obtenerElemento("cancelPublish")
        ?.addEventListener(
            "click",
            cerrarModalPublicacion
        );

    obtenerElemento("confirmPublish")
        ?.addEventListener(
            "click",
            confirmarPublicacion
        );

    modal?.addEventListener("click", evento => {

        if (evento.target === modal) {
            cerrarModalPublicacion();
        }

    });

    document.addEventListener("keydown", evento => {

        if (
            evento.key === "Escape" &&
            modal &&
            !modal.hidden
        ) {
            cerrarModalPublicacion();
        }

    });

    obtenerElemento("totpCode")
        ?.addEventListener("input", evento => {

            evento.target.value = evento.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

            const error = obtenerElemento("publishError");

            if (error) {
                error.hidden = true;
            }

        });

}
