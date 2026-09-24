document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS DE DEMOSTRACIÓN
       Con Firebase, estos arreglos se reemplazan por la
       consulta a Firestore filtrando por el uid del
       usuario autenticado.
    ====================================================== */

    const assets = [
        { nombre: "Libro de Matemática", tipo: "Libro", estado: "revision", permiso: "Edición", modificado: "Hoy, 10:42 a. m." },
        { nombre: "Guía docente", tipo: "Documento", estado: "edicion", permiso: "Edición", modificado: "Hoy, 9:15 a. m." },
        { nombre: "Ciencias Naturales", tipo: "Libro", estado: "edicion", permiso: "Edición", modificado: "Ayer, 11:08 a. m." },
        { nombre: "Portada Unidad 4", tipo: "Imagen", estado: "aprobado", permiso: "Solo lectura", modificado: "Ayer, 3:30 p. m." },
        { nombre: "Cuadernillo de Lenguaje", tipo: "Documento", estado: "revision", permiso: "Edición", modificado: "Lun, 2:20 p. m." },
        { nombre: "Mapa de El Salvador", tipo: "Imagen", estado: "aprobado", permiso: "Solo lectura", modificado: "Vie, 8:50 a. m." }
    ];

    const activity = [
        { accion: "Modificación", detalle: "Nueva versión guardada", icono: "version", recurso: "Libro de Matemática", origen: "Equipo registrado", fecha: "Hoy, 10:42 a. m." },
        { accion: "Activo consultado", detalle: "Visualización registrada", icono: "view", recurso: "Guía docente", origen: "Equipo registrado", fecha: "Hoy, 9:15 a. m." },
        { accion: "Enviado a revisión", detalle: "Asignado a Carlos Pérez", icono: "send", recurso: "Cuadernillo de Lenguaje", origen: "Equipo registrado", fecha: "Lun, 2:20 p. m." },
        { accion: "Inicio de sesión", detalle: "Acceso desde un equipo nuevo", icono: "login", recurso: "Cuenta institucional", origen: "Equipo nuevo", fecha: "Lun, 7:58 a. m." }
    ];

    const statusLabels = {
        edicion: "En edición",
        revision: "En revisión",
        aprobado: "Aprobado"
    };

    // Mismo estilo de íconos que usa el admin
    const icons = {
        Libro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
        Documento: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line>',
        Imagen: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
        version: '<path d="M21 12a9 9 0 1 1-2.64-6.36"></path><polyline points="21 3 21 9 15 9"></polyline>',
        view: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle>',
        send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
        login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>',
        add: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'
    };

    let currentFilter = "todos";


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const mobileOverlay = document.getElementById("mobileOverlay");

    const profile = document.getElementById("profile");
    const profileButton = document.getElementById("profileButton");
    const notificationButton = document.getElementById("notificationButton");

    const logoutModal = document.getElementById("logoutModal");
    const sidebarLogout = document.getElementById("sidebarLogout");
    const profileLogout = document.getElementById("profileLogout");
    const confirmLogout = document.getElementById("confirmLogout");

    const assetModal = document.getElementById("assetModal");
    const openAssetModal = document.getElementById("openAssetModal");
    const assetForm = document.getElementById("assetForm");
    const assetName = document.getElementById("assetName");
    const assetType = document.getElementById("assetType");
    const assetNameError = document.getElementById("assetNameError");

    const currentDate = document.getElementById("currentDate");
    const greeting = document.getElementById("greeting");
    const assetsList = document.getElementById("assetsList");
    const activityList = document.getElementById("activityList");
    const filterTabs = document.querySelectorAll(".filter-tab");
    const toast = document.getElementById("toast");


    /* =====================================================
       UTILIDADES
    ====================================================== */

    // Evita inyectar HTML con lo que escribe el usuario
    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function formatNow() {
        const time = new Intl.DateTimeFormat("es-SV", {
            hour: "numeric",
            minute: "2-digit"
        }).format(new Date());

        return `Hoy, ${time}`;
    }


    /* =====================================================
       FECHA Y SALUDO
    ====================================================== */

    if (currentDate) {
        currentDate.textContent =
            new Intl.DateTimeFormat("es-SV", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date());
    }

    if (greeting) {
        const hour = new Date().getHours();
        const name = "Ana"; // luego vendrá de Firebase Auth

        let text = "Buenas noches";

        if (hour >= 5 && hour < 12) {
            text = "Buenos días";
        } else if (hour >= 12 && hour < 18) {
            text = "Buenas tardes";
        }

        greeting.textContent = `${text}, ${name}`;
    }


    /* =====================================================
       MIS ACTIVOS
    ====================================================== */

    function renderAssets() {

        if (!assetsList) return;

        const visible =
            currentFilter === "todos"
                ? assets
                : assets.filter(asset => asset.estado === currentFilter);

        if (visible.length === 0) {
            assetsList.innerHTML =
                '<div class="activity-empty">No tiene activos con este estado.</div>';
            return;
        }

        assetsList.innerHTML = visible.map(asset => `
            <div class="activity-row">
                <div class="activity-event">
                    <div class="event-icon">
                        <svg viewBox="0 0 24 24">${icons[asset.tipo] || icons.Documento}</svg>
                    </div>
                    <div>
                        <strong>${escapeHTML(asset.nombre)}</strong>
                        <span>${asset.tipo}</span>
                    </div>
                </div>
                <span>
                    <span class="status-pill status-pill--${asset.estado}">
                        ${statusLabels[asset.estado]}
                    </span>
                </span>
                <span>${asset.permiso}</span>
                <span>${asset.modificado}</span>
            </div>
        `).join("");
    }

    function updateStats() {

        const counts = {
            total: assets.length,
            edicion: assets.filter(a => a.estado === "edicion").length,
            revision: assets.filter(a => a.estado === "revision").length,
            aprobado: assets.filter(a => a.estado === "aprobado").length
        };

        document.querySelectorAll("[data-stat]").forEach(element => {
            element.textContent = counts[element.dataset.stat];
        });
    }

    function setFilter(filter) {

        currentFilter = filter;

        filterTabs.forEach(tab => {
            const isActive = tab.dataset.filter === filter;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        renderAssets();
    }

    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => setFilter(tab.dataset.filter));
    });


    /* =====================================================
       MI ACTIVIDAD
    ====================================================== */

    function renderActivity() {

        if (!activityList) return;

        activityList.innerHTML = activity.slice(0, 5).map(item => `
            <div class="activity-row">
                <div class="activity-event">
                    <div class="event-icon">
                        <svg viewBox="0 0 24 24">${icons[item.icono]}</svg>
                    </div>
                    <div>
                        <strong>${item.accion}</strong>
                        <span>${item.detalle}</span>
                    </div>
                </div>
                <span>${escapeHTML(item.recurso)}</span>
                <span>${item.origen}</span>
                <span>${item.fecha}</span>
            </div>
        `).join("");
    }

    renderAssets();
    updateStats();
    renderActivity();


    /* =====================================================
       MENÚ MOBILE
    ====================================================== */

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add("open");
        mobileOverlay?.classList.add("active");
        document.body.classList.add("locked");
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove("open");
        mobileOverlay?.classList.remove("active");
        document.body.classList.remove("locked");
    }

    menuButton?.addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    mobileOverlay?.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 950) closeSidebar();
        });
    });


    /* =====================================================
       PERFIL
    ====================================================== */

    profileButton?.addEventListener("click", event => {
        event.stopPropagation();
        profile.classList.toggle("open");
    });

    document.addEventListener("click", event => {
        if (profile && !profile.contains(event.target)) {
            profile.classList.remove("open");
        }
    });


    /* =====================================================
       NOTIFICACIONES
       El usuario no tiene página de alertas: la campana
       lleva a la tarjeta de pendientes.
    ====================================================== */

    notificationButton?.addEventListener("click", () => {
        document
            .getElementById("pendientes")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });


    /* =====================================================
       MODALES
    ====================================================== */

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add("active");
        document.body.classList.add("locked");
        profile?.classList.remove("open");
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("active");
        document.body.classList.remove("locked");
    }

    // Cada [data-close-modal] cierra el modal que lo contiene
    document.querySelectorAll("[data-close-modal]").forEach(element => {
        element.addEventListener("click", () => {
            closeModal(element.closest(".modal"));
        });
    });


    /* =====================================================
       CERRAR SESIÓN
       Prototipo: regresa al login. Con Firebase Auth
       aquí se llamará a signOut().
    ====================================================== */

    sidebarLogout?.addEventListener("click", () => openModal(logoutModal));
    profileLogout?.addEventListener("click", () => openModal(logoutModal));

    confirmLogout?.addEventListener("click", () => {
        window.location.href = "login.html";
    });


    /* =====================================================
       REGISTRAR ACTIVO
       Prototipo: se guarda solo en memoria.
    ====================================================== */

    function clearNameError() {
        assetName.classList.remove("invalid");
        assetNameError.textContent = "";
    }

    openAssetModal?.addEventListener("click", () => {
        assetForm.reset();
        clearNameError();
        openModal(assetModal);
        setTimeout(() => assetName.focus(), 50);
    });

    assetName?.addEventListener("input", clearNameError);

    assetForm?.addEventListener("submit", event => {

        event.preventDefault();

        const name = assetName.value.trim();

        if (name.length < 3) {
            assetName.classList.add("invalid");
            assetNameError.textContent =
                "Escriba un nombre de al menos 3 caracteres.";
            assetName.focus();
            return;
        }

        const now = formatNow();

        assets.unshift({
            nombre: name,
            tipo: assetType.value,
            estado: "edicion",
            permiso: "Edición",
            modificado: now
        });

        activity.unshift({
            accion: "Activo registrado",
            detalle: "Alta de recurso editorial",
            icono: "add",
            recurso: name,
            origen: "Equipo registrado",
            fecha: now
        });

        closeModal(assetModal);
        setFilter("todos");
        updateStats();
        renderActivity();
        showToast(`Activo registrado: ${name}`);
    });


    /* =====================================================
       AVISO
    ====================================================== */

    let toastTimer;

    function showToast(message) {

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
    }

    document.getElementById("requestAccess")?.addEventListener("click", event => {
        event.preventDefault();
        showToast("Solicitud de acceso enviada al administrador");
    });


    /* =====================================================
       TECLA ESCAPE Y RESIZE
    ====================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        closeModal(logoutModal);
        closeModal(assetModal);
        profile?.classList.remove("open");

        if (window.innerWidth <= 950) closeSidebar();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 950) closeSidebar();
    });

});