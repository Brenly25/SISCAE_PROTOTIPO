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
       ELEMENTOS
    ====================================================== */

    const roleTabs =
        document.querySelectorAll(".role-tab");

    const permissionInputs =
        document.querySelectorAll("[data-permission]");

    const selectedRoleName =
        document.getElementById("selectedRoleName");

    const selectedRoleDescription =
        document.getElementById("selectedRoleDescription");

    const selectedUserCount =
        document.getElementById("selectedUserCount");

    const roleState =
        document.getElementById("roleState");

    const adminNotice =
        document.getElementById("adminNotice");

    const permissionsActions =
        document.getElementById("permissionsActions");

    const roleConfiguration =
        document.getElementById("roleConfiguration");

    const changesInfo =
        document.getElementById("changesInfo");

    const changesText =
        document.getElementById("changesText");

    const savePermissionsButton =
        document.getElementById("savePermissionsButton");

    const restoreButton =
        document.getElementById("restoreButton");


    /* =====================================================
       CAMBIAR VISUALMENTE DE ROL
    ====================================================== */

    function renderRole(roleKey, animate = false) {

        const role = roles[roleKey];

        if (!role) {
            return;
        }

        currentRole = roleKey;


        /* ---------------------------------------------
           MARCAR TARJETA SELECCIONADA
        ---------------------------------------------- */

        roleTabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab.dataset.role === roleKey
            );

        });


        /* ---------------------------------------------
           DATOS DEL ROL
        ---------------------------------------------- */

        selectedRoleName.textContent =
            role.name;

        selectedRoleDescription.textContent =
            role.description;

        selectedUserCount.textContent =
            role.users;


        /* ---------------------------------------------
           ESTADO DEL ROL
        ---------------------------------------------- */

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


        /* ---------------------------------------------
           AVISO DEL ADMIN
        ---------------------------------------------- */

        adminNotice.classList.toggle(
            "hidden",
            !role.protected
        );


        /* ---------------------------------------------
           SWITCHES
        ---------------------------------------------- */

        permissionInputs.forEach((input) => {

            const permission =
                input.dataset.permission;

            input.checked =
                Boolean(
                    role.permissions[permission]
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
           BOTONES INFERIORES
        ---------------------------------------------- */

        permissionsActions.classList.toggle(
            "admin-mode",
            role.protected
        );


        updateChangesState();


        /* ---------------------------------------------
           ANIMACIÓN DEL PANEL
        ---------------------------------------------- */

        if (animate) {

            roleConfiguration.classList.remove(
                "switching"
            );

            void roleConfiguration.offsetWidth;

            roleConfiguration.classList.add(
                "switching"
            );

            setTimeout(() => {

                roleConfiguration.classList.remove(
                    "switching"
                );

            }, 350);

        }

    }


    /* =====================================================
       CLICK SOBRE LOS ROLES
    ====================================================== */

    roleTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            const newRole =
                tab.dataset.role;


            /*
                Si toca el mismo rol,
                no vuelve a ejecutar todo.
            */

            if (newRole === currentRole) {

                /*
                    Pequeño efecto visual incluso
                    al tocar el rol actual.
                */

                tab.animate(
                    [
                        { transform: "scale(1)" },
                        { transform: "scale(.985)" },
                        { transform: "scale(1)" }
                    ],
                    {
                        duration: 180,
                        easing: "ease"
                    }
                );

                return;
            }


            renderRole(
                newRole,
                true
            );

        });

    });


    /* =====================================================
       CAMBIAR PERMISOS
    ====================================================== */

    permissionInputs.forEach((input) => {

        input.addEventListener("change", () => {

            const role =
                roles[currentRole];


            if (role.protected) {

                renderRole(currentRole);

                return;
            }


            const permission =
                input.dataset.permission;


            role.permissions[permission] =
                input.checked;


            updateChangesState();

        });

    });


    /* =====================================================
       COMPROBAR CAMBIOS
    ====================================================== */

    function roleHasChanges() {

        const role =
            roles[currentRole];

        if (role.protected) {
            return false;
        }


        const currentPermissions =
            role.permissions;

        const savedPermissions =
            savedRoles[currentRole].permissions;


        return Object.keys(
            currentPermissions
        ).some((permission) => {

            return (
                currentPermissions[permission] !==
                savedPermissions[permission]
            );

        });

    }


    /* =====================================================
       ACTUALIZAR ESTADO DE CAMBIOS
    ====================================================== */

    function updateChangesState() {

        hasChanges =
            roleHasChanges();


        changesInfo.classList.toggle(
            "pending",
            hasChanges
        );


        changesText.textContent =
            hasChanges
                ? "Hay cambios pendientes"
                : "Sin cambios pendientes";


        savePermissionsButton.disabled =
            !hasChanges;

    }


    /* =====================================================
       RESTAURAR
    ====================================================== */

    restoreButton.addEventListener("click", () => {

        if (
            roles[currentRole].protected
        ) {
            return;
        }


        roles[currentRole].permissions =
            JSON.parse(
                JSON.stringify(
                    savedRoles[currentRole]
                        .permissions
                )
            );


        renderRole(
            currentRole,
            true
        );

    });


    /* =====================================================
       GRUPOS DESPLEGABLES
    ====================================================== */

    const groupHeaders =
        document.querySelectorAll(
            "[data-toggle-group]"
        );


    groupHeaders.forEach((header) => {

        header.addEventListener("click", () => {

            header.classList.toggle(
                "open"
            );

        });

    });


    /* =====================================================
       MODAL GUARDAR
    ====================================================== */

    const saveModal =
        document.getElementById("saveModal");

    const saveRoleName =
        document.getElementById("saveRoleName");

    const cancelSaveButton =
        document.getElementById("cancelSaveButton");

    const confirmSaveButton =
        document.getElementById("confirmSaveButton");


    function openSaveModal() {

        if (
            !hasChanges ||
            roles[currentRole].protected
        ) {
            return;
        }


        saveRoleName.textContent =
            roles[currentRole].name;


        saveModal.classList.add(
            "active"
        );


        document.body.classList.add(
            "locked"
        );

    }


    function closeSaveModal() {

        saveModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "locked"
        );

    }


    savePermissionsButton.addEventListener(
        "click",
        openSaveModal
    );


    cancelSaveButton.addEventListener(
        "click",
        closeSaveModal
    );


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

    confirmSaveButton.addEventListener(
        "click",
        () => {

            if (
                roles[currentRole].protected
            ) {
                return;
            }


            savedRoles[currentRole].permissions =
                JSON.parse(
                    JSON.stringify(
                        roles[currentRole]
                            .permissions
                    )
                );


            closeSaveModal();

            updateChangesState();

            showSuccessToast();

        }
    );


    /* =====================================================
       TOAST
    ====================================================== */

    const successToast =
        document.getElementById(
            "successToast"
        );


    let toastTimer;


    function showSuccessToast() {

        clearTimeout(
            toastTimer
        );


        successToast.classList.add(
            "active"
        );


        toastTimer =
            setTimeout(() => {

                successToast.classList.remove(
                    "active"
                );

            }, 3000);

    }


    /* =====================================================
       SIDEBAR MOBILE
    ====================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("menuButton");

    const mobileOverlay =
        document.getElementById("mobileOverlay");


    function openSidebar() {

        sidebar.classList.add(
            "open"
        );

        mobileOverlay.classList.add(
            "active"
        );

        document.body.classList.add(
            "locked"
        );

    }


    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        mobileOverlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "locked"
        );

    }


    menuButton.addEventListener(
        "click",
        () => {

            if (
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );


    mobileOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================================
       PERFIL
    ====================================================== */

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");


    profileButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profile.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

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


    /* =====================================================
       ALERTAS
    ====================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    notificationButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "alertas.html";

        }
    );


    /* =====================================================
       LOGOUT
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

        logoutModal.classList.add(
            "active"
        );

        document.body.classList.add(
            "locked"
        );

        profile.classList.remove(
            "open"
        );

    }


    function closeLogoutModal() {

        logoutModal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "locked"
        );

    }


    sidebarLogout.addEventListener(
        "click",
        openLogoutModal
    );


    profileLogout.addEventListener(
        "click",
        openLogoutModal
    );


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


    confirmLogout.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );


    /* =====================================================
       ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                saveModal.classList.contains(
                    "active"
                )
            ) {

                closeSaveModal();
                return;

            }


            if (
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();
                return;

            }


            profile.classList.remove(
                "open"
            );


            if (
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
       INICIAR
    ====================================================== */

    renderRole(
        currentRole
    );

});