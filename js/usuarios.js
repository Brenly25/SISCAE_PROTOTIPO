document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS GENERALES
    ====================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("menuButton");

    const mobileOverlay =
        document.getElementById("mobileOverlay");

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const notificationButton =
        document.getElementById("notificationButton");


    /* =====================================================
       SIDEBAR MOBILE
    ====================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (mobileOverlay) {
            mobileOverlay.classList.add("active");
        }

        document.body.classList.add("locked");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (mobileOverlay) {
            mobileOverlay.classList.remove("active");
        }

        document.body.classList.remove("locked");
    }


    if (menuButton) {

        menuButton.addEventListener("click", () => {

            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });

    }


    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    document
        .querySelectorAll(".sidebar-nav .nav-item")
        .forEach((item) => {

            item.addEventListener("click", () => {

                if (window.innerWidth <= 950) {
                    closeSidebar();
                }

            });

        });


    /* =====================================================
       PERFIL
    ====================================================== */

    if (profile && profileButton) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profile.classList.toggle("open");

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            if (!profile) return;

            if (!profile.contains(event.target)) {
                profile.classList.remove("open");
            }

        }
    );


    /* =====================================================
       NOTIFICACIONES
    ====================================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "alertas.html";

            }
        );

    }


    /* =====================================================
       FILTROS
    ====================================================== */

    const searchInput =
        document.getElementById("userSearch");

    const roleFilter =
        document.getElementById("roleFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const clearFilters =
        document.getElementById("clearFilters");

    const resultCount =
        document.getElementById("resultCount");

    const emptyState =
        document.getElementById("emptyState");


    function getUserRows() {

        return document.querySelectorAll(
            ".user-row"
        );

    }


    function normalizeText(text) {

        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }


    function filterUsers() {

        const userRows =
            getUserRows();


        const searchValue =
            normalizeText(
                searchInput
                    ? searchInput.value.trim()
                    : ""
            );


        const selectedRole =
            roleFilter
                ? roleFilter.value
                : "all";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";


        let visibleCount = 0;


        userRows.forEach((row) => {

            const searchableText =
                normalizeText(
                    row.dataset.search || ""
                );


            const role =
                row.dataset.role;


            const status =
                row.dataset.status;


            const matchesSearch =
                !searchValue ||
                searchableText.includes(
                    searchValue
                );


            const matchesRole =
                selectedRole === "all" ||
                role === selectedRole;


            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


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

        });


        if (resultCount) {

            resultCount.textContent =
                visibleCount;

        }


        if (emptyState) {

            if (visibleCount === 0) {

                emptyState.classList.add(
                    "active"
                );

            } else {

                emptyState.classList.remove(
                    "active"
                );

            }

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
                    roleFilter.value = "all";
                }

                if (statusFilter) {
                    statusFilter.value = "all";
                }

                filterUsers();

            }
        );

    }


    /* =====================================================
       MODAL NUEVO USUARIO
    ====================================================== */

    const newUserButton =
        document.getElementById("newUserButton");

    const userModal =
        document.getElementById("userModal");

    const userForm =
        document.getElementById("userForm");

    const accessType =
        document.getElementById("accessType");

    const expirationGroup =
        document.getElementById("expirationGroup");

    const expirationDate =
        document.getElementById("expirationDate");


    function openUserModal() {

        if (!userModal) return;

        userModal.classList.add("active");

        document.body.classList.add("locked");

    }


    function closeUserModal() {

        if (!userModal) return;

        userModal.classList.remove("active");

        document.body.classList.remove("locked");

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
        .forEach((button) => {

            button.addEventListener(
                "click",
                closeUserModal
            );

        });


    /* =====================================================
       ACCESO TEMPORAL - NUEVO USUARIO
    ====================================================== */

    function updateAccessFields() {

        if (!accessType || !expirationGroup) {
            return;
        }


        if (accessType.value === "temporary") {

            expirationGroup.classList.add(
                "active"
            );

            if (expirationDate) {
                expirationDate.required = true;
            }

        } else {

            expirationGroup.classList.remove(
                "active"
            );

            if (expirationDate) {

                expirationDate.required = false;
                expirationDate.value = "";

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


    /* =====================================================
       VALIDACIÓN CORREO
    ====================================================== */

    if (userForm) {

        userForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "userEmail"
                    );


                if (!emailInput) {
                    return;
                }


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                if (
                    !email.endsWith(
                        "@clases.edu.sv"
                    )
                ) {

                    emailInput.setCustomValidity(
                        "Debe utilizar una cuenta institucional @clases.edu.sv"
                    );

                    emailInput.reportValidity();

                    return;

                }


                emailInput.setCustomValidity("");


                /*
                    PROTOTIPO

                    Posteriormente aquí puede
                    conectarse Firebase Auth
                    y Firestore.
                */


                userForm.reset();

                updateAccessFields();

                closeUserModal();

            }
        );

    }


    /* =====================================================
       MODAL DETALLE
    ====================================================== */

    const detailModal =
        document.getElementById("detailModal");

    const detailView =
        document.getElementById("detailView");

    const accessEditForm =
        document.getElementById("accessEditForm");


    const detailName =
        document.getElementById("detailName");

    const detailEmail =
        document.getElementById("detailEmail");

    const detailRole =
        document.getElementById("detailRole");

    const detailAccess =
        document.getElementById("detailAccess");

    const detailValidity =
        document.getElementById("detailValidity");

    const detailStatus =
        document.getElementById("detailStatus");

    const detailAvatar =
        document.getElementById("detailAvatar");


    const manageUserButton =
        document.getElementById(
            "manageUserButton"
        );

    const cancelEditButton =
        document.getElementById(
            "cancelEditButton"
        );


    /* =====================================================
       CAMPOS EDICIÓN
    ====================================================== */

    const editRole =
        document.getElementById("editRole");

    const editAccess =
        document.getElementById("editAccess");

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


    /*
        Guarda el botón y la fila del usuario
        que se está administrando.
    */

    let selectedUserButton = null;
    let selectedUserRow = null;


    /* =====================================================
       INICIALES
    ====================================================== */

    function getInitials(name) {

        const words =
            name
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


    /* =====================================================
       FORMATEAR FECHA
    ====================================================== */

    function formatExpirationDate(dateValue) {

        if (!dateValue) {
            return "Sin vencimiento";
        }


        const parts =
            dateValue.split("-");


        if (parts.length !== 3) {
            return dateValue;
        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]) - 1;

        const day =
            Number(parts[2]);


        const date =
            new Date(
                year,
                month,
                day
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


    /* =====================================================
       MOSTRAR MODO CONSULTA
    ====================================================== */

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


    /* =====================================================
       MOSTRAR MODO EDICIÓN
    ====================================================== */

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
                selectedUserButton.dataset
                    .roleName ||
                "Autor";

        }


        if (editAccess) {

            editAccess.value =
                selectedUserButton.dataset
                    .access ||
                "Institucional";

        }


        if (editStatus) {

            /*
                Si actualmente aparece como
                "Temporal", la cuenta sigue
                estando activa.

                Temporal describe el tipo/
                vigencia de acceso.
            */

            const currentStatus =
                selectedUserButton.dataset
                    .statusName;


            editStatus.value =
                currentStatus === "Inactivo"
                    ? "Inactivo"
                    : "Activo";

        }


        if (editExpiration) {

            editExpiration.value =
                selectedUserButton.dataset
                    .expiration || "";

        }


        updateEditAccessFields();

    }


    /* =====================================================
       CAMBIO TIPO DE ACCESO
    ====================================================== */

    function updateEditAccessFields() {

        if (
            !editAccess ||
            !editExpiration ||
            !institutionalValidity
        ) {
            return;
        }


        if (
            editAccess.value === "Temporal"
        ) {

            editExpiration.classList.add(
                "active"
            );

            editExpiration.required = true;


            institutionalValidity.classList.add(
                "hidden"
            );

        } else {

            editExpiration.classList.remove(
                "active"
            );

            editExpiration.required = false;


            institutionalValidity.classList.remove(
                "hidden"
            );

        }

    }


    if (editAccess) {

        editAccess.addEventListener(
            "change",
            updateEditAccessFields
        );

    }


    /* =====================================================
       ABRIR DETALLE
    ====================================================== */

    function openDetailModal(button) {

        if (!detailModal) {
            return;
        }


        selectedUserButton =
            button;


        selectedUserRow =
            button.closest(".user-row");


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


        document.body.classList.add(
            "locked"
        );

    }


    /* =====================================================
       CERRAR DETALLE
    ====================================================== */

    function closeDetailModal() {

        if (!detailModal) {
            return;
        }


        detailModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "locked"
        );


        showDetailView();


        selectedUserButton = null;
        selectedUserRow = null;

    }


    /* =====================================================
       EVENTOS BOTONES DETALLE
    ====================================================== */

    function bindDetailButtons() {

        const viewButtons =
            document.querySelectorAll(
                ".row-action[data-user]"
            );


        viewButtons.forEach((button) => {

            if (
                button.dataset.bound === "true"
            ) {
                return;
            }


            button.dataset.bound = "true";


            button.addEventListener(
                "click",
                () => {

                    openDetailModal(button);

                }
            );

        });

    }


    bindDetailButtons();


    document
        .querySelectorAll(
            "[data-close-detail-modal]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                closeDetailModal
            );

        });


    /* =====================================================
       GESTIONAR ACCESO
    ====================================================== */

    if (manageUserButton) {

        manageUserButton.addEventListener(
            "click",
            showEditView
        );

    }


    /* =====================================================
       CANCELAR EDICIÓN
    ====================================================== */

    if (cancelEditButton) {

        cancelEditButton.addEventListener(
            "click",
            () => {

                showDetailView();

            }
        );

    }


    /* =====================================================
       GUARDAR CAMBIOS
    ====================================================== */

    if (accessEditForm) {

        accessEditForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                if (
                    !selectedUserButton ||
                    !selectedUserRow
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


                /*
                    ACCESO TEMPORAL
                */

                if (
                    newAccess === "Temporal"
                ) {

                    if (
                        !editExpiration.value
                    ) {

                        editExpiration.reportValidity();

                        return;

                    }


                    newExpiration =
                        editExpiration.value;


                    newValidity =
                        formatExpirationDate(
                            newExpiration
                        );

                }


                /*
                    CUENTA INACTIVA

                    Si se desactiva la cuenta,
                    la vigencia se muestra
                    como acceso suspendido.
                */

                if (
                    newStatus === "Inactivo"
                ) {

                    newValidity =
                        "Acceso suspendido";

                }


                /*
                    ACTUALIZAR DATASET DEL BOTÓN
                */

                selectedUserButton.dataset
                    .roleName =
                    newRole;


                selectedUserButton.dataset
                    .access =
                    newAccess;


                selectedUserButton.dataset
                    .validity =
                    newValidity;


                selectedUserButton.dataset
                    .statusName =
                    newStatus;


                selectedUserButton.dataset
                    .expiration =
                    newExpiration;


                /*
                    ACTUALIZAR FILA
                */

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


                /*
                    ACTUALIZAR ESTADO VISUAL
                */

                if (statusCell) {

                    statusCell.classList.remove(
                        "status-active",
                        "status-temporary",
                        "status-inactive"
                    );


                    if (
                        newStatus === "Inactivo"
                    ) {

                        statusCell.textContent =
                            "Inactivo";


                        statusCell.classList.add(
                            "status-inactive"
                        );

                    } else if (
                        newAccess === "Temporal"
                    ) {

                        statusCell.textContent =
                            "Temporal";


                        statusCell.classList.add(
                            "status-temporary"
                        );

                    } else {

                        statusCell.textContent =
                            "Activo";


                        statusCell.classList.add(
                            "status-active"
                        );

                    }

                }


                /*
                    ACTUALIZAR DATASET DE FILTROS
                */

                selectedUserRow.dataset.role =
                    newRole.toLowerCase();


                if (
                    newStatus === "Inactivo"
                ) {

                    selectedUserRow.dataset.status =
                        "inactivo";

                } else if (
                    newAccess === "Temporal"
                ) {

                    selectedUserRow.dataset.status =
                        "temporal";

                } else {

                    selectedUserRow.dataset.status =
                        "activo";

                }


                /*
                    ACTUALIZAR MODAL DE CONSULTA
                */

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

                    if (
                        newStatus === "Inactivo"
                    ) {

                        detailStatus.textContent =
                            "Inactivo";

                    } else if (
                        newAccess === "Temporal"
                    ) {

                        detailStatus.textContent =
                            "Temporal";

                    } else {

                        detailStatus.textContent =
                            "Activo";

                    }

                }


                /*
                    Mantener coherencia en
                    dataset status-name
                */

                if (
                    newStatus === "Inactivo"
                ) {

                    selectedUserButton.dataset
                        .statusName =
                        "Inactivo";

                } else if (
                    newAccess === "Temporal"
                ) {

                    selectedUserButton.dataset
                        .statusName =
                        "Temporal";

                } else {

                    selectedUserButton.dataset
                        .statusName =
                        "Activo";

                }


                /*
                    Volver a modo consulta
                */

                showDetailView();


                /*
                    Aplicar filtros actuales
                */

                filterUsers();

            }
        );

    }


    /* =====================================================
       CERRAR SESIÓN
    ====================================================== */

    const logoutModal =
        document.getElementById(
            "logoutModal"
        );

    const sidebarLogout =
        document.getElementById(
            "sidebarLogout"
        );

    const profileLogout =
        document.getElementById(
            "profileLogout"
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


        document.body.classList.add(
            "locked"
        );


        if (profile) {

            profile.classList.remove(
                "open"
            );

        }

    }


    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }


        logoutModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "locked"
        );

    }


    if (sidebarLogout) {

        sidebarLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    document
        .querySelectorAll(
            "[data-close-logout-modal]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                closeLogoutModal
            );

        });


    if (confirmLogout) {

        confirmLogout.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html";

            }
        );

    }


    /* =====================================================
       ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                userModal &&
                userModal.classList.contains(
                    "active"
                )
            ) {

                closeUserModal();

                return;

            }


            if (
                detailModal &&
                detailModal.classList.contains(
                    "active"
                )
            ) {

                /*
                    Si está editando,
                    primero regresa a consulta.
                */

                if (
                    accessEditForm &&
                    accessEditForm.classList
                        .contains("active")
                ) {

                    showDetailView();

                } else {

                    closeDetailModal();

                }

                return;

            }


            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

                return;

            }


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


            if (
                sidebar &&
                sidebar.classList.contains(
                    "open"
                ) &&
                window.innerWidth <= 950
            ) {

                closeSidebar();

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
                window.innerWidth > 950
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ====================================================== */

    filterUsers();

});