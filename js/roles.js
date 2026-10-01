document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DATOS SIMULADOS DE ROLES
    ====================================================== */

    const roles = {

        administrador: {

            name: "Administrador",

            description:
                "Control administrativo y supervisión general de SISCAE.",

            users: 2,

            protected: true,

            permissions: {

                viewUsers: true,
                manageUsers: true,
                manageRoles: true,

                viewAssets: true,
                uploadAssets: true,
                reviewAssets: true,
                approveAssets: true,

                viewHistory: true,
                viewAudit: true,
                viewIntegrity: true,
                manageAlerts: true,
                registerIntervention: true

            }

        },


        editorial: {

            name: "Autor / Editor",

            description:
                "Producción, actualización y gestión de los activos editoriales asignados.",

            users: 13,

            protected: false,

            permissions: {

                viewUsers: false,
                manageUsers: false,
                manageRoles: false,

                viewAssets: true,
                uploadAssets: true,
                reviewAssets: false,
                approveAssets: false,

                viewHistory: true,
                viewAudit: false,
                viewIntegrity: true,
                manageAlerts: false,
                registerIntervention: true

            }

        },


        revisor: {

            name: "Revisor",

            description:
                "Validación de contenido, observaciones y control del avance editorial.",

            users: 6,

            protected: false,

            permissions: {

                viewUsers: false,
                manageUsers: false,
                manageRoles: false,

                viewAssets: true,
                uploadAssets: false,
                reviewAssets: true,
                approveAssets: true,

                viewHistory: true,
                viewAudit: false,
                viewIntegrity: true,
                manageAlerts: false,
                registerIntervention: true

            }

        },


        auditor: {

            name: "Auditor",

            description:
                "Consulta de trazabilidad, integridad y registros de actividad del sistema.",

            users: 3,

            protected: false,

            permissions: {

                viewUsers: true,
                manageUsers: false,
                manageRoles: false,

                viewAssets: true,
                uploadAssets: false,
                reviewAssets: false,
                approveAssets: false,

                viewHistory: true,
                viewAudit: true,
                viewIntegrity: true,
                manageAlerts: false,
                registerIntervention: false

            }

        }

    };


    /* =====================================================
       COPIA DE LOS DATOS GUARDADOS
    ====================================================== */

    const savedRoles =
        JSON.parse(JSON.stringify(roles));


    let currentRole = "administrador";
    let hasChanges = false;


    /* =====================================================
       ELEMENTOS PRINCIPALES
    ====================================================== */

    const roleTabs =
        document.querySelectorAll(".role-tab");


    const permissionInputs =
        document.querySelectorAll("[data-permission]");


    const selectedRoleName =
        document.getElementById("selectedRoleName");


    const selectedRoleDescription =
        document.getElementById(
            "selectedRoleDescription"
        );


    const selectedUserCount =
        document.getElementById(
            "selectedUserCount"
        );


    const roleState =
        document.getElementById("roleState");


    const adminNotice =
        document.getElementById("adminNotice");


    const permissionsActions =
        document.getElementById(
            "permissionsActions"
        );


    const roleConfiguration =
        document.getElementById(
            "roleConfiguration"
        );


    const changesInfo =
        document.getElementById(
            "changesInfo"
        );


    const changesText =
        document.getElementById(
            "changesText"
        );


    const savePermissionsButton =
        document.getElementById(
            "savePermissionsButton"
        );


    const restoreButton =
        document.getElementById(
            "restoreButton"
        );


    /* =====================================================
       ACTUALIZAR BLOQUEO DEL BODY
    ====================================================== */

    function updateBodyLock() {

        const activeModal =
            document.querySelector(
                ".modal.active"
            );


        const sidebarOpen =
            document
                .getElementById("sidebar")
                ?.classList
                .contains("open");


        document.body.classList.toggle(
            "locked",
            Boolean(activeModal || sidebarOpen)
        );

    }


    /* =====================================================
       MOSTRAR ROL
    ====================================================== */

    function renderRole(
        roleKey,
        animate = false
    ) {

        const role =
            roles[roleKey];


        if (!role) {
            return;
        }


        currentRole = roleKey;


        /* ---------------------------------------------
           MARCAR ROL SELECCIONADO
        ---------------------------------------------- */

        roleTabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab.dataset.role === roleKey
            );

        });


        /* ---------------------------------------------
           INFORMACIÓN DEL ROL
        ---------------------------------------------- */

        if (selectedRoleName) {

            selectedRoleName.textContent =
                role.name;

        }


        if (selectedRoleDescription) {

            selectedRoleDescription.textContent =
                role.description;

        }


        if (selectedUserCount) {

            selectedUserCount.textContent =
                role.users;

        }


        /* ---------------------------------------------
           ESTADO DEL ROL
        ---------------------------------------------- */

        if (roleState) {

            if (role.protected) {

                roleState.textContent =
                    "Perfil protegido";


                roleState.classList.remove(
                    "editable"
                );

            } else {

                roleState.textContent =
                    "Permisos editables";


                roleState.classList.add(
                    "editable"
                );

            }

        }


        /* ---------------------------------------------
           AVISO DEL ADMINISTRADOR
        ---------------------------------------------- */

        if (adminNotice) {

            adminNotice.classList.toggle(
                "hidden",
                !role.protected
            );

        }


        /* ---------------------------------------------
           PERMISOS
        ---------------------------------------------- */

        permissionInputs.forEach((input) => {

            const permission =
                input.dataset.permission;


            input.checked =
                Boolean(
                    role.permissions[
                        permission
                    ]
                );


            /*
                Administrador:
                solo consulta.

                Otros roles:
                se pueden modificar.
            */

            input.disabled =
                role.protected;

        });


        /* ---------------------------------------------
           ACCIONES INFERIORES
        ---------------------------------------------- */

        if (permissionsActions) {

            permissionsActions.classList.toggle(
                "admin-mode",
                role.protected
            );

        }


        if (restoreButton) {

            restoreButton.disabled =
                role.protected;

        }


        updateChangesState();


        /* ---------------------------------------------
           ANIMACIÓN
        ---------------------------------------------- */

        if (
            animate &&
            roleConfiguration
        ) {

            roleConfiguration.classList.remove(
                "switching"
            );


            void roleConfiguration.offsetWidth;


            roleConfiguration.classList.add(
                "switching"
            );


            window.setTimeout(() => {

                roleConfiguration.classList.remove(
                    "switching"
                );

            }, 350);

        }

    }


    /* =====================================================
       CAMBIAR DE ROL
    ====================================================== */

    roleTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                const newRole =
                    tab.dataset.role;


                if (!newRole) {
                    return;
                }


                /*
                    Si selecciona el mismo rol,
                    solo se aplica un pequeño efecto.
                */

                if (
                    newRole === currentRole
                ) {

                    if (
                        typeof tab.animate ===
                        "function"
                    ) {

                        tab.animate(

                            [
                                {
                                    transform:
                                        "scale(1)"
                                },

                                {
                                    transform:
                                        "scale(.985)"
                                },

                                {
                                    transform:
                                        "scale(1)"
                                }
                            ],

                            {
                                duration: 180,
                                easing: "ease"
                            }

                        );

                    }


                    return;

                }


                renderRole(
                    newRole,
                    true
                );

            }
        );

    });


    /* =====================================================
       CAMBIAR PERMISOS
    ====================================================== */

    permissionInputs.forEach((input) => {

        input.addEventListener(
            "change",
            () => {

                const role =
                    roles[currentRole];


                if (!role) {
                    return;
                }


                /*
                    El administrador
                    no se modifica.
                */

                if (role.protected) {

                    renderRole(
                        currentRole
                    );

                    return;

                }


                const permission =
                    input.dataset.permission;


                if (
                    !permission ||
                    !Object.prototype.hasOwnProperty.call(
                        role.permissions,
                        permission
                    )
                ) {

                    return;

                }


                role.permissions[
                    permission
                ] = input.checked;


                updateChangesState();

            }
        );

    });


    /* =====================================================
       COMPROBAR CAMBIOS
    ====================================================== */

    function roleHasChanges() {

        const role =
            roles[currentRole];


        const savedRole =
            savedRoles[currentRole];


        if (
            !role ||
            !savedRole ||
            role.protected
        ) {

            return false;

        }


        const currentPermissions =
            role.permissions;


        const savedPermissions =
            savedRole.permissions;


        return Object
            .keys(currentPermissions)
            .some((permission) => {

                return (
                    currentPermissions[
                        permission
                    ] !==
                    savedPermissions[
                        permission
                    ]
                );

            });

    }


    /* =====================================================
       ACTUALIZAR ESTADO DE CAMBIOS
    ====================================================== */

    function updateChangesState() {

        hasChanges =
            roleHasChanges();


        if (changesInfo) {

            changesInfo.classList.toggle(
                "pending",
                hasChanges
            );

        }


        if (changesText) {

            changesText.textContent =
                hasChanges
                    ? "Hay cambios pendientes"
                    : "Sin cambios pendientes";

        }


        if (savePermissionsButton) {

            savePermissionsButton.disabled =
                !hasChanges;

        }

    }


    /* =====================================================
       RESTAURAR PERMISOS
    ====================================================== */

    if (restoreButton) {

        restoreButton.addEventListener(
            "click",
            () => {

                const role =
                    roles[currentRole];


                const savedRole =
                    savedRoles[currentRole];


                if (
                    !role ||
                    !savedRole ||
                    role.protected
                ) {

                    return;

                }


                role.permissions =
                    JSON.parse(
                        JSON.stringify(
                            savedRole.permissions
                        )
                    );


                renderRole(
                    currentRole,
                    true
                );

            }
        );

    }


    /* =====================================================
       GRUPOS DESPLEGABLES
    ====================================================== */

    const groupHeaders =
        document.querySelectorAll(
            "[data-toggle-group]"
        );


    groupHeaders.forEach((header) => {

        header.addEventListener(
            "click",
            () => {

                header.classList.toggle(
                    "open"
                );

            }
        );

    });


    /* =====================================================
       MODAL GUARDAR
    ====================================================== */

    const saveModal =
        document.getElementById(
            "saveModal"
        );


    const saveRoleName =
        document.getElementById(
            "saveRoleName"
        );


    const cancelSaveButton =
        document.getElementById(
            "cancelSaveButton"
        );


    const confirmSaveButton =
        document.getElementById(
            "confirmSaveButton"
        );


    function openSaveModal() {

        const role =
            roles[currentRole];


        if (
            !saveModal ||
            !role ||
            !hasChanges ||
            role.protected
        ) {

            return;

        }


        if (saveRoleName) {

            saveRoleName.textContent =
                role.name;

        }


        saveModal.classList.add(
            "active"
        );


        updateBodyLock();

    }


    function closeSaveModal() {

        if (!saveModal) {
            return;
        }


        saveModal.classList.remove(
            "active"
        );


        updateBodyLock();

    }


    if (savePermissionsButton) {

        savePermissionsButton.addEventListener(
            "click",
            openSaveModal
        );

    }


    if (cancelSaveButton) {

        cancelSaveButton.addEventListener(
            "click",
            closeSaveModal
        );

    }


    document
        .querySelectorAll(
            "[data-close-save-modal]"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                closeSaveModal
            );

        });


    /* =====================================================
       GUARDAR CAMBIOS SIMULADOS
    ====================================================== */

    if (confirmSaveButton) {

        confirmSaveButton.addEventListener(
            "click",
            () => {

                const role =
                    roles[currentRole];


                if (
                    !role ||
                    role.protected
                ) {

                    return;

                }


                savedRoles[
                    currentRole
                ].permissions =
                    JSON.parse(
                        JSON.stringify(
                            role.permissions
                        )
                    );


                closeSaveModal();


                updateChangesState();


                showSuccessToast();

            }
        );

    }


    /* =====================================================
       TOAST DE ÉXITO
    ====================================================== */

    const successToast =
        document.getElementById(
            "successToast"
        );


    let toastTimer = null;


    function showSuccessToast() {

        if (!successToast) {
            return;
        }


        if (toastTimer) {

            clearTimeout(
                toastTimer
            );

        }


        successToast.classList.add(
            "active"
        );


        toastTimer =
            window.setTimeout(
                () => {

                    successToast.classList.remove(
                        "active"
                    );

                },
                3000
            );

    }


    /* =====================================================
       PERFIL
    ====================================================== */

    const profile =
        document.getElementById(
            "profile"
        );


    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (
        profile &&
        profileButton
    ) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                profile.classList.toggle(
                    "open"
                );

            }
        );

    }


    /*
        Cerrar menú de perfil
        al hacer clic fuera.
    */

    document.addEventListener(
        "click",
        (event) => {

            if (
                profile &&
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


    /* =====================================================
       ALERTAS
    ====================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


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
       LOGOUT
    ====================================================== */

    const logoutModal =
        document.getElementById(
            "logoutModal"
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


    /*
        IMPORTANTE:

        El sidebar se carga dinámicamente
        desde sidebar_admin.txt.

        Por eso NO buscamos sidebarLogout
        al iniciar el archivo.

        Utilizamos delegación de eventos.
    */

    document.addEventListener(
        "click",
        (event) => {

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


    /*
        Logout desde el perfil
        de la barra superior.
    */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                openLogoutModal();

            }
        );

    }


    /*
        Cerrar modal desde
        botón cancelar u overlay.
    */

    document
        .querySelectorAll(
            "[data-close-logout-modal]"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                closeLogoutModal
            );

        });


    /*
        Confirmar cierre de sesión.
    */

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
       TECLA ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            /*
                Primero modal guardar.
            */

            if (
                saveModal &&
                saveModal.classList.contains(
                    "active"
                )
            ) {

                closeSaveModal();

                return;

            }


            /*
                Después modal logout.
            */

            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

                return;

            }


            /*
                Finalmente menú del perfil.

                El sidebar NO se controla
                desde este archivo.
                Eso corresponde a components.js.
            */

            if (profile) {

                profile.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =====================================================
       INICIAR PÁGINA
    ====================================================== */

    renderRole(
        currentRole
    );


});