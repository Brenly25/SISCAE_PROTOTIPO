
/* ============================================================
   SISCAE - GESTIÓN DE PROYECTOS Y ACTIVOS EDITORIALES
   Archivo: js/pages/activos.js

   Prototipo funcional:
   - Crear y editar proyectos
   - Asignar responsables autorizados
   - Registrar activos editoriales
   - Consultar detalles
   - Reasignar responsables
   - Filtrar activos
   - Mostrar versiones y trazabilidad
   - Persistencia mediante localStorage

   IMPORTANTE:
   No implementa backend, permisos reales, carga efectiva
   de archivos, firmas digitales ni hashes criptográficos.
   ============================================================ */

(() => {
    "use strict";

    /* ========================================================
       CONFIGURACIÓN
       ======================================================== */

    const STORAGE_KEY = "siscae_management_integrated_v1";

    const $ = (id) => document.getElementById(id);

    const USUARIOS = [
        "María López",
        "Carlos Hernández",
        "Ana Martínez",
        "José Ramírez",
        "Sofía Castro",
        "Laura Gómez"
    ];

    const PROYECTOS_INICIALES = [
        {
            id: "PRY-2026-001",
            nombre: "Libros de Ciencias - Tercer Ciclo 2026",
            area: "Educación Básica",
            descripcion:
                "Producción de recursos editoriales de Ciencias Naturales.",
            fecha: "2026-09-01",
            estado: "activo",
            responsables: [
                "María López",
                "Ana Martínez",
                "José Ramírez"
            ]
        },
        {
            id: "PRY-2026-002",
            nombre: "Formación Docente 2026",
            area: "Formación docente",
            descripcion:
                "Desarrollo de guías y recursos para formación docente.",
            fecha: "2026-09-02",
            estado: "activo",
            responsables: [
                "Carlos Hernández",
                "María López"
            ]
        },
        {
            id: "PRY-2026-003",
            nombre: "Matemática - Educación Básica 2026",
            area: "Educación Básica",
            descripcion:
                "Material educativo complementario de Matemática.",
            fecha: "2026-09-03",
            estado: "activo",
            responsables: [
                "Ana Martínez",
                "Laura Gómez"
            ]
        },
        {
            id: "PRY-2026-004",
            nombre: "Estudios Sociales - Segundo Ciclo 2026",
            area: "Segundo Ciclo",
            descripcion:
                "Guías de Estudios Sociales para Segundo Ciclo.",
            fecha: "2026-09-04",
            estado: "activo",
            responsables: [
                "José Ramírez",
                "Carlos Hernández"
            ]
        },
        {
            id: "PRY-2026-005",
            nombre: "Lenguaje - Primer Ciclo 2026",
            area: "Primer Ciclo",
            descripcion:
                "Producción editorial de materiales de Lenguaje.",
            fecha: "2026-09-05",
            estado: "activo",
            responsables: [
                "Sofía Castro",
                "Carlos Hernández"
            ]
        },
        {
            id: "PRY-2026-006",
            nombre: "Primera Infancia 2026",
            area: "Primera Infancia",
            descripcion:
                "Recursos educativos destinados a Primera Infancia.",
            fecha: "2026-09-06",
            estado: "activo",
            responsables: [
                "Laura Gómez",
                "Sofía Castro"
            ]
        }
    ];

    const ACTIVOS_INICIALES = [
        {
            numero: "041",
            nombre: "Libro de Ciencias Naturales",
            proyecto: 0,
            tipo: "libro",
            version: "v3.2",
            responsable: "María López",
            estado: "revision",
            fecha: "24 sep. 2026"
        },
        {
            numero: "037",
            nombre: "Guía metodológica",
            proyecto: 1,
            tipo: "guia",
            version: "v2.0",
            responsable: "Carlos Hernández",
            estado: "publicado",
            fecha: "23 sep. 2026"
        },
        {
            numero: "034",
            nombre: "Material de apoyo de Matemática",
            proyecto: 2,
            tipo: "material",
            version: "v1.4",
            responsable: "Ana Martínez",
            estado: "aprobado",
            fecha: "22 sep. 2026"
        },
        {
            numero: "031",
            nombre: "Guía de Estudios Sociales",
            proyecto: 3,
            tipo: "guia",
            version: "v1.7",
            responsable: "José Ramírez",
            estado: "revision",
            fecha: "21 sep. 2026"
        },
        {
            numero: "025",
            nombre: "Libro de Lenguaje",
            proyecto: 4,
            tipo: "libro",
            version: "v4.1",
            responsable: "Sofía Castro",
            estado: "publicado",
            fecha: "19 sep. 2026"
        },
        {
            numero: "019",
            nombre: "Cuaderno de actividades",
            proyecto: 5,
            tipo: "material",
            version: "v2.3",
            responsable: "Laura Gómez",
            estado: "aprobado",
            fecha: "18 sep. 2026"
        }
    ];

    /* ========================================================
       ESTADO
       ======================================================== */

    let datos = {
        proyectos: [],
        activos: []
    };

    let activoSeleccionadoId = null;
    let temporizadorToast = null;
    let filtroProyectoId = null;
    let inicializado = false;

    /* ========================================================
       UTILIDADES
       ======================================================== */

    function escaparHTML(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalizar(valor) {
        return String(valor ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function fechaISOActual() {
        const fecha = new Date();

        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function fechaActualVisible() {
        return new Date().toLocaleString("es-SV", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatearFecha(fecha) {
        if (!fecha) return "—";

        const partes = String(fecha).split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function obtenerIniciales(nombre) {
        return String(nombre ?? "")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((parte) => parte[0].toUpperCase())
            .join("");
    }

    function nombreTipo(tipo) {
        const tipos = {
            libro: "Libro",
            guia: "Guía",
            material: "Material educativo"
        };

        return tipos[tipo] || tipo;
    }

    function nombreEstado(estado) {
        const estados = {
            registrado: "Registrado",
            revision: "En revisión",
            aprobado: "Aprobado",
            publicado: "Publicado"
        };

        return estados[estado] || estado;
    }

    function claseEstado(estado) {
        const clases = {
            registrado: "status-registered",
            revision: "status-review",
            aprobado: "status-approved",
            publicado: "status-published"
        };

        return clases[estado] || "status-registered";
    }

    function obtenerProyecto(id) {
        return datos.proyectos.find(
            (proyecto) => proyecto.id === id
        ) || null;
    }

    function obtenerActivo(id) {
        return datos.activos.find(
            (activo) => activo.id === id
        ) || null;
    }

    function generarCodigo(prefijo, registros) {
        const anio = new Date().getFullYear();
        const inicio = `${prefijo}-${anio}-`;

        const numeros = registros
            .filter((registro) => registro.id.startsWith(inicio))
            .map((registro) => {
                const numero = registro.id.substring(inicio.length);
                return Number(numero) || 0;
            });

        const siguiente = Math.max(0, ...numeros) + 1;

        return inicio + String(siguiente).padStart(3, "0");
    }

    function clonar(valor) {
        return JSON.parse(JSON.stringify(valor));
    }

    /* ========================================================
       DATOS INICIALES
       ======================================================== */

    function crearDatosIniciales() {
        const proyectos = clonar(PROYECTOS_INICIALES);

        const activos = ACTIVOS_INICIALES.map((item) => {
            const proyecto = proyectos[item.proyecto];

            return {
                id: `ACT-2026-${item.numero}`,
                nombre: item.nombre,
                proyectoId: proyecto.id,
                area: proyecto.area,
                tipo: item.tipo,
                version: item.version,
                responsable: item.responsable,
                estado: item.estado,
                actualizado: item.fecha,
                descripcion:
                    `Recurso editorial del proyecto ${proyecto.nombre}.`,
                archivo: "",
                historial: [
                    {
                        version: item.version,
                        fecha: item.fecha,
                        autor: item.responsable,
                        accion: "Versión registrada"
                    }
                ],
                trazabilidad: [
                    {
                        titulo: "Registro editorial",
                        descripcion:
                            "Recurso incorporado al sistema.",
                        fecha: item.fecha
                    }
                ]
            };
        });

        return {
            proyectos,
            activos
        };
    }

    /* ========================================================
       LOCALSTORAGE
       ======================================================== */

    function cargarDatos() {
        try {
            const almacenados = localStorage.getItem(STORAGE_KEY);

            if (almacenados) {
                const resultado = JSON.parse(almacenados);

                if (
                    resultado &&
                    Array.isArray(resultado.proyectos) &&
                    Array.isArray(resultado.activos)
                ) {
                    datos = resultado;
                    return;
                }
            }
        } catch (error) {
            console.warn(
                "SISCAE: No fue posible recuperar los datos locales.",
                error
            );
        }

        datos = crearDatosIniciales();
    }

    function guardarDatos() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(datos)
            );

            return true;
        } catch (error) {
            console.error(
                "SISCAE: Error al guardar datos.",
                error
            );

            mostrarToast(
                "No fue posible guardar los cambios en el navegador."
            );

            return false;
        }
    }

    /* ========================================================
       NOTIFICACIONES
       ======================================================== */

    function mostrarToast(mensaje) {
        const toast = $("managementToast");

        if (!toast) {
            console.info("SISCAE:", mensaje);
            return;
        }

        toast.textContent = mensaje;
        toast.classList.add("active");

        clearTimeout(temporizadorToast);

        temporizadorToast = setTimeout(() => {
            toast.classList.remove("active");
        }, 3500);
    }

    /* ========================================================
       MODALES
       ======================================================== */

    function abrirModal(id) {
        const modal = $(id);

        if (!modal) {
            console.error(`SISCAE: No existe el modal ${id}`);
            return;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        const primerCampo = modal.querySelector(
            "input:not([type='hidden']), select, textarea"
        );

        if (primerCampo) {
            setTimeout(() => primerCampo.focus(), 50);
        }
    }

    function cerrarModal(id) {
        const modal = $(id);

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const quedanModales = document.querySelector(
            ".management-modal.active"
        );

        if (!quedanModales) {
            document.body.style.removeProperty("overflow");
        }
    }

    function cerrarTodosLosModales() {
        document.querySelectorAll(".management-modal.active")
            .forEach((modal) => {
                cerrarModal(modal.id);
            });
    }

    /* ========================================================
       PESTAÑAS
       ======================================================== */

    function activarPestana(id) {
        document.querySelectorAll(".management-tab")
            .forEach((boton) => {
                const activa = boton.dataset.tab === id;

                boton.classList.toggle("active", activa);

                boton.setAttribute(
                    "aria-selected",
                    String(activa)
                );
            });

        document.querySelectorAll(".management-panel")
            .forEach((panel) => {
                panel.classList.toggle(
                    "active",
                    panel.id === id
                );
            });
    }

    /* ========================================================
       RESUMEN
       ======================================================== */

    function actualizarResumen() {
        const totalProyectos = datos.proyectos.length;
        const totalActivos = datos.activos.length;

        const enRevision = datos.activos.filter(
            (activo) => activo.estado === "revision"
        ).length;

        const publicados = datos.activos.filter(
            (activo) => activo.estado === "publicado"
        ).length;

        $("totalProjects").textContent = totalProyectos;
        $("totalAssets").textContent = totalActivos;
        $("reviewAssets").textContent = enRevision;
        $("publishedAssets").textContent = publicados;
    }

    /* ========================================================
       PROYECTOS - RENDERIZACIÓN
       ======================================================== */

    function renderizarProyectos() {
        const contenedor = $("projectList");

        if (!contenedor) return;

        contenedor.replaceChildren();

        $("projectCount").textContent = datos.proyectos.length;

        if (datos.proyectos.length === 0) {
            contenedor.innerHTML = `
                <div class="management-empty">
                    <strong>No hay proyectos registrados</strong>
                    <span>
                        Utilizá el botón Crear proyecto para comenzar.
                    </span>
                </div>
            `;

            return;
        }

        datos.proyectos.forEach((proyecto) => {
            const totalActivos = datos.activos.filter(
                (activo) => activo.proyectoId === proyecto.id
            ).length;

            const tarjeta = document.createElement("article");
            tarjeta.className = "project-card";

            const responsablesHTML = proyecto.responsables
                .map((nombre) => {
                    return `
                        <span class="responsible-tag">
                            ${escaparHTML(nombre)}
                        </span>
                    `;
                })
                .join("");

            tarjeta.innerHTML = `
                <div class="project-card-top">
                    <div class="project-folder">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 7h7l2 2h9v11H3z"></path>
                        </svg>
                    </div>

                    <span class="project-status ${
                        proyecto.estado === "inactivo"
                            ? "inactive"
                            : ""
                    }">
                        ${
                            proyecto.estado === "activo"
                                ? "Activo"
                                : "Inactivo"
                        }
                    </span>
                </div>

                <h3>${escaparHTML(proyecto.nombre)}</h3>

                <p class="project-description">
                    ${escaparHTML(proyecto.descripcion)}
                </p>

                <div class="project-meta">
                    <div class="project-meta-row">
                        <span>Código</span>
                        <strong>${escaparHTML(proyecto.id)}</strong>
                    </div>

                    <div class="project-meta-row">
                        <span>Área</span>
                        <strong>${escaparHTML(proyecto.area)}</strong>
                    </div>

                    <div class="project-meta-row">
                        <span>Activos registrados</span>
                        <strong>${totalActivos}</strong>
                    </div>

                    <div class="project-meta-row">
                        <span>Fecha de creación</span>
                        <strong>
                            ${escaparHTML(formatearFecha(proyecto.fecha))}
                        </strong>
                    </div>
                </div>

                <div class="project-responsibles">
                    <span>RESPONSABLES AUTORIZADOS</span>

                    <div class="responsible-tags">
                        ${responsablesHTML}
                    </div>
                </div>

                <div class="project-card-actions">
                    <button
                        type="button"
                        data-edit-project="${escaparHTML(proyecto.id)}">
                        Editar proyecto
                    </button>

                    <button
                        type="button"
                        data-project-assets="${escaparHTML(proyecto.id)}">
                        Ver activos
                    </button>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });
    }

    /* ========================================================
       PROYECTOS - RESPONSABLES
       ======================================================== */

    function renderizarSelectorResponsables(
        responsablesSeleccionados = []
    ) {
        const contenedor = $("projectResponsibleList");

        if (!contenedor) return;

        contenedor.innerHTML = USUARIOS.map((usuario, indice) => {
            const seleccionado =
                responsablesSeleccionados.includes(usuario);

            return `
                <label for="projectUser${indice}">
                    <input
                        type="checkbox"
                        id="projectUser${indice}"
                        value="${escaparHTML(usuario)}"
                        ${seleccionado ? "checked" : ""}>

                    <span>${escaparHTML(usuario)}</span>
                </label>
            `;
        }).join("");
    }

    function obtenerResponsablesSeleccionados() {
        return Array.from(
            $("projectResponsibleList").querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map((checkbox) => checkbox.value);
    }

    /* ========================================================
       PROYECTOS - CREACIÓN
       ======================================================== */

    function abrirFormularioProyecto() {
        $("projectForm").reset();

        $("editingProjectId").value = "";
        $("projectModalTitle").textContent =
            "Crear proyecto editorial";

        $("projectDate").value = fechaISOActual();
        $("projectStatus").value = "activo";

        renderizarSelectorResponsables();

        abrirModal("projectModal");
    }

    /* ========================================================
       PROYECTOS - EDICIÓN
       ======================================================== */

    function editarProyecto(id) {
        const proyecto = obtenerProyecto(id);

        if (!proyecto) {
            mostrarToast("No se encontró el proyecto.");
            return;
        }

        $("projectForm").reset();

        $("editingProjectId").value = proyecto.id;

        $("projectModalTitle").textContent =
            "Editar proyecto editorial";

        $("projectName").value = proyecto.nombre;
        $("projectArea").value = proyecto.area;
        $("projectDate").value = proyecto.fecha;
        $("projectDescription").value = proyecto.descripcion;
        $("projectStatus").value = proyecto.estado;

        renderizarSelectorResponsables(
            proyecto.responsables
        );

        abrirModal("projectModal");
    }

    /* ========================================================
       PROYECTOS - GUARDAR
       ======================================================== */

    function guardarProyecto(evento) {
        evento.preventDefault();

        const idEdicion = $("editingProjectId").value;

        const nombre = $("projectName").value.trim();
        const area = $("projectArea").value;
        const fecha = $("projectDate").value;

        const descripcion =
            $("projectDescription").value.trim();

        const estadoProyecto = $("projectStatus").value;

        const responsables =
            obtenerResponsablesSeleccionados();

        if (
            !nombre ||
            !area ||
            !fecha ||
            !descripcion
        ) {
            mostrarToast(
                "Completá todos los campos obligatorios."
            );

            return;
        }

        if (responsables.length === 0) {
            mostrarToast(
                "Seleccioná al menos un responsable autorizado."
            );

            return;
        }

        const existeNombre = datos.proyectos.some(
            (proyecto) =>
                normalizar(proyecto.nombre) === normalizar(nombre) &&
                proyecto.id !== idEdicion
        );

        if (existeNombre) {
            mostrarToast(
                "Ya existe un proyecto con ese nombre."
            );

            return;
        }

        const respaldo = clonar(datos);

        if (idEdicion) {
            const proyecto = obtenerProyecto(idEdicion);

            if (!proyecto) {
                mostrarToast("No se encontró el proyecto.");
                return;
            }

            proyecto.nombre = nombre;
            proyecto.area = area;
            proyecto.fecha = fecha;
            proyecto.descripcion = descripcion;
            proyecto.estado = estadoProyecto;
            proyecto.responsables = responsables;

        } else {
            const nuevoProyecto = {
                id: generarCodigo(
                    "PRY",
                    datos.proyectos
                ),
                nombre,
                area,
                fecha,
                descripcion,
                estado: estadoProyecto,
                responsables
            };

            datos.proyectos.unshift(nuevoProyecto);
        }

        if (!guardarDatos()) {
            datos = respaldo;
            return;
        }

        renderizarTodo();
        cerrarModal("projectModal");
        activarPestana("projectsPanel");

        mostrarToast(
            idEdicion
                ? "Proyecto actualizado correctamente."
                : "Proyecto creado correctamente."
        );
    }

    /* ========================================================
       ACTIVOS - PROYECTOS DISPONIBLES
       ======================================================== */

    function cargarProyectosDisponibles() {
        const select = $("assetProject");

        select.replaceChildren();

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Seleccionar proyecto";

        select.appendChild(inicial);

        datos.proyectos
            .filter((proyecto) => {
                return (
                    proyecto.estado === "activo" &&
                    proyecto.responsables.length > 0
                );
            })
            .forEach((proyecto) => {
                const opcion = document.createElement("option");

                opcion.value = proyecto.id;
                opcion.textContent = proyecto.nombre;

                select.appendChild(opcion);
            });
    }

    function actualizarResponsablesDelActivo() {
        const proyecto = obtenerProyecto(
            $("assetProject").value
        );

        const select = $("assetResponsible");

        select.replaceChildren();

        const inicial = document.createElement("option");
        inicial.value = "";

        inicial.textContent = proyecto
            ? "Seleccionar responsable"
            : "Seleccione primero un proyecto";

        select.appendChild(inicial);

        select.disabled = !proyecto;

        if (!proyecto) {
            $("assetArea").value = "";
            return;
        }

        proyecto.responsables.forEach((nombre) => {
            const opcion = document.createElement("option");

            opcion.value = nombre;
            opcion.textContent = nombre;

            select.appendChild(opcion);
        });

        $("assetArea").value = proyecto.area;
    }

    /* ========================================================
       ACTIVOS - ABRIR FORMULARIO
       ======================================================== */

    function abrirFormularioActivo() {
        const existenProyectos = datos.proyectos.some(
            (proyecto) => {
                return (
                    proyecto.estado === "activo" &&
                    proyecto.responsables.length > 0
                );
            }
        );

        if (!existenProyectos) {
            mostrarToast(
                "Primero creá un proyecto activo con responsables."
            );

            activarPestana("projectsPanel");
            return;
        }

        $("assetForm").reset();

        $("assetVersion").value = "v1.0";

        cargarProyectosDisponibles();
        actualizarResponsablesDelActivo();

        abrirModal("assetModal");
    }

    /* ========================================================
       ACTIVOS - REGISTRAR
       ======================================================== */

    function registrarActivo(evento) {
        evento.preventDefault();

        const proyecto = obtenerProyecto(
            $("assetProject").value
        );

        const nombre = $("assetName").value.trim();
        const tipo = $("assetType").value;
        const area = $("assetArea").value;

        const responsable =
            $("assetResponsible").value;

        const descripcion =
            $("assetDescription").value.trim();

        const archivo = $("assetFile").files[0];

        if (
            !proyecto ||
            proyecto.estado !== "activo"
        ) {
            mostrarToast(
                "Seleccioná un proyecto activo."
            );

            return;
        }

        if (
            !proyecto.responsables.includes(responsable)
        ) {
            mostrarToast(
                "El responsable no está autorizado en ese proyecto."
            );

            return;
        }

        if (
            !nombre ||
            !tipo ||
            !area ||
            !descripcion ||
            !archivo
        ) {
            mostrarToast(
                "Completá todos los campos del activo."
            );

            return;
        }

        const fecha = fechaActualVisible();

        const nuevoActivo = {
            id: generarCodigo(
                "ACT",
                datos.activos
            ),
            nombre,
            proyectoId: proyecto.id,
            area,
            tipo,
            version: "v1.0",
            responsable,
            estado: "registrado",
            actualizado: fecha,
            descripcion,
            archivo: archivo.name,

            historial: [
                {
                    version: "v1.0",
                    fecha,
                    autor: responsable,
                    accion: "Registro de versión inicial"
                }
            ],

            trazabilidad: [
                {
                    titulo: "Registro del activo",
                    descripcion:
                        `Activo incorporado al proyecto ${proyecto.nombre}.`,
                    fecha
                },
                {
                    titulo: "Asignación de responsable",
                    descripcion:
                        `${responsable} fue asignado al activo.`,
                    fecha
                },
                {
                    titulo: "Archivo inicial seleccionado",
                    descripcion:
                        `Archivo: ${archivo.name}. Carga simulada.`,
                    fecha
                }
            ]
        };

        datos.activos.unshift(nuevoActivo);

        if (!guardarDatos()) {
            datos.activos.shift();
            return;
        }

        filtroProyectoId = null;

        $("assetSearch").value = "";
        $("statusFilter").value = "all";
        $("typeFilter").value = "all";

        renderizarTodo();

        cerrarModal("assetModal");
        activarPestana("assetsPanel");

        mostrarToast(
            `Activo ${nuevoActivo.id} registrado correctamente.`
        );
    }

    /* ========================================================
       ACTIVOS - RENDERIZACIÓN
       ======================================================== */

    function renderizarActivos() {
        const contenedor = $("assetList");

        if (!contenedor) return;

        contenedor.replaceChildren();

        datos.activos.forEach((activo) => {
            const proyecto = obtenerProyecto(
                activo.proyectoId
            );

            const fila = document.createElement("article");

            fila.className = "asset-row";

            fila.dataset.id = activo.id;
            fila.dataset.project = activo.proyectoId;
            fila.dataset.status = activo.estado;
            fila.dataset.type = activo.tipo;

            fila.dataset.search = normalizar([
                activo.id,
                activo.nombre,
                activo.responsable,
                activo.area,
                proyecto?.nombre || ""
            ].join(" "));

            fila.innerHTML = `
                <div class="asset-name">
                    <div class="file-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M14 2H6a2 2 0 0 0-2 2v16
                                   a2 2 0 0 0 2 2h12
                                   a2 2 0 0 0 2-2V8z">
                            </path>
                            <polyline
                                points="14 2 14 8 20 8">
                            </polyline>
                        </svg>
                    </div>

                    <div>
                        <strong>
                            ${escaparHTML(activo.nombre)}
                        </strong>

                        <span>
                            ${escaparHTML(activo.area)}
                        </span>
                    </div>
                </div>

                <span>
                    ${escaparHTML(nombreTipo(activo.tipo))}
                </span>

                <strong class="version">
                    ${escaparHTML(activo.version)}
                </strong>

                <div class="responsible">
                    <span class="user-initials">
                        ${escaparHTML(
                            obtenerIniciales(activo.responsable)
                        )}
                    </span>

                    <span>
                        ${escaparHTML(activo.responsable)}
                    </span>
                </div>

                <span class="status ${claseEstado(activo.estado)}">
                    ${escaparHTML(nombreEstado(activo.estado))}
                </span>

                <span>
                    ${escaparHTML(activo.actualizado)}
                </span>

                <button
                    class="row-action"
                    type="button"
                    data-view-id="${escaparHTML(activo.id)}"
                    aria-label="Ver detalles del activo">

                    <svg viewBox="0 0 24 24">
                        <polyline
                            points="9 18 15 12 9 6">
                        </polyline>
                    </svg>
                </button>
            `;

            contenedor.appendChild(fila);
        });

        aplicarFiltros();
    }

    /* ========================================================
       ACTIVOS - FILTROS
       ======================================================== */

    function aplicarFiltros() {
        const busqueda = normalizar(
            $("assetSearch").value
        );

        const estadoFiltro = $("statusFilter").value;
        const tipoFiltro = $("typeFilter").value;

        let visibles = 0;

        document.querySelectorAll(
            "#assetList .asset-row"
        ).forEach((fila) => {
            const coincideBusqueda =
                !busqueda ||
                fila.dataset.search.includes(busqueda);

            const coincideEstado =
                estadoFiltro === "all" ||
                fila.dataset.status === estadoFiltro;

            const coincideTipo =
                tipoFiltro === "all" ||
                fila.dataset.type === tipoFiltro;

            const coincideProyecto =
                !filtroProyectoId ||
                fila.dataset.project === filtroProyectoId;

            const visible =
                coincideBusqueda &&
                coincideEstado &&
                coincideTipo &&
                coincideProyecto;

            fila.hidden = !visible;

            if (visible) {
                visibles++;
            }
        });

        $("resultCount").textContent = visibles;

        $("emptyState").style.display =
            visibles > 0 ? "none" : "block";
    }

    function limpiarFiltros() {
        filtroProyectoId = null;

        $("assetSearch").value = "";
        $("statusFilter").value = "all";
        $("typeFilter").value = "all";

        aplicarFiltros();
    }

    function verActivosDeProyecto(id) {
        const proyecto = obtenerProyecto(id);

        if (!proyecto) {
            mostrarToast("No se encontró el proyecto.");
            return;
        }

        filtroProyectoId = proyecto.id;

        $("assetSearch").value = "";
        $("statusFilter").value = "all";
        $("typeFilter").value = "all";

        activarPestana("assetsPanel");
        aplicarFiltros();
    }

    /* ========================================================
       DETALLE - HISTORIAL Y TRAZABILIDAD
       ======================================================== */

    function renderizarEventos(idContenedor, eventos, esVersion) {
        const contenedor = $(idContenedor);

        if (!contenedor) return;

        contenedor.replaceChildren();

        if (!Array.isArray(eventos) || eventos.length === 0) {
            const mensaje = document.createElement("p");

            mensaje.textContent = "No hay registros disponibles.";
            mensaje.style.padding = "15px";
            mensaje.style.color = "#718597";

            contenedor.appendChild(mensaje);
            return;
        }

        eventos.forEach((evento) => {
            const elemento = document.createElement("div");

            elemento.style.cssText = `
                padding: 14px 0;
                border-bottom: 1px solid #e7edf3;
            `;

            const titulo = document.createElement("strong");

            titulo.style.cssText = `
                display: block;
                color: #285579;
                font-size: 13px;
                margin-bottom: 6px;
            `;

            titulo.textContent = esVersion
                ? `${evento.version} · ${evento.accion}`
                : evento.titulo;

            const descripcion = document.createElement("p");

            descripcion.style.cssText = `
                margin: 0 0 6px;
                color: #60798e;
                font-size: 12px;
                line-height: 1.6;
            `;

            descripcion.textContent = esVersion
                ? evento.autor
                : evento.descripcion;

            const fecha = document.createElement("small");

            fecha.style.color = "#8a9aa8";
            fecha.textContent = evento.fecha;

            elemento.appendChild(titulo);
            elemento.appendChild(descripcion);
            elemento.appendChild(fecha);

            contenedor.appendChild(elemento);
        });
    }

    /* ========================================================
       DETALLE - ABRIR
       ======================================================== */

    function abrirDetalleActivo(id) {
        const activo = obtenerActivo(id);

        if (!activo) {
            mostrarToast("No se encontró el activo.");
            return;
        }

        activoSeleccionadoId = id;

        const proyecto = obtenerProyecto(
            activo.proyectoId
        );

        $("detailAssetName").textContent = activo.nombre;
        $("detailAssetCode").textContent = activo.id;

        $("detailProject").textContent =
            proyecto?.nombre || "Proyecto no disponible";

        $("detailType").textContent =
            nombreTipo(activo.tipo);

        $("detailArea").textContent = activo.area;

        $("detailAssetStatus").textContent =
            nombreEstado(activo.estado);

        $("detailVersion").textContent = activo.version;

        $("detailUpdated").textContent =
            activo.actualizado;

        $("detailDescription").textContent =
            activo.descripcion;

        $("detailResponsible").textContent =
            activo.responsable;

        /* Responsables autorizados del proyecto */

        const selector = $("detailResponsibleSelect");
        selector.replaceChildren();

        const responsablesAutorizados =
            proyecto?.responsables || [];

        const opciones = Array.from(new Set([
            activo.responsable,
            ...responsablesAutorizados
        ]));

        opciones.forEach((nombre) => {
            const opcion = document.createElement("option");

            opcion.value = nombre;

            opcion.textContent =
                responsablesAutorizados.includes(nombre)
                    ? nombre
                    : `${nombre} (asignación anterior)`;

            selector.appendChild(opcion);
        });

        selector.value = activo.responsable;

        renderizarEventos(
            "detailVersionHistory",
            activo.historial,
            true
        );

        renderizarEventos(
            "detailTraceability",
            activo.trazabilidad,
            false
        );

        abrirModal("detailModal");
    }

    /* ========================================================
       DETALLE - REASIGNAR RESPONSABLE
       ======================================================== */

    function guardarReasignacion() {
        const activo = obtenerActivo(
            activoSeleccionadoId
        );

        if (!activo) {
            mostrarToast("No se encontró el activo.");
            return;
        }

        const proyecto = obtenerProyecto(
            activo.proyectoId
        );

        const nuevoResponsable =
            $("detailResponsibleSelect").value;

        if (
            !proyecto ||
            !proyecto.responsables.includes(nuevoResponsable)
        ) {
            mostrarToast(
                "Seleccioná un responsable autorizado en el proyecto."
            );

            return;
        }

        if (nuevoResponsable === activo.responsable) {
            mostrarToast(
                "El responsable seleccionado ya está asignado."
            );

            return;
        }

        const respaldo = clonar(datos);
        const anterior = activo.responsable;
        const fecha = fechaActualVisible();

        activo.responsable = nuevoResponsable;
        activo.actualizado = fecha;

        if (!Array.isArray(activo.trazabilidad)) {
            activo.trazabilidad = [];
        }

        activo.trazabilidad.unshift({
            titulo: "Reasignación de responsable",
            descripcion:
                `Cambio de ${anterior} a ${nuevoResponsable}.`,
            fecha
        });

        if (!guardarDatos()) {
            datos = respaldo;
            return;
        }

        renderizarTodo();
        abrirDetalleActivo(activo.id);

        mostrarToast(
            "Responsable actualizado correctamente."
        );
    }

    /* ========================================================
       RENDERIZACIÓN GENERAL
       ======================================================== */

    function renderizarTodo() {
        renderizarProyectos();
        renderizarActivos();
        actualizarResumen();
    }

    /* ========================================================
       PERFIL
       ======================================================== */

    function alternarPerfil() {
        const perfil = $("profile");

        if (perfil) {
            perfil.classList.toggle("open");
        }
    }

    function cerrarPerfil() {
        $("profile")?.classList.remove("open");
    }

    /* ========================================================
       NAVEGACIÓN
       ======================================================== */

    function abrirAlertas() {
        window.location.href = "alertas.html";
    }

    function abrirAuditoria() {
        const id = activoSeleccionadoId;

        if (!id) return;

        window.location.href =
            "auditoria.html?activo=" +
            encodeURIComponent(id);
    }

    function confirmarCierreSesion() {
        window.location.href = "login.html";
    }

    /* ========================================================
       EVENTOS PRINCIPALES
       ======================================================== */

    function registrarEventos() {
        $("newProjectButton").addEventListener(
            "click",
            abrirFormularioProyecto
        );

        $("newAssetButton").addEventListener(
            "click",
            abrirFormularioActivo
        );

        $("projectForm").addEventListener(
            "submit",
            guardarProyecto
        );

        $("assetForm").addEventListener(
            "submit",
            registrarActivo
        );

        $("assetProject").addEventListener(
            "change",
            actualizarResponsablesDelActivo
        );

        $("saveResponsibleButton").addEventListener(
            "click",
            guardarReasignacion
        );

        $("assetSearch").addEventListener(
            "input",
            aplicarFiltros
        );

        $("statusFilter").addEventListener(
            "change",
            aplicarFiltros
        );

        $("typeFilter").addEventListener(
            "change",
            aplicarFiltros
        );

        $("clearFilters").addEventListener(
            "click",
            limpiarFiltros
        );

        $("profileButton").addEventListener(
            "click",
            alternarPerfil
        );

        $("profileLogout").addEventListener(
            "click",
            () => {
                cerrarPerfil();
                abrirModal("logoutModal");
            }
        );

        $("confirmLogout").addEventListener(
            "click",
            confirmarCierreSesion
        );

        $("notificationButton").addEventListener(
            "click",
            abrirAlertas
        );

        $("viewAuditButton").addEventListener(
            "click",
            abrirAuditoria
        );

        /* Delegación de eventos */

        document.addEventListener("click", (evento) => {
            const cerrar = evento.target.closest(
                "[data-close-modal]"
            );

            if (cerrar) {
                cerrarModal(cerrar.dataset.closeModal);
                return;
            }

            const pestana = evento.target.closest(
                "[data-tab]"
            );

            if (pestana) {
                activarPestana(pestana.dataset.tab);
                return;
            }

            const editar = evento.target.closest(
                "[data-edit-project]"
            );

            if (editar) {
                editarProyecto(editar.dataset.editProject);
                return;
            }

            const verProyecto = evento.target.closest(
                "[data-project-assets]"
            );

            if (verProyecto) {
                verActivosDeProyecto(
                    verProyecto.dataset.projectAssets
                );
                return;
            }

            const verActivo = evento.target.closest(
                "[data-view-id]"
            );

            if (verActivo) {
                abrirDetalleActivo(
                    verActivo.dataset.viewId
                );
                return;
            }

            const salirSidebar = evento.target.closest(
                "#sidebarLogout, [data-logout]"
            );

            if (salirSidebar) {
                evento.preventDefault();
                abrirModal("logoutModal");
                return;
            }

            /* Cerrar menú de perfil al hacer clic fuera */

            if (
                !evento.target.closest("#profile")
            ) {
                cerrarPerfil();
            }
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                cerrarTodosLosModales();
                cerrarPerfil();
            }
        });
    }

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */

    function iniciar() {
        if (inicializado) return;

        const elementosObligatorios = [
            "newProjectButton",
            "newAssetButton",
            "projectForm",
            "assetForm",
            "projectModal",
            "assetModal",
            "projectList",
            "assetList",
            "totalProjects",
            "totalAssets",
            "reviewAssets",
            "publishedAssets",
            "projectCount",
            "resultCount",
            "assetSearch",
            "statusFilter",
            "typeFilter",
            "clearFilters",
            "emptyState",
            "assetProject",
            "assetResponsible",
            "assetArea",
            "assetVersion",
            "projectResponsibleList",
            "detailModal",
            "detailResponsibleSelect",
            "saveResponsibleButton",
            "profile",
            "profileButton",
            "profileLogout",
            "notificationButton",
            "viewAuditButton",
            "confirmLogout"
        ];

        const faltantes = elementosObligatorios.filter(
            (id) => !$(id)
        );

        if (faltantes.length > 0) {
            console.error(
                "SISCAE: Faltan elementos HTML necesarios:",
                faltantes
            );

            return;
        }

        inicializado = true;

        cargarDatos();
        registrarEventos();
        renderizarTodo();

        console.info(
            "SISCAE: Gestión de proyectos y activos inicializada."
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar,
            { once: true }
        );
    } else {
        iniciar();
    }

})();
