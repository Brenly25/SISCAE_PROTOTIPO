document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       TOPBAR
    ====================================================== */

    const profile =
        document.getElementById("profile");

    const profileButton =
        document.getElementById("profileButton");

    const profileLogout =
        document.getElementById("profileLogout");

    const notificationButton =
        document.getElementById("notificationButton");


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

            if (!profile) {
                return;
            }

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
        document.getElementById("assetSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const typeFilter =
        document.getElementById("typeFilter");

    const clearFilters =
        document.getElementById("clearFilters");

    const assetRows =
        document.querySelectorAll(".asset-row");

    const resultCount =
        document.getElementById("resultCount");

    const emptyState =
        document.getElementById("emptyState");


    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }


    function filterAssets() {

        const searchValue =
            normalizeText(
                searchInput
                    ? searchInput.value.trim()
                    : ""
            );


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";


        const selectedType =
            typeFilter
                ? typeFilter.value
                : "all";


        let visibleCount = 0;


        assetRows.forEach((row) => {

            const rowSearch =
                normalizeText(
                    row.dataset.search
                );

            const rowStatus =
                row.dataset.status;

            const rowType =
                row.dataset.type;


            const matchesSearch =
                !searchValue ||
                rowSearch.includes(searchValue);


            const matchesStatus =
                selectedStatus === "all" ||
                rowStatus === selectedStatus;


            const matchesType =
                selectedType === "all" ||
                rowType === selectedType;


            const visible =
                matchesSearch &&
                matchesStatus &&
                matchesType;


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

            emptyState.classList.toggle(
                "active",
                visibleCount === 0
            );

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAssets
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterAssets
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            filterAssets
        );

    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value = "";

                }


                if (statusFilter) {

                    statusFilter.value = "all";

                }


                if (typeFilter) {

                    typeFilter.value = "all";

                }


                filterAssets();

            }
        );

    }


    /* =====================================================
       MODAL REGISTRAR ACTIVO
    ====================================================== */

    const newAssetButton =
        document.getElementById("newAssetButton");

    const assetModal =
        document.getElementById("assetModal");

    const assetForm =
        document.getElementById("assetForm");


    function openAssetModal() {

        if (!assetModal) {
            return;
        }


        assetModal.classList.add("active");

        updateBodyLock();

    }


    function closeAssetModal() {

        if (!assetModal) {
            return;
        }


        assetModal.classList.remove("active");

        updateBodyLock();

    }


    if (newAssetButton) {

        newAssetButton.addEventListener(
            "click",
            openAssetModal
        );

    }


    document
        .querySelectorAll(
            "[data-close-asset-modal]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                closeAssetModal
            );

        });


    if (assetForm) {

        assetForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                /*
                   PROTOTIPO:
                   El registro se simula.
                   Posteriormente se conectará
                   con el backend correspondiente.
                */


                assetForm.reset();

                closeAssetModal();

            }
        );

    }


    /* =====================================================
       MODAL DETALLE
    ====================================================== */

    const detailModal =
        document.getElementById("detailModal");

    const detailAssetName =
        document.getElementById("detailAssetName");

    const viewButtons =
        document.querySelectorAll(
            "[data-view-asset]"
        );


    function openDetailModal(assetName) {

        if (!detailModal) {
            return;
        }


        if (detailAssetName) {

            detailAssetName.textContent =
                assetName;

        }


        detailModal.classList.add("active");

        updateBodyLock();

    }


    function closeDetailModal() {

        if (!detailModal) {
            return;
        }


        detailModal.classList.remove("active");

        updateBodyLock();

    }


    viewButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openDetailModal(
                    button.dataset.viewAsset
                );

            }
        );

    });


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
       MODAL CERRAR SESIÓN
    ====================================================== */

    const logoutModal =
        document.getElementById("logoutModal");

    const confirmLogout =
        document.getElementById("confirmLogout");


    function openLogoutModal() {

        if (!logoutModal) {
            return;
        }


        logoutModal.classList.add("active");


        if (profile) {

            profile.classList.remove("open");

        }


        updateBodyLock();

    }


    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }


        logoutModal.classList.remove("active");

        updateBodyLock();

    }


    /* =====================================================
       LOGOUT DESDE PERFIL
    ====================================================== */

    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            openLogoutModal
        );

    }


    /* =====================================================
       LOGOUT DESDE SIDEBAR
       El sidebar se carga dinámicamente.
    ====================================================== */

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


    /* =====================================================
       CERRAR MODAL LOGOUT
    ====================================================== */

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


    /* =====================================================
       CONFIRMAR LOGOUT
    ====================================================== */

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
       CONTROL DE SCROLL
    ====================================================== */

    function updateBodyLock() {

        const modalOpen =
            document.querySelector(
                ".modal.active"
            );


        const sidebarOpen =
            document.querySelector(
                "#sidebar.open"
            );


        if (modalOpen || sidebarOpen) {

            document.body.classList.add(
                "locked"
            );

        } else {

            document.body.classList.remove(
                "locked"
            );

        }

    }


    /* =====================================================
       TECLA ESCAPE
       Solo controla elementos propios de Activos.
       El sidebar lo controla components.js.
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                assetModal &&
                assetModal.classList.contains(
                    "active"
                )
            ) {

                closeAssetModal();

            }


            if (
                detailModal &&
                detailModal.classList.contains(
                    "active"
                )
            ) {

                closeDetailModal();

            }


            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active"
                )
            ) {

                closeLogoutModal();

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

        }
    );


    /* =====================================================
       INICIALIZACIÓN
    ====================================================== */

    filterAssets();


});