/* =====================================================
   SISCAE
   GESTIÓN DE USUARIOS
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           PERFIL
        ================================================= */

        const profile =
            document.getElementById(
                "profile"
            );


        const profileButton =
            document.getElementById(
                "profileButton"
            );


        const profileLogout =
            document.getElementById(
                "profileLogout"
            );


        const notificationButton =
            document.getElementById(
                "notificationButton"
            );


        if (
            profile &&
            profileButton
        ) {

            profileButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    profile.classList.toggle(
                        "open"
                    );

                }
            );

        }


        document.addEventListener(
            "click",
            event => {

                if (!profile) {
                    return;
                }


                if (
                    !profile.contains(
                        event.target
                    )
                ) {

                    profile.classList.remove(
                        "open"
                    );

                }

            }
        );


        /* =================================================
           NOTIFICACIONES
        ================================================= */

        if (notificationButton) {

            notificationButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "alertas.html";

                }
            );

        }


        /* =================================================
           UTILIDADES
        ================================================= */

        function normalizeText(text) {

            return String(text || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );

        }


        function updateBodyLock() {

            const modalOpen =
                document.querySelector(
                    ".modal.active"
                );


            const sidebarOpen =
                document.querySelector(
                    "#sidebar.open"
                );


            if (
                modalOpen ||
                sidebarOpen
            ) {

                document.body.classList.add(
                    "locked"
                );

            } else {

                document.body.classList.remove(
                    "locked"
                );

            }

        }


        /* =================================================
           FILTROS
        ================================================= */

        const searchInput =
            document.getElementById(
                "userSearch"
            );


        const roleFilter =
            document.getElementById(
                "roleFilter"
            );


        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        const clearFilters =
            document.getElementById(
                "clearFilters"
            );


        const resultCount =
            document.getElementById(
                "resultCount"
            );


        const emptyState =
            document.getElementById(
                "emptyState"
            );


        function getUserRows() {

            return document.querySelectorAll(
                ".user-row"
            );

        }


        function filterUsers() {

            const rows =
                getUserRows();


            const search =
                normalizeText(
                    searchInput
                        ? searchInput.value.trim()
                        : ""
                );


            const role =
                roleFilter
                    ? roleFilter.value
                    : "all";


            const status =
                statusFilter
                    ? statusFilter.value
                    : "all";


            let visibleCount = 0;


            rows.forEach(
                row => {


                    const rowSearch =
                        normalizeText(
                            row.dataset.search || ""
                        );


                    const matchesSearch =
                        !search ||
                        rowSearch.includes(
                            search
                        );


                    const matchesRole =
                        role === "all" ||
                        row.dataset.role === role;


                    const matchesStatus =
                        status === "all" ||
                        row.dataset.status === status;


                    const visible =
                        matchesSearch &&
                        matchesRole &&
                        matchesStatus;


                    row.style.display =
                        visible
                            ? ""
                            : "none";


                    if (visible) {

                        visibleCount++;

                    }

                }
            );


            if (resultCount) {

                resultCount.textContent =
                    visibleCount;

            }


            if (emptyState) {

                emptyState.classList.toggle(
                    "active",
                    visibleCount === 0
                );

            }

        }


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterUsers
            );

        }


        if (roleFilter) {

            roleFilter.addEventListener(
                "change",
                filterUsers
            );

        }


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterUsers
            );

        }


        if (clearFilters) {

            clearFilters.addEventListener(
                "click",
                () => {


                    if (searchInput) {

                        searchInput.value = "";

                    }


                    if (roleFilter) {

                        roleFilter.value =
                            "all";

                    }


                    if (statusFilter) {

                        statusFilter.value =
                            "all";

                    }


                    filterUsers();

                }
            );

        }


        /* =================================================
           MODAL REGISTRAR USUARIO
        ================================================= */

        const newUserButton =
            document.getElementById(
                "newUserButton"
            );


        const userModal =
            document.getElementById(
                "userModal"
            );


        const userForm =
            document.getElementById(
                "userForm"
            );


        const accessType =
            document.getElementById(
                "accessType"
            );


        const expirationGroup =
            document.getElementById(
                "expirationGroup"
            );


        const expirationDate =
            document.getElementById(
                "expirationDate"
            );


        function openUserModal() {

            if (!userModal) {
                return;
            }


            userModal.classList.add(
                "active"
            );


            updateBodyLock();

        }


        function closeUserModal() {

            if (!userModal) {
                return;
            }


            userModal.classList.remove(
                "active"
            );


            updateBodyLock();

        }


        if (newUserButton) {

            newUserButton.addEventListener(
                "click",
                openUserModal
            );

        }


        document
            .querySelectorAll(
                "[data-close-user-modal]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        closeUserModal
                    );

                }
            );


        /* =================================================
           TIPO DE ACCESO
        ================================================= */

        function updateAccessFields() {

            if (
                !accessType ||
                !expirationGroup
            ) {

                return;

            }


            const isTemporary =
                accessType.value ===
                "temporary";


            expirationGroup.classList.toggle(
                "active",
                isTemporary
            );


            if (expirationDate) {

                expirationDate.required =
                    isTemporary;


                if (!isTemporary) {

                    expirationDate.value =
                        "";

                }

            }

        }


        if (accessType) {

            accessType.addEventListener(
                "change",
                updateAccessFields
            );


            updateAccessFields();

        }


        /* =================================================
           VALIDACIÓN DE REGISTRO
        ================================================= */

        if (userForm) {

            const userEmail =
                document.getElementById(
                    "userEmail"
                );


            if (userEmail) {

                userEmail.addEventListener(
                    "input",
                    () => {

                        userEmail.setCustomValidity(
                            ""
                        );

                    }
                );

            }


            userForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    if (!userEmail) {
                        return;
                    }


                    const email =
                        userEmail.value
                            .trim()
                            .toLowerCase();


                    if (
                        !email.endsWith(
                            "@clases.edu.sv"
                        )
                    ) {

                        userEmail.setCustomValidity(
                            "Debe utilizar una cuenta institucional @clases.edu.sv"
                        );


                        userEmail.reportValidity();

                        return;

                    }


                    userEmail.setCustomValidity(
                        ""
                    );


                    /*
                       PROTOTIPO

                       El registro se simula.
                    */


                    userForm.reset();


                    updateAccessFields();


                    closeUserModal();

                }
            );

        }


        /* =================================================
           MODAL DETALLE
        ================================================= */

        const detailModal =
            document.getElementById(
                "detailModal"
            );


        const detailView =
            document.getElementById(
                "detailView"
            );


        const accessEditForm =
            document.getElementById(
                "accessEditForm"
            );


        const detailName =
            document.getElementById(
                "detailName"
            );


        const detailEmail =
            document.getElementById(
                "detailEmail"
            );


        const detailRole =
            document.getElementById(
                "detailRole"
            );


        const detailAccess =
            document.getElementById(
                "detailAccess"
            );


        const detailValidity =
            document.getElementById(
                "detailValidity"
            );


        const detailStatus =
            document.getElementById(
                "detailStatus"
            );


        const detailAvatar =
            document.getElementById(
                "detailAvatar"
            );


        const manageUserButton =
            document.getElementById(
                "manageUserButton"
            );


        const cancelEditButton =
            document.getElementById(
                "cancelEditButton"
            );


        /* =================================================
           CAMPOS DE EDICIÓN
        ================================================= */

        const editRole =
            document.getElementById(
                "editRole"
            );


        const editAccess =
            document.getElementById(
                "editAccess"
            );


        const editExpiration =
            document.getElementById(
                "editExpiration"
            );


        const editStatus =
            document.getElementById(
                "editStatus"
            );


        const institutionalValidity =
            document.getElementById(
                "institutionalValidity"
            );


        let selectedUserButton = null;
        let selectedUserRow = null;


        /* =================================================
           INICIALES
        ================================================= */

        function getInitials(name) {

            const words =
                String(name || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);


            if (words.length === 0) {

                return "US";

            }


            if (words.length === 1) {

                return words[0]
                    .substring(0, 2)
                    .toUpperCase();

            }


            return (
                words[0][0] +
                words[1][0]
            ).toUpperCase();

        }


        /* =================================================
           FECHA
        ================================================= */

        function formatExpirationDate(
            value
        ) {

            if (!value) {

                return "Sin vencimiento";

            }


            const parts =
                value.split("-");


            if (parts.length !== 3) {

                return value;

            }


            const date =
                new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    Number(parts[2])
                );


            return new Intl.DateTimeFormat(
                "es-SV",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ).format(date);

        }


        /* =================================================
           VISTA CONSULTA
        ================================================= */

        function showDetailView() {

            if (detailView) {

                detailView.classList.remove(
                    "hidden"
                );

            }


            if (accessEditForm) {

                accessEditForm.classList.remove(
                    "active"
                );

            }

        }


        /* =================================================
           ACCESO EN EDICIÓN
        ================================================= */

        function updateEditAccessFields() {

            if (
                !editAccess ||
                !editExpiration ||
                !institutionalValidity
            ) {

                return;

            }


            const isTemporary =
                editAccess.value ===
                "Temporal";


            editExpiration.classList.toggle(
                "active",
                isTemporary
            );


            editExpiration.required =
                isTemporary;


            institutionalValidity.classList.toggle(
                "hidden",
                isTemporary
            );


            if (!isTemporary) {

                editExpiration.value =
                    "";

            }

        }


        if (editAccess) {

            editAccess.addEventListener(
                "change",
                updateEditAccessFields
            );

        }


        /* =================================================
           VISTA EDICIÓN
        ================================================= */

        function showEditView() {

            if (!selectedUserButton) {

                return;

            }


            if (detailView) {

                detailView.classList.add(
                    "hidden"
                );

            }


            if (accessEditForm) {

                accessEditForm.classList.add(
                    "active"
                );

            }


            if (editRole) {

                editRole.value =
                    selectedUserButton
                        .dataset
                        .roleName ||
                    "Autor";

            }


            if (editAccess) {

                editAccess.value =
                    selectedUserButton
                        .dataset
                        .access ||
                    "Institucional";

            }


            if (editStatus) {

                editStatus.value =
                    selectedUserButton
                        .dataset
                        .statusName ===
                        "Inactivo"
                        ? "Inactivo"
                        : "Activo";

            }


            if (editExpiration) {

                editExpiration.value =
                    selectedUserButton
                        .dataset
                        .expiration ||
                    "";

            }


            updateEditAccessFields();

        }


        /* =================================================
           ABRIR DETALLE
        ================================================= */

        function openDetailModal(
            button
        ) {

            if (!detailModal) {

                return;

            }


            selectedUserButton =
                button;


            selectedUserRow =
                button.closest(
                    ".user-row"
                );


            const name =
                button.dataset.user ||
                "Usuario";


            if (detailName) {

                detailName.textContent =
                    name;

            }


            if (detailEmail) {

                detailEmail.textContent =
                    button.dataset.email ||
                    "—";

            }


            if (detailRole) {

                detailRole.textContent =
                    button.dataset.roleName ||
                    "—";

            }


            if (detailAccess) {

                detailAccess.textContent =
                    button.dataset.access ||
                    "—";

            }


            if (detailValidity) {

                detailValidity.textContent =
                    button.dataset.validity ||
                    "—";

            }


            if (detailStatus) {

                detailStatus.textContent =
                    button.dataset.statusName ||
                    "—";

            }


            if (detailAvatar) {

                detailAvatar.textContent =
                    getInitials(name);

            }


            showDetailView();


            detailModal.classList.add(
                "active"
            );


            updateBodyLock();

        }


        /* =================================================
           CERRAR DETALLE
        ================================================= */

        function closeDetailModal() {

            if (!detailModal) {

                return;

            }


            detailModal.classList.remove(
                "active"
            );


            showDetailView();


            selectedUserButton = null;
            selectedUserRow = null;


            updateBodyLock();

        }


        /* =================================================
           BOTONES DETALLE
        ================================================= */

        document
            .querySelectorAll(
                ".row-action[data-user]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            openDetailModal(
                                button
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-close-detail-modal]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        closeDetailModal
                    );

                }
            );


        /* =================================================
           GESTIONAR ACCESO
        ================================================= */

        if (manageUserButton) {

            manageUserButton.addEventListener(
                "click",
                showEditView
            );

        }


        if (cancelEditButton) {

            cancelEditButton.addEventListener(
                "click",
                showDetailView
            );

        }


        /* =================================================
           GUARDAR CAMBIOS
        ================================================= */

        if (accessEditForm) {

            accessEditForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    if (
                        !selectedUserButton ||
                        !selectedUserRow ||
                        !editRole ||
                        !editAccess ||
                        !editStatus
                    ) {

                        return;

                    }


                    const newRole =
                        editRole.value;


                    const newAccess =
                        editAccess.value;


                    const newStatus =
                        editStatus.value;


                    let newValidity =
                        "Sin vencimiento";


                    let newExpiration =
                        "";


                    /* =====================================
                       ACCESO TEMPORAL
                    ====================================== */

                    if (
                        newAccess ===
                        "Temporal"
                    ) {

                        if (
                            !editExpiration ||
                            !editExpiration.value
                        ) {

                            if (editExpiration) {

                                editExpiration
                                    .reportValidity();

                            }

                            return;

                        }


                        newExpiration =
                            editExpiration.value;


                        newValidity =
                            formatExpirationDate(
                                newExpiration
                            );

                    }


                    /* =====================================
                       ESTADO VISUAL
                    ====================================== */

                    let displayStatus =
                        "Activo";


                    let statusClass =
                        "status-active";


                    let filterStatus =
                        "activo";


                    if (
                        newStatus ===
                        "Inactivo"
                    ) {

                        displayStatus =
                            "Inactivo";


                        statusClass =
                            "status-inactive";


                        filterStatus =
                            "inactivo";


                        newValidity =
                            "Acceso suspendido";

                    }

                    else if (
                        newAccess ===
                        "Temporal"
                    ) {

                        displayStatus =
                            "Temporal";


                        statusClass =
                            "status-temporary";


                        filterStatus =
                            "temporal";

                    }


                    /* =====================================
                       DATA DEL BOTÓN
                    ====================================== */

                    selectedUserButton
                        .dataset
                        .roleName =
                        newRole;


                    selectedUserButton
                        .dataset
                        .access =
                        newAccess;


                    selectedUserButton
                        .dataset
                        .validity =
                        newValidity;


                    selectedUserButton
                        .dataset
                        .statusName =
                        displayStatus;


                    selectedUserButton
                        .dataset
                        .expiration =
                        newExpiration;


                    /* =====================================
                       CELDAS
                    ====================================== */

                    const roleCell =
                        selectedUserRow
                            .querySelector(
                                ".user-role-cell"
                            );


                    const accessCell =
                        selectedUserRow
                            .querySelector(
                                ".user-access-cell"
                            );


                    const validityCell =
                        selectedUserRow
                            .querySelector(
                                ".user-validity-cell"
                            );


                    const statusCell =
                        selectedUserRow
                            .querySelector(
                                ".user-status-cell"
                            );


                    if (roleCell) {

                        roleCell.textContent =
                            newRole;

                    }


                    if (accessCell) {

                        accessCell.textContent =
                            newAccess;

                    }


                    if (validityCell) {

                        validityCell.textContent =
                            newValidity;

                    }


                    if (statusCell) {

                        statusCell.classList.remove(
                            "status-active",
                            "status-temporary",
                            "status-inactive"
                        );


                        statusCell.classList.add(
                            statusClass
                        );


                        statusCell.textContent =
                            displayStatus;

                    }


                    /* =====================================
                       FILTROS
                    ====================================== */

                    selectedUserRow
                        .dataset
                        .role =
                        normalizeText(
                            newRole
                        );


                    selectedUserRow
                        .dataset
                        .status =
                        filterStatus;


                    /* =====================================
                       DETALLE
                    ====================================== */

                    if (detailRole) {

                        detailRole.textContent =
                            newRole;

                    }


                    if (detailAccess) {

                        detailAccess.textContent =
                            newAccess;

                    }


                    if (detailValidity) {

                        detailValidity.textContent =
                            newValidity;

                    }


                    if (detailStatus) {

                        detailStatus.textContent =
                            displayStatus;

                    }


                    showDetailView();


                    filterUsers();

                }
            );

        }


        /* =================================================
           CERRAR SESIÓN
        ================================================= */

        const logoutModal =
            document.getElementById(
                "logoutModal"
            );


        const confirmLogout =
            document.getElementById(
                "confirmLogout"
            );


        function openLogoutModal() {

            if (!logoutModal) {

                return;

            }


            logoutModal.classList.add(
                "active"
            );


            if (profile) {

                profile.classList.remove(
                    "open"
                );

            }


            updateBodyLock();

        }


        function closeLogoutModal() {

            if (!logoutModal) {

                return;

            }


            logoutModal.classList.remove(
                "active"
            );


            updateBodyLock();

        }


        /* =================================================
           LOGOUT DESDE PERFIL
        ================================================= */

        if (profileLogout) {

            profileLogout.addEventListener(
                "click",
                openLogoutModal
            );

        }


        /* =================================================
           LOGOUT DESDE SIDEBAR

           El sidebar se carga dinámicamente desde
           components.js, por eso se usa delegación.
        ================================================= */

        document.addEventListener(
            "click",
            event => {

                const sidebarLogout =
                    event.target.closest(
                        "#sidebarLogout"
                    );


                if (!sidebarLogout) {

                    return;

                }


                event.preventDefault();


                openLogoutModal();

            }
        );


        document
            .querySelectorAll(
                "[data-close-logout-modal]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        closeLogoutModal
                    );

                }
            );


        if (confirmLogout) {

            confirmLogout.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "login.html";

                }
            );

        }


        /* =================================================
           TECLA ESCAPE
        ================================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                /* REGISTRO */

                if (
                    userModal &&
                    userModal.classList.contains(
                        "active"
                    )
                ) {

                    closeUserModal();

                    return;

                }


                /* DETALLE */

                if (
                    detailModal &&
                    detailModal.classList.contains(
                        "active"
                    )
                ) {

                    if (
                        accessEditForm &&
                        accessEditForm
                            .classList
                            .contains(
                                "active"
                            )
                    ) {

                        showDetailView();

                    } else {

                        closeDetailModal();

                    }


                    return;

                }


                /* LOGOUT */

                if (
                    logoutModal &&
                    logoutModal.classList.contains(
                        "active"
                    )
                ) {

                    closeLogoutModal();

                    return;

                }


                /* PERFIL */

                if (
                    profile &&
                    profile.classList.contains(
                        "open"
                    )
                ) {

                    profile.classList.remove(
                        "open"
                    );

                }

            }
        );


        /* =================================================
           INICIALIZACIÓN
        ================================================= */

        filterUsers();

    }
);