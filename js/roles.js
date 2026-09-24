/* =========================================================
   SISCAE
   ROLES Y PERMISOS
========================================================= */


/* =========================================================
   DATOS DE ROLES
   Datos utilizados únicamente para el prototipo.
========================================================= */

const roles = {

    admin: {

        name: "Administrador",

        users: "2 usuarios",

        description:
            "Administra usuarios, proyectos, permisos, seguridad y configuración general del sistema.",

        permissions: {

            viewProjects: true,
            createProjects: true,

            viewAssets: true,
            downloadAssets: true,
            uploadAssets: true,
            newVersion: true,

            editContent: true,
            comment: true,
            sign: true,
            approve: true,

            viewHash: true,
            manageUsers: true,

            audit: true,
            reports: true

        }

    },


    autor: {

        name: "Autor",

        users: "12 usuarios",

        description:
            "Gestiona los activos que tiene asignados, carga contenido y registra su autoría e intervenciones.",

        permissions: {

            viewProjects: true,
            createProjects: false,

            viewAssets: true,
            downloadAssets: true,
            uploadAssets: true,
            newVersion: true,

            editContent: true,
            comment: true,
            sign: true,
            approve: false,

            viewHash: true,
            manageUsers: false,

            audit: false,
            reports: false

        }

    },


    editor: {

        name: "Editor",

        users: "6 usuarios",

        description:
            "Puede editar contenido asignado, cargar nuevas versiones y registrar sus intervenciones.",

        permissions: {

            viewProjects: true,
            createProjects: false,

            viewAssets: true,
            downloadAssets: true,
            uploadAssets: false,
            newVersion: true,

            editContent: true,
            comment: true,
            sign: true,
            approve: false,

            viewHash: true,
            manageUsers: false,

            audit: false,
            reports: false

        }

    },


    revisor: {

        name: "Revisor",

        users: "4 usuarios",

        description:
            "Revisa los contenidos asignados, registra observaciones y participa en su proceso de validación.",

        permissions: {

            viewProjects: true,
            createProjects: false,

            viewAssets: true,
            downloadAssets: true,
            uploadAssets: false,
            newVersion: false,

            editContent: false,
            comment: true,
            sign: true,
            approve: true,

            viewHash: true,
            manageUsers: false,

            audit: false,
            reports: false

        }

    },


    auditor: {

        name: "Auditor",

        users: "2 usuarios",

        description:
            "Consulta registros de auditoría, trazabilidad, firmas, integridad y eventos de seguridad.",

        permissions: {

            viewProjects: true,
            createProjects: false,

            viewAssets: true,
            downloadAssets: false,
            uploadAssets: false,
            newVersion: false,

            editContent: false,
            comment: false,
            sign: false,
            approve: false,

            viewHash: true,
            manageUsers: false,

            audit: true,
            reports: true

        }

    }

};



/* =========================================================
   ELEMENTOS
========================================================= */

const roleButtons =
    document.querySelectorAll(".role-item");


const permissionInputs =
    document.querySelectorAll(
        "[data-permission]"
    );


const roleTitle =
    document.getElementById("roleTitle");


const roleBadge =
    document.getElementById("roleBadge");


const roleDescription =
    document.getElementById(
        "roleDescription"
    );


let currentRole = "editor";



/* =========================================================
   COPIA ORIGINAL
========================================================= */

let savedRoles =
    JSON.parse(
        JSON.stringify(roles)
    );



/* =========================================================
   CARGAR ROL
========================================================= */

function loadRole(roleKey) {

    const role =
        roles[roleKey];


    if (!role) {
        return;
    }


    currentRole = roleKey;


    /* -------------------------
       BOTÓN ACTIVO
    ------------------------- */

    roleButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.role === roleKey
            );

        }
    );


    /* -------------------------
       INFORMACIÓN
    ------------------------- */

    roleTitle.textContent =
        role.name;


    roleBadge.textContent =
        role.users;


    roleDescription.textContent =
        role.description;


    /* -------------------------
       PERMISOS
    ------------------------- */

    permissionInputs.forEach(
        input => {

            const permission =
                input.dataset.permission;


            input.checked =
                Boolean(
                    role.permissions[
                        permission
                    ]
                );

        }
    );

}



/* =========================================================
   SELECCIONAR ROL
========================================================= */

roleButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                loadRole(
                    this.dataset.role
                );

            }
        );

    }
);



/* =========================================================
   ACTUALIZAR PERMISO EN MEMORIA
========================================================= */

permissionInputs.forEach(
    input => {

        input.addEventListener(
            "change",
            function () {

                const permission =
                    this.dataset.permission;


                roles[currentRole]
                    .permissions[permission] =
                    this.checked;

            }
        );

    }
);



/* =========================================================
   GUARDAR CAMBIOS
========================================================= */

const savePermissions =
    document.getElementById(
        "savePermissions"
    );


savePermissions.addEventListener(
    "click",
    function () {

        /*
           En la versión real:
           aquí se enviarán los cambios
           a Firestore / Cloud Functions.
        */


        savedRoles =
            JSON.parse(
                JSON.stringify(roles)
            );


        showToast(
            "Permisos del rol " +
            roles[currentRole].name +
            " guardados correctamente."
        );

    }
);



/* =========================================================
   CANCELAR CAMBIOS
========================================================= */

const cancelChanges =
    document.getElementById(
        "cancelChanges"
    );


cancelChanges.addEventListener(
    "click",
    function () {

        /*
           Restauramos la última versión
           guardada en el prototipo.
        */

        Object.keys(savedRoles).forEach(
            roleKey => {

                roles[roleKey] =
                    JSON.parse(
                        JSON.stringify(
                            savedRoles[roleKey]
                        )
                    );

            }
        );


        loadRole(currentRole);


        showToast(
            "Los cambios sin guardar fueron descartados."
        );

    }
);



/* =========================================================
   MODAL
========================================================= */

const modal =
    document.getElementById(
        "accessModal"
    );


const openModalButton =
    document.getElementById(
        "openAccessModal"
    );


const closeModalButton =
    document.getElementById(
        "closeAccessModal"
    );


const closeModalElements =
    document.querySelectorAll(
        "[data-close-modal]"
    );



/* ABRIR */

function openModal() {

    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );

}



/* CERRAR */

function closeModal() {

    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}



openModalButton.addEventListener(
    "click",
    openModal
);


closeModalButton.addEventListener(
    "click",
    closeModal
);


closeModalElements.forEach(
    element => {

        element.addEventListener(
            "click",
            closeModal
        );

    }
);



/* ESC */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }

    }
);



/* =========================================================
   FORMULARIO ASIGNAR ACCESO
========================================================= */

const accessForm =
    document.getElementById(
        "accessForm"
    );


accessForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /*
           En la versión real:
           aquí se guardará la asignación
           usuario + rol + proyecto + vigencia.
        */


        showToast(
            "Acceso asignado correctamente."
        );


        accessForm.reset();


        closeModal();

    }
);



/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById(
        "toast"
    );


const toastMessage =
    document.getElementById(
        "toastMessage"
    );


let toastTimer;



function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}



/* =========================================================
   MENÚ MÓVIL
========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );


const nav =
    document.getElementById(
        "nav"
    );


if (
    menuButton &&
    nav
) {

    menuButton.addEventListener(
        "click",
        function () {

            nav.classList.toggle(
                "open"
            );


            const expanded =
                menuButton.getAttribute(
                    "aria-expanded"
                ) === "true";


            menuButton.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

        }
    );

}



/* =========================================================
   INICIALIZAR
========================================================= */

loadRole("editor");