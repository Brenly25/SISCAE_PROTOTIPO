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

        menuButton.addEventListener(
            "click",
            () => {

                if (
                    sidebar.classList.contains("open")
                ) {
                    closeSidebar();
                } else {
                    openSidebar();
                }

            }
        );

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

            item.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 950
                    ) {
                        closeSidebar();
                    }

                }
            );

        });


    /* =====================================================
       PERFIL
    ====================================================== */

    if (
        profile &&
        profileButton
    ) {

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

            if (
                !profile.contains(event.target)
            ) {
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
       FILTROS DE ACTIVOS
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

        return text
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
                    row.dataset.search || ""
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
       MODAL NUEVO ACTIVO
    ====================================================== */

    const newAssetButton =
        document.getElementById("newAssetButton");

    const assetModal =
        document.getElementById("assetModal");

    const assetForm =
        document.getElementById("assetForm");


    function openAssetModal() {

        if (!assetModal) return;

        assetModal.classList.add("active");

        document.body.classList.add("locked");

    }


    function closeAssetModal() {

        if (!assetModal) return;

        assetModal.classList.remove("active");

        document.body.classList.remove("locked");

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
                   En el prototipo simulamos
                   el registro del activo.
                */

                assetForm.reset();

                closeAssetModal();

            }
        );

    }


    /* =====================================================
       MODAL DETALLE ACTIVO
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

        if (!detailModal) return;

        if (detailAssetName) {

            detailAssetName.textContent =
                assetName;

        }

        detailModal.classList.add("active");

        document.body.classList.add("locked");

    }


    function closeDetailModal() {

        if (!detailModal) return;

        detailModal.classList.remove("active");

        document.body.classList.remove("locked");

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
       CERRAR SESIÓN
    ====================================================== */

    const logoutModal =
        document.getElementById("logoutModal");

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const profileLogout =
        document.getElementById("profileLogout");

    const confirmLogout =
        document.getElementById("confirmLogout");


    function openLogoutModal() {

        if (!logoutModal) return;

        logoutModal.classList.add("active");

        document.body.classList.add("locked");

        if (profile) {
            profile.classList.remove("open");
        }

    }


    function closeLogoutModal() {

        if (!logoutModal) return;

        logoutModal.classList.remove("active");

        document.body.classList.remove("locked");

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
                profile.classList.remove("open");
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
       INICIALIZAR
    ====================================================== */

    filterAssets();

});